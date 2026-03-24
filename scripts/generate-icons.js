/**
 * Generate PWA PNG icons without any external dependencies.
 * Creates simple solid-color icons with a chef hat silhouette.
 * Uses raw PNG encoding with zlib compression (Node.js built-in).
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPNG(width, height, pixels) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      crc ^= buf[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
      }
    }
    return (crc ^ -1) >>> 0;
  }

  function chunk(type, data) {
    const typeBytes = Buffer.from(type, 'ascii');
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const combined = Buffer.concat([typeBytes, data]);
    const crcVal = Buffer.alloc(4);
    crcVal.writeUInt32BE(crc32(combined), 0);
    return Buffer.concat([len, combined, crcVal]);
  }

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // color type: RGB
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // IDAT - raw pixel data with filter byte per row
  const rawData = Buffer.alloc(height * (1 + width * 3));
  for (let y = 0; y < height; y++) {
    rawData[y * (1 + width * 3)] = 0; // filter: none
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 3;
      const dstIdx = y * (1 + width * 3) + 1 + x * 3;
      rawData[dstIdx] = pixels[srcIdx];
      rawData[dstIdx + 1] = pixels[srcIdx + 1];
      rawData[dstIdx + 2] = pixels[srcIdx + 2];
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // IEND
  const iend = Buffer.alloc(0);

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', iend),
  ]);
}

function generateIcon(size) {
  const pixels = Buffer.alloc(size * size * 3);

  // Background color: #1e40af
  const bgR = 0x1e, bgG = 0x40, bgB = 0xaf;
  // Icon color: white
  const fgR = 0xff, fgG = 0xff, fgB = 0xff;

  function setPixel(x, y, r, g, b) {
    if (x < 0 || x >= size || y < 0 || y >= size) return;
    x = Math.floor(x);
    y = Math.floor(y);
    const idx = (y * size + x) * 3;
    pixels[idx] = r;
    pixels[idx + 1] = g;
    pixels[idx + 2] = b;
  }

  function dist(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  }

  const s = size / 512; // scale factor

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Normalized coordinates (as if 512x512)
      const nx = x / s;
      const ny = y / s;

      // Start with background
      let r = bgR, g = bgG, b = bgB;

      // Chef hat - three puffs (circles)
      const isPuff1 = dist(nx, ny, 200, 140) < 55;
      const isPuff2 = dist(nx, ny, 256, 115) < 60;
      const isPuff3 = dist(nx, ny, 312, 140) < 55;

      // Chef hat - main dome (ellipse)
      const domeX = (nx - 256) / 120;
      const domeY = (ny - 180) / 100;
      const isDome = (domeX * domeX + domeY * domeY) < 1;

      // Chef hat - band (rectangle)
      const isBand = nx >= 160 && nx <= 352 && ny >= 230 && ny <= 280;

      // Percentage sign area - circle background
      const isPlateRing = Math.abs(dist(nx, ny, 256, 375) - 65) < 3;

      // Simple percentage "%" text approximation
      // Top-left circle of %
      const isPctTopCircle = dist(nx, ny, 232, 355) < 16;
      const isPctTopCircleInner = dist(nx, ny, 232, 355) < 8;
      // Bottom-right circle of %
      const isPctBotCircle = dist(nx, ny, 280, 395) < 16;
      const isPctBotCircleInner = dist(nx, ny, 280, 395) < 8;
      // Diagonal slash
      const slashCenterX = 256;
      const slashCenterY = 375;
      const slashAngle = Math.atan2(ny - slashCenterY, nx - slashCenterX);
      const slashDist = dist(nx, ny, slashCenterX, slashCenterY);
      const isSlash = slashDist < 45 &&
        Math.abs(Math.sin(slashAngle + 0.6) * slashDist) < 5;

      // Determine if pixel is part of the icon
      let isWhite = false;

      if (isPuff1 || isPuff2 || isPuff3 || isDome || isBand) {
        isWhite = true;
      }

      if (isPlateRing) {
        // Semi-transparent ring - blend
        r = Math.floor(bgR * 0.7 + fgR * 0.3);
        g = Math.floor(bgG * 0.7 + fgG * 0.3);
        b = Math.floor(bgB * 0.7 + fgB * 0.3);
        isWhite = false;
      }

      if ((isPctTopCircle && !isPctTopCircleInner) ||
          (isPctBotCircle && !isPctBotCircleInner) ||
          isSlash) {
        isWhite = true;
      }

      if (isWhite) {
        r = fgR;
        g = fgG;
        b = fgB;
      }

      setPixel(x, y, r, g, b);
    }
  }

  return createPNG(size, size, pixels);
}

// Generate icons
const outDir = path.join(__dirname, '..', 'client', 'public');

console.log('Generating 192x192 icon...');
const icon192 = generateIcon(192);
fs.writeFileSync(path.join(outDir, 'icon-192.png'), icon192);
console.log(`  Written: icon-192.png (${icon192.length} bytes)`);

console.log('Generating 512x512 icon...');
const icon512 = generateIcon(512);
fs.writeFileSync(path.join(outDir, 'icon-512.png'), icon512);
console.log(`  Written: icon-512.png (${icon512.length} bytes)`);

console.log('Done! Icons generated in client/public/');
