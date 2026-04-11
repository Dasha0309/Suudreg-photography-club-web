/**
 * optimize-images.js
 * PNG/JPG/TIF зургуудыг WebP болгон хөрвүүлж,
 * "© Suudreg Photography Club" усан тэмдэг нэмнэ.
 *
 * Ашиглалт:  npm run optimize-images
 */

const sharp = require('sharp');
const fs    = require('fs');
const path  = require('path');

// ── Тохиргоо ───────────────────────────────────────────────
const INPUT_DIR      = path.join(__dirname, '../assets/images');
const OUTPUT_DIR     = path.join(__dirname, '../assets/images/optimized');
const MAX_WIDTH      = 1920;          // px — хамгийн өргөн
const QUALITY        = 82;            // WebP чанар (0–100)
const WATERMARK_TEXT = '© Suudreg Photography Club';

// Усан тэмдэг нэмэхгүй зургийн нэрс (бүтэн нэр шаардлагагүй, агуулгаараа шалгана)
const NO_WATERMARK = ['logo', 'header'];

// Боловсруулах өргөтгөлүүд
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.tif', '.tiff', '.webp'];
// ───────────────────────────────────────────────────────────

/** Усан тэмдгийн SVG үүсгэнэ */
function makeWatermarkSvg(w, h) {
  const fontSize = Math.max(Math.round(w * 0.026), 14);
  const padX     = Math.round(w * 0.025);
  const padY     = Math.round(h * 0.038);

  return Buffer.from(
    `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="s" x="-5%" y="-5%" width="115%" height="115%">
          <feDropShadow dx="1" dy="1" stdDeviation="2.5"
            flood-color="#000" flood-opacity="0.9"/>
        </filter>
      </defs>
      <text
        x="${w - padX}" y="${h - padY}"
        font-family="Arial, Helvetica, sans-serif"
        font-size="${fontSize}"
        font-weight="bold"
        fill="rgba(255,255,255,0.78)"
        text-anchor="end"
        filter="url(#s)"
      >${WATERMARK_TEXT}</text>
    </svg>`
  );
}

/** Нэг зургийг боловсруулна */
async function processImage(filePath) {
  const ext      = path.extname(filePath);          // original case
  const extLower = ext.toLowerCase();
  const baseName = path.basename(filePath, ext);    // case-sensitive strip

  if (!IMAGE_EXTS.includes(extLower)) return null;
  const outPath  = path.join(OUTPUT_DIR, `${baseName}.webp`);

  const skipWatermark = NO_WATERMARK.some(n =>
    baseName.toLowerCase().includes(n)
  );

  try {
    // Metadata уншина
    const meta = await sharp(filePath).metadata();

    // Гаралтын хэмжээ тооцоолно
    let newW = meta.width  || MAX_WIDTH;
    let newH = meta.height || MAX_WIDTH;
    if (newW > MAX_WIDTH) {
      newH = Math.round(newH * (MAX_WIDTH / newW));
      newW = MAX_WIDTH;
    }

    let pipeline = sharp(filePath).resize({
      width: MAX_WIDTH,
      withoutEnlargement: true,
      fit: 'inside',
    });

    if (!skipWatermark) {
      pipeline = pipeline.composite([{
        input: makeWatermarkSvg(newW, newH),
        blend: 'over',
      }]);
    }

    await pipeline
      .webp({ quality: QUALITY })
      .toFile(outPath);

    const inSize  = fs.statSync(filePath).size;
    const outSize = fs.statSync(outPath).size;
    return {
      baseName,
      inSize,
      outSize,
      reduction: ((1 - outSize / inSize) * 100).toFixed(1),
    };
  } catch (err) {
    console.error(`  ✗ ${path.basename(filePath)}: ${err.message}`);
    return null;
  }
}

/** Гол функц */
async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = fs.readdirSync(INPUT_DIR).filter(f => {
    const ext = path.extname(f).toLowerCase();
    return IMAGE_EXTS.includes(ext);
  });

  console.log(`\n🖼  ${files.length} зургийг боловсруулж байна...\n`);

  let totalIn = 0, totalOut = 0, count = 0;

  for (const file of files) {
    process.stdout.write(`  → ${file} ... `);
    const result = await processImage(path.join(INPUT_DIR, file));

    if (result) {
      totalIn  += result.inSize;
      totalOut += result.outSize;
      count++;

      const inMB  = (result.inSize  / 1024 / 1024).toFixed(1);
      const outKB = (result.outSize / 1024).toFixed(0);
      console.log(`${inMB}MB → ${outKB}KB  (${result.reduction}% багасгалт)`);
    }
  }

  const inMB  = (totalIn  / 1024 / 1024).toFixed(1);
  const outMB = (totalOut / 1024 / 1024).toFixed(1);
  const pct   = ((1 - totalOut / totalIn) * 100).toFixed(1);

  console.log(`\n${'━'.repeat(48)}`);
  console.log(`✅  ${count} зураг боловсруулагдлаа`);
  console.log(`   Нийт: ${inMB} MB  →  ${outMB} MB  (${pct}% багасгалт)`);
  console.log(`   Гаралт: assets/images/optimized/\n`);
}

main().catch(err => {
  console.error('\n❌ Алдаа:', err.message);
  process.exit(1);
});
