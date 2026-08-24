/**
 * Renders the brand mark to the static assets that cannot be produced by
 * Next's `ImageResponse` routes:
 *
 *   public/images/brand/logo-512.png  — Organization logo for JSON-LD
 *   app/favicon.ico                   — the path browsers probe for
 *   app/icon.png                      — the <link rel="icon"> Next injects
 *   app/apple-icon.png                — iOS home-screen icon
 *
 * All static, so the mark is identical everywhere. `app/opengraph-image.tsx`
 * still generates the social card at build time, since that one is
 * typographic rather than a bare glyph.
 *
 * Usage: node scripts/generate-brand-assets.mjs
 */
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const CHROME =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const MARK = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="SIZE" height="SIZE">
  <rect width="32" height="32" rx="8" fill="#de4b12"/>
  <path d="M6 21.5h3.2M22.8 21.5H26" stroke="white" stroke-width="1.6" stroke-linecap="round" opacity="0.55"/>
  <path d="M7 12.2h9.4a1 1 0 0 1 1 1v6.3H7a1 1 0 0 1-1-1v-5.3a1 1 0 0 1 1-1Z" fill="white"/>
  <path d="M17.4 14.9h3.5a1 1 0 0 1 .83.44l2.1 3.1a1 1 0 0 1 .17.56v.5H17.4v-4.6Z" fill="white" opacity="0.82"/>
  <circle cx="11.6" cy="21.4" r="2.5" fill="white"/>
  <circle cx="11.6" cy="21.4" r="1" fill="#de4b12"/>
  <circle cx="21.3" cy="21.4" r="2.5" fill="white"/>
  <circle cx="21.3" cy="21.4" r="1" fill="#de4b12"/>
</svg>`;

const work = join(tmpdir(), `brand-${Date.now()}`);
mkdirSync(work, { recursive: true });

function renderPng(size, outFile) {
  const html = `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:transparent}</style>${MARK.replaceAll("SIZE", String(size))}`;
  const htmlFile = join(work, `mark-${size}.html`);
  writeFileSync(htmlFile, html);

  return new Promise((resolve, reject) => {
    const child = spawn(CHROME, [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--default-background-color=00000000",
      `--screenshot=${outFile}`,
      `--window-size=${size},${size}`,
      `file://${htmlFile}`,
    ]);
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`chrome exited ${code}`))));
    child.on("error", reject);
  });
}

/** ICO container wrapping a single PNG, which every modern browser reads. */
function pngToIco(png, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // one image

  const entry = Buffer.alloc(16);
  entry[0] = size >= 256 ? 0 : size; // 0 means 256
  entry[1] = size >= 256 ? 0 : size;
  entry[2] = 0; // palette size
  entry[3] = 0; // reserved
  entry.writeUInt16LE(1, 4); // colour planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(header.length + entry.length, 12);

  return Buffer.concat([header, entry, png]);
}

mkdirSync("public/images/brand", { recursive: true });

const logoPath = "public/images/brand/logo-512.png";
await renderPng(512, logoPath);
console.log(`wrote ${logoPath}`);

await renderPng(192, "app/icon.png");
console.log("wrote app/icon.png");

await renderPng(180, "app/apple-icon.png");
console.log("wrote app/apple-icon.png");

const icoSource = join(work, "favicon-32.png");
await renderPng(32, icoSource);
writeFileSync("app/favicon.ico", pngToIco(readFileSync(icoSource), 32));
console.log("wrote app/favicon.ico");

rmSync(work, { recursive: true, force: true });
