/**
 * Screenshots pages at real device widths via the Chrome DevTools Protocol.
 *
 * `--window-size` alone is not enough: macOS clamps the browser window to a
 * minimum width, so narrow layouts get cropped rather than reflowed.
 * Emulation.setDeviceMetricsOverride sets the layout viewport directly.
 *
 * Usage:
 *   node scripts/screenshot.mjs <outDir> <width>x<height>[:label] <path> [...]
 *   node scripts/screenshot.mjs /tmp/shots 390x1400 1280x1600 / /vehicles
 */
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const CHROME =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const PORT = 9333;

const args = process.argv.slice(2);
const outDir = args.shift();
if (!outDir) throw new Error("usage: screenshot.mjs <outDir> <WxH> <path>...");
mkdirSync(outDir, { recursive: true });

const sizes = [];
const paths = [];
for (const arg of args) {
  if (/^\d+x\d+$/.test(arg)) {
    const [w, h] = arg.split("x").map(Number);
    sizes.push({ w, h });
  } else {
    paths.push(arg);
  }
}
if (!sizes.length) sizes.push({ w: 1440, h: 1600 });
if (!paths.length) paths.push("/");

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--disable-extensions",
    `--remote-debugging-port=${PORT}`,
    "--user-data-dir=" + join(outDir, ".chrome-profile"),
    "about:blank",
  ],
  { stdio: "ignore" },
);

let target;
for (let i = 0; i < 60; i++) {
  try {
    const list = await fetch(`http://127.0.0.1:${PORT}/json/list`).then((r) =>
      r.json(),
    );
    target = list.find((t) => t.type === "page");
    if (target) break;
  } catch {
    /* not listening yet */
  }
  await wait(250);
}
if (!target) {
  chrome.kill();
  throw new Error("Chrome did not expose a debugging target");
}

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let nextId = 0;
const pending = new Map();
const events = [];

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id !== undefined) {
    const entry = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) entry.reject(new Error(message.error.message));
    else entry.resolve(message.result);
  } else {
    events.push(message);
  }
});

function send(method, params = {}) {
  const id = ++nextId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

await send("Page.enable");
await send("Runtime.enable");
await send("Console.enable");
await send("Log.enable");

const problems = [];

for (const { w, h } of sizes) {
  await send("Emulation.setDeviceMetricsOverride", {
    width: w,
    height: h,
    deviceScaleFactor: 1,
    mobile: w < 768,
  });

  for (const path of paths) {
    events.length = 0;
    await send("Page.navigate", { url: `${BASE}${path}` });
    await wait(2600);

    // Overflow, console errors and image failures, measured in the page.
    const probe = await send("Runtime.evaluate", {
      expression: `(() => {
        const doc = document.documentElement;
        const overflow = doc.scrollWidth - doc.clientWidth;
        const wide = [];
        if (overflow > 1) {
          for (const el of document.querySelectorAll('body *')) {
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) continue;
            if (r.right > doc.clientWidth + 1 || r.left < -1) {
              const style = getComputedStyle(el);
              if (style.position === 'fixed') continue;
              wide.push(el.tagName.toLowerCase() + '.' + (el.className?.toString?.().slice(0, 90) ?? '') + ' right=' + Math.round(r.right));
              if (wide.length > 6) break;
            }
          }
        }
        const brokenImages = [...document.images]
          .filter((i) => i.complete && i.naturalWidth === 0)
          .map((i) => i.currentSrc || i.src);
        return JSON.stringify({ overflow, wide, brokenImages, scrollHeight: doc.scrollHeight });
      })()`,
      returnByValue: true,
    });

    const info = JSON.parse(probe.result.value);
    const label = `${path === "/" ? "home" : path.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}-${w}`;

    if (info.overflow > 1) {
      problems.push(
        `${label}: horizontal overflow ${info.overflow}px -> ${info.wide.join(" | ")}`,
      );
    }
    if (info.brokenImages.length) {
      problems.push(`${label}: broken images ${info.brokenImages.join(", ")}`);
    }
    for (const event of events) {
      if (
        event.method === "Log.entryAdded" &&
        event.params.entry.level === "error"
      ) {
        problems.push(`${label}: console error — ${event.params.entry.text}`);
      }
    }

    const shot = await send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: true,
      clip: {
        x: 0,
        y: 0,
        width: w,
        height: Math.min(info.scrollHeight, h),
        scale: 1,
      },
    });
    writeFileSync(
      join(outDir, `${label}.png`),
      Buffer.from(shot.data, "base64"),
    );
    console.log(`shot ${label}.png  (page height ${info.scrollHeight})`);
  }
}

socket.close();
chrome.kill();

if (problems.length) {
  console.log("\nISSUES");
  for (const problem of problems) console.log("  - " + problem);
  process.exitCode = 1;
} else {
  console.log("\nNo overflow, broken images or console errors.");
}
