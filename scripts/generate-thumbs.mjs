import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SUPPORTED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const ROOT = path.resolve("src/assets/albums");
const THUMB_DIR_NAME = "thumbs";
const THUMB_WIDTH = 900;
const THUMB_QUALITY = 72;

const isSupportedImage = (filePath) => SUPPORTED_EXTENSIONS.has(path.extname(filePath).toLowerCase());

const ensureDir = async (dirPath) => {
  await fs.mkdir(dirPath, { recursive: true });
};

const shouldSkipThumb = async (srcPath, thumbPath) => {
  try {
    const [srcStat, thumbStat] = await Promise.all([fs.stat(srcPath), fs.stat(thumbPath)]);
    return thumbStat.mtimeMs >= srcStat.mtimeMs;
  } catch {
    return false;
  }
};

const createThumb = async (srcPath, thumbPath) => {
  const extension = path.extname(srcPath).toLowerCase();
  const pipeline = sharp(srcPath).resize({ width: THUMB_WIDTH, withoutEnlargement: true });

  if (extension === ".png") {
    await pipeline.png({ quality: THUMB_QUALITY }).toFile(thumbPath);
    return;
  }

  if (extension === ".webp") {
    await pipeline.webp({ quality: THUMB_QUALITY }).toFile(thumbPath);
    return;
  }

  if (extension === ".avif") {
    await pipeline.avif({ quality: THUMB_QUALITY }).toFile(thumbPath);
    return;
  }

  await pipeline.jpeg({ quality: THUMB_QUALITY }).toFile(thumbPath);
};

const walk = async (dirPath, results = []) => {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === THUMB_DIR_NAME) {
        continue;
      }
      await walk(fullPath, results);
    } else if (isSupportedImage(fullPath)) {
      results.push(fullPath);
    }
  }
  return results;
};

const main = async () => {
  try {
    await fs.access(ROOT);
  } catch {
    console.log("No albums directory found, skipping thumbnail generation.");
    return;
  }

  const sources = await walk(ROOT);
  if (sources.length === 0) {
    console.log("No album images found, skipping thumbnail generation.");
    return;
  }

  let generated = 0;
  for (const srcPath of sources) {
    const rel = path.relative(ROOT, srcPath);
    const albumDir = path.dirname(rel);
    const filename = path.basename(rel);
    const thumbDir = path.join(ROOT, albumDir, THUMB_DIR_NAME);
    const thumbPath = path.join(thumbDir, filename);

    await ensureDir(thumbDir);
    if (await shouldSkipThumb(srcPath, thumbPath)) {
      continue;
    }

    await createThumb(srcPath, thumbPath);
    generated += 1;
  }

  console.log(`Generated ${generated} thumbnail${generated === 1 ? "" : "s"}.`);
};

main().catch((error) => {
  console.error("Thumbnail generation failed:", error);
  process.exit(1);
});
