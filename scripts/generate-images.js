import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const publicDir = path.join(process.cwd(), 'public');
const faviconSvg = path.join(publicDir, 'favicon.svg');
const ogSvg = path.join(publicDir, 'og-image.svg');

async function generate() {
  if (!fs.existsSync(faviconSvg)) {
    console.error('favicon.svg not found in public/');
    process.exit(1);
  }
  if (!fs.existsSync(ogSvg)) {
    console.error('og-image.svg not found in public/');
    process.exit(1);
  }

  console.log('Generating PNG favicons...');
  const sizes = [16, 32, 48, 180];
  const pngPaths = [];
  for (const s of sizes) {
    const out = path.join(publicDir, `favicon-${s}.png`);
    await sharp(faviconSvg)
      .resize(s, s)
      .png({ quality: 90 })
      .toFile(out);
    pngPaths.push(out);
    console.log(`Wrote ${out}`);
  }

  console.log('Generating favicon.ico...');
  // png-to-ico expects buffers
  const buffers = await Promise.all(pngPaths.slice(0,3).map(p => fs.promises.readFile(p)));
  const icoBuf = await pngToIco(buffers);
  await fs.promises.writeFile(path.join(publicDir, 'favicon.ico'), icoBuf);
  console.log('Wrote public/favicon.ico');

  console.log('Generating og-image.png (1200x630)...');
  await sharp(ogSvg)
    .resize(1200, 630, { fit: 'cover' })
    .png({ quality: 90 })
    .toFile(path.join(publicDir, 'og-image.png'));
  console.log('Wrote public/og-image.png');

  console.log('Done.');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
