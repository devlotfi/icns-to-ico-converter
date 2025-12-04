import type { Result } from "./types/result";

interface BlobWithSize {
  size: number;
  blob: Blob;
}

async function readFile(file: File) {
  return new Uint8Array(await file.arrayBuffer());
}

async function cropTransparentPadding(pngBlob: Blob) {
  // 1. Load blob into an Image
  const img = await createImageBitmap(pngBlob);

  // 2. Draw to canvas
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Cannot get context");
  ctx.drawImage(img, 0, 0);

  // 3. Read pixel data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = imageData;

  let minX = width,
    minY = height,
    maxX = 0,
    maxY = 0;
  let foundPixel = false;

  // 4. Scan alpha channel to find visible pixels
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha !== 0) {
        foundPixel = true;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (!foundPixel) return pngBlob; // fully transparent image

  const cropWidth = maxX - minX + 1;
  const cropHeight = maxY - minY + 1;

  // 5. Crop to new canvas
  const croppedCanvas = document.createElement("canvas");
  croppedCanvas.width = cropWidth;
  croppedCanvas.height = cropHeight;
  const croppedCtx = croppedCanvas.getContext("2d");
  if (!croppedCtx) throw new Error("Cannot get context");
  croppedCtx.drawImage(
    canvas,
    minX,
    minY,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight
  );

  // 6. Convert back to Blob
  return await new Promise<Blob>((resolve) => {
    croppedCanvas.toBlob((blob) => {
      if (!blob) throw new Error("Cannot convert to blob");
      resolve(blob);
    }, "image/png");
  });
}

/* -----------------------------------
   Parse ICNS: extract PNG chunks
----------------------------------- */
function parseICNS(buffer: Uint8Array) {
  const images = [];
  const view = new DataView(buffer.buffer);

  let offset = 8; // skip "icns" + length

  while (offset < buffer.length) {
    const type =
      String.fromCharCode(buffer[offset]) +
      String.fromCharCode(buffer[offset + 1]) +
      String.fromCharCode(buffer[offset + 2]) +
      String.fromCharCode(buffer[offset + 3]);

    const size = view.getUint32(offset + 4, false);
    const data = buffer.slice(offset + 8, offset + size);

    // Apple ICNS PNG entries
    if (type.startsWith("ic") || type.startsWith("it")) {
      images.push(new Blob([data], { type: "image/png" }));
    }

    offset += size;
  }

  return images;
}

/* -----------------------------------
   Create ICO file from PNG buffers
----------------------------------- */

async function generateIconSizes(
  blob: Blob,
  sizes: number[] = [512, 256, 128, 64, 48, 32, 24, 16]
) {
  const img = await createImageBitmap(blob);

  const results: BlobWithSize[] = [];

  for (const size of sizes) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Cannot get context");
    ctx.clearRect(0, 0, size, size);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // --- aspect-ratio preserving fit ---
    const scale = Math.min(size / img.width, size / img.height);
    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;

    const offsetX = (size - drawWidth) / 2;
    const offsetY = (size - drawHeight) / 2;

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    const resizedBlob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((blob) => {
        if (!blob) throw new Error("Cannot convert to blob");
        resolve(blob);
      }, "image/png")
    );

    results.push({ size, blob: resizedBlob });
  }

  return results;
}

async function pngBlobsToIco(pngBlobsWithSizes: BlobWithSize[]) {
  // Sort by size ascending (ICO spec preference)
  const images = [...pngBlobsWithSizes].sort((a, b) => a.size - b.size);

  const pngBuffers = await Promise.all(images.map((i) => i.blob.arrayBuffer()));

  const imageCount = images.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const offset = headerSize + imageCount * dirEntrySize;
  const totalSize = offset + pngBuffers.reduce((s, b) => s + b.byteLength, 0);

  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);

  // --- ICONDIR Header ---
  view.setUint16(0, 0, true); // Reserved
  view.setUint16(2, 1, true); // Type = ICO
  view.setUint16(4, imageCount, true);

  // --- Directory Entries ---
  let dirOffset = 6;
  let dataOffset = offset;

  for (let i = 0; i < imageCount; i++) {
    const { size } = images[i];
    const pngData = pngBuffers[i];

    view.setUint8(dirOffset + 0, size === 256 ? 0 : size); // width
    view.setUint8(dirOffset + 1, size === 256 ? 0 : size); // height
    view.setUint8(dirOffset + 2, 0); // color count
    view.setUint8(dirOffset + 3, 0); // reserved
    view.setUint16(dirOffset + 4, 1, true); // planes
    view.setUint16(dirOffset + 6, 32, true); // bit count
    view.setUint32(dirOffset + 8, pngData.byteLength, true);
    view.setUint32(dirOffset + 12, dataOffset, true);

    new Uint8Array(buffer, dataOffset).set(new Uint8Array(pngData));

    dirOffset += 16;
    dataOffset += pngData.byteLength;
  }

  return new Blob([buffer], { type: "image/x-icon" });
}

async function pickLargestByResolution(blobs: Blob[]) {
  let bestBlob = null;
  let bestPixels = 0;

  for (const blob of blobs) {
    const img = await createImageBitmap(blob);
    const pixels = img.width * img.height;

    if (pixels > bestPixels) {
      bestPixels = pixels;
      bestBlob = blob;
    }
  }

  return bestBlob;
}

/* -----------------------------------
   Main Convert Function
----------------------------------- */
export async function convertToICNS(file: File): Promise<Result | null> {
  const buffer = await readFile(file);
  const images = parseICNS(buffer);

  if (!images.length) {
    alert("No PNG images found in ICNS file.");
    return null;
  }

  const maxSize = await pickLargestByResolution(images);
  if (!maxSize) throw new Error("No valid image found in ICNS");

  const croppedBlob = await cropTransparentPadding(maxSize);

  const icons = await generateIconSizes(croppedBlob);

  const icoBlob = await pngBlobsToIco(icons);

  // ✅ Create output filename
  const baseName = file.name.replace(/\.icns$/i, "");
  const outputFileName = `${baseName}.ico`;

  // ✅ Return the blob with its filename
  const result: Result = {
    fileName: outputFileName,
    blob: icoBlob,
  };

  /*   if (result) {
    const url = URL.createObjectURL(result.blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = result.fileName;
    a.click();

    URL.revokeObjectURL(url);
  } */

  return result;
}
