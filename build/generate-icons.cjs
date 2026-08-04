/**
 * generate-icons.cjs
 * Generates Windows .ico and standard .png icon assets from the VersoLyn logo.
 * Uses 'sharp' for high-quality resizing.
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SOURCE_LOGO = path.join(__dirname, "../new-logo/versolyn-dark-logo.png");
const BUILD_DIR = path.join(__dirname, "../build");

if (!fs.existsSync(BUILD_DIR)) {
  fs.mkdirSync(BUILD_DIR, { recursive: true });
}

async function generate() {
  console.log("🎨 Generating VersoLyn icon assets...");

  // 1. Generate standard PNG icons at multiple sizes
  const sizes = [16, 24, 32, 48, 64, 128, 256, 512];
  const pngBuffers = {};

  for (const size of sizes) {
    const outPath = path.join(BUILD_DIR, `icon-${size}.png`);
    await sharp(SOURCE_LOGO)
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(outPath);
    pngBuffers[size] = fs.readFileSync(outPath);
    console.log(`  ✓ icon-${size}.png`);
  }

  // 2. Copy 512px as main icon.png
  fs.copyFileSync(
    path.join(BUILD_DIR, "icon-512.png"),
    path.join(BUILD_DIR, "icon.png")
  );
  console.log("  ✓ icon.png (512px)");

  // 3. Build .ico file manually (ICO format with 16, 32, 48, 256 sizes)
  const icoSizes = [16, 32, 48, 256];
  const icoImages = icoSizes.map((size) => ({
    size,
    data: pngBuffers[size],
  }));

  const icoBuffer = buildIco(icoImages);
  fs.writeFileSync(path.join(BUILD_DIR, "icon.ico"), icoBuffer);
  console.log("  ✓ icon.ico (16, 32, 48, 256px)");

  console.log("\n✅ Icon generation complete! Assets saved to build/");
}

/**
 * Builds a Windows ICO file from an array of PNG buffers.
 * ICO format: ICONDIR + ICONDIRENTRYs + image data
 */
function buildIco(images) {
  const count = images.length;
  const ICONDIR_SIZE = 6;
  const ICONDIRENTRY_SIZE = 16;
  const headerSize = ICONDIR_SIZE + count * ICONDIRENTRY_SIZE;

  // Calculate total data size
  let dataOffset = headerSize;
  const entries = images.map(({ size, data }) => {
    const entry = {
      width: size === 256 ? 0 : size, // 256 is stored as 0 in ICO format
      height: size === 256 ? 0 : size,
      colorCount: 0,
      reserved: 0,
      planes: 1,
      bitCount: 32,
      bytesInRes: data.length,
      imageOffset: dataOffset,
    };
    dataOffset += data.length;
    return entry;
  });

  const buffer = Buffer.alloc(dataOffset);
  let offset = 0;

  // ICONDIR
  buffer.writeUInt16LE(0, offset); offset += 2; // idReserved
  buffer.writeUInt16LE(1, offset); offset += 2; // idType (1 = ICO)
  buffer.writeUInt16LE(count, offset); offset += 2; // idCount

  // ICONDIRENTRYs
  for (const e of entries) {
    buffer.writeUInt8(e.width, offset); offset += 1;
    buffer.writeUInt8(e.height, offset); offset += 1;
    buffer.writeUInt8(e.colorCount, offset); offset += 1;
    buffer.writeUInt8(e.reserved, offset); offset += 1;
    buffer.writeUInt16LE(e.planes, offset); offset += 2;
    buffer.writeUInt16LE(e.bitCount, offset); offset += 2;
    buffer.writeUInt32LE(e.bytesInRes, offset); offset += 4;
    buffer.writeUInt32LE(e.imageOffset, offset); offset += 4;
  }

  // Image data
  for (let i = 0; i < images.length; i++) {
    images[i].data.copy(buffer, entries[i].imageOffset);
  }

  return buffer;
}

generate().catch((err) => {
  console.error("❌ Icon generation failed:", err.message);
  process.exit(1);
});
