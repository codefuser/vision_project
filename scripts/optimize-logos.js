import sharp from 'sharp';
import fs from 'node:fs';

async function optimize() {
  console.log('Optimizing logo files...');
  const darkBuffer = await sharp('new-logo/versolyn-dark-logo.png')
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 85, compressionLevel: 9 })
    .toBuffer();

  const lightBuffer = await sharp('new-logo/versolyn-light-logo.png')
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 85, compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync('src/assets/logo/versolyn-dark-logo.png', darkBuffer);
  fs.writeFileSync('public/versolyn-logo-dark.png', darkBuffer);
  fs.writeFileSync('public/dark-logo.png', darkBuffer);

  fs.writeFileSync('src/assets/logo/versolyn-light-logo.png', lightBuffer);
  fs.writeFileSync('public/versolyn-logo-light.png', lightBuffer);
  fs.writeFileSync('public/versolyn-logo.png', lightBuffer);

  console.log('SUCCESS! Optimized Dark Logo size:', Math.round(darkBuffer.length / 1024), 'KB');
  console.log('SUCCESS! Optimized Light Logo size:', Math.round(lightBuffer.length / 1024), 'KB');
}

optimize().catch(console.error);
