/**
 * Regenerates data/image-manifest.ts.
 *
 * Downsamples every listing photo to 8x6 pixels and re-encodes it as a
 * minimal PNG. Next/Image already blurs the placeholder for us, so all we
 * need to ship is the colour field — roughly 200 bytes per image. (sips'
 * own PNG output is ~9KB because it embeds a full ICC profile, and
 * blurDataURL crosses the server/client boundary for every rendered card.)
 *
 * It also records each photo's intrinsic dimensions so VehicleImage can
 * carry a real width/height pair and reserve the correct aspect box.
 *
 * Usage: node scripts/generate-image-manifest.mjs
 */
import { execFileSync } from "node:child_process";
import { deflateSync, inflateSync } from "node:zlib";
import { readdirSync, readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, basename } from "node:path";

const SRC_DIR = "public/images/vehicles";
const OUT_FILE = "data/image-manifest.ts";
const W = 8;
const H = 6;

/** Minimal PNG reader: enough for the tiny 8-bit images sips writes. */
function decodePng(buf) {
  let offset = 8;
  const chunks = [];
  let ihdr = null;
  let palette = null;

  while (offset < buf.length) {
    const length = buf.readUInt32BE(offset);
    const type = buf.toString("ascii", offset + 4, offset + 8);
    const data = buf.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      ihdr = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        bitDepth: data[8],
        colorType: data[9],
      };
    } else if (type === "PLTE") {
      palette = data;
    } else if (type === "IDAT") {
      chunks.push(data);
    } else if (type === "IEND") {
      break;
    }
    offset += 12 + length;
  }

  if (!ihdr) throw new Error("no IHDR");
  if (ihdr.bitDepth !== 8) throw new Error(`bit depth ${ihdr.bitDepth}`);

  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[ihdr.colorType];
  if (!channels) throw new Error(`color type ${ihdr.colorType}`);

  const raw = inflateSync(Buffer.concat(chunks));
  const { width, height } = ihdr;
  const stride = width * channels;
  const out = Buffer.alloc(stride * height);

  // Undo the per-scanline PNG filters.
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? out[y * stride + x - channels] : 0;
      const b = y > 0 ? out[(y - 1) * stride + x] : 0;
      const c =
        x >= channels && y > 0 ? out[(y - 1) * stride + x - channels] : 0;
      let value = line[x];
      if (filter === 1) value += a;
      else if (filter === 2) value += b;
      else if (filter === 3) value += (a + b) >> 1;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        value += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      out[y * stride + x] = value & 0xff;
    }
  }

  const pixels = [];
  for (let i = 0; i < width * height; i++) {
    const at = i * channels;
    if (ihdr.colorType === 3 && palette) {
      const p = out[at] * 3;
      pixels.push([palette[p], palette[p + 1], palette[p + 2]]);
    } else if (channels >= 3) {
      pixels.push([out[at], out[at + 1], out[at + 2]]);
    } else {
      pixels.push([out[at], out[at], out[at]]);
    }
  }
  return { width, height, pixels };
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

/** Minimal 8-bit RGB PNG. No ancillary chunks, no colour profile. */
function encodePng(width, height, pixels) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: truecolour
  const raw = Buffer.alloc(height * (width * 3 + 1));
  for (let y = 0; y < height; y++) {
    const rowStart = y * (width * 3 + 1);
    raw[rowStart] = 0; // filter: none
    for (let x = 0; x < width; x++) {
      const [r, g, b] = pixels[y * width + x];
      raw[rowStart + 1 + x * 3] = r;
      raw[rowStart + 2 + x * 3] = g;
      raw[rowStart + 3 + x * 3] = b;
    }
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const work = mkdtempSync(join(tmpdir(), "blur-"));
const files = readdirSync(SRC_DIR)
  .filter((f) => f.endsWith(".jpg"))
  .sort();

const entries = [];
for (const file of files) {
  const slug = basename(file, ".jpg");
  const png = join(work, `${slug}.png`);
  execFileSync(
    "sips",
    [
      "-s",
      "format",
      "png",
      "-z",
      String(H),
      String(W),
      join(SRC_DIR, file),
      "--out",
      png,
    ],
    { stdio: "ignore" },
  );

  const { width, height, pixels } = decodePng(readFileSync(png));
  const encoded = encodePng(width, height, pixels).toString("base64");

  const probe = execFileSync("sips", [
    "-g",
    "pixelWidth",
    "-g",
    "pixelHeight",
    join(SRC_DIR, file),
  ]).toString();
  const intrinsicWidth = Number(/pixelWidth:\s*(\d+)/.exec(probe)?.[1]);
  const intrinsicHeight = Number(/pixelHeight:\s*(\d+)/.exec(probe)?.[1]);
  if (!intrinsicWidth || !intrinsicHeight) {
    throw new Error(`could not read dimensions for ${file}`);
  }

  entries.push(
    `  "${slug}": {\n` +
      `    width: ${intrinsicWidth},\n` +
      `    height: ${intrinsicHeight},\n` +
      `    blurDataURL:\n      "data:image/png;base64,${encoded}",\n` +
      `  },`,
  );
}

writeFileSync(
  OUT_FILE,
  `/**\n * Auto-generated by scripts/generate-image-manifest.mjs — do not edit by hand.\n *\n * Intrinsic dimensions plus an 8x6 PNG blur placeholder for every listing\n * photo, so cards reserve the right aspect box and paint an approximate\n * frame with zero layout shift.\n */\nexport interface ImageManifestEntry {\n  width: number;\n  height: number;\n  blurDataURL: string;\n}\n\nexport const imageManifest: Record<string, ImageManifestEntry> = {\n${entries.join("\n")}\n};\n`,
);

console.log(`wrote ${entries.length} placeholders -> ${OUT_FILE}`);
