const sharp = require('sharp');
const pngToIco = require('png-to-ico');
const fs = require('fs').promises;
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const svgFavicon = path.join(publicDir, 'favicon.svg');
const svgOg = path.join(publicDir, 'og-image.svg');

async function svgToPng(svgPath, outPath, width, height) {
  const buffer = await fs.readFile(svgPath);
  await sharp(buffer).resize(width, height, { fit: 'contain' }).png().toFile(outPath);
}

(async () => {
  try {
    // Ensure public exists
    await fs.mkdir(publicDir, { recursive: true });

    // Favicon sizes
    const faviconSizes = [16, 32, 48];
    const faviconPngs = [];
    for (const size of faviconSizes) {
      const out = path.join(publicDir, `favicon-${size}.png`);
      await svgToPng(svgFavicon, out, size, size);
      faviconPngs.push(out);
      console.log(`Generated ${out}`);
    }

    // Create favicon.ico
    const icoBuffer = await pngToIco(faviconPngs);
    await fs.writeFile(path.join(publicDir, 'favicon.ico'), icoBuffer);
    console.log('Generated favicon.ico');

    // Other icons
    const otherSizes = [64, 128, 180, 256, 512];
    for (const size of otherSizes) {
      const out = path.join(publicDir, `icon-${size}.png`);
      await svgToPng(svgFavicon, out, size, size);
      console.log(`Generated ${out}`);
    }

    // OG image PNG (1200x630)
    const ogOut = path.join(publicDir, 'og-image-1200x630.png');
    await svgToPng(svgOg, ogOut, 1200, 630);
    console.log(`Generated ${ogOut}`);

    console.log('All icons generated successfully.');
  } catch (err) {
    console.error('Error generating icons:', err);
    process.exit(1);
  }
})();
