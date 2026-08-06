import fs from 'node:fs';

const darkBase64 = fs.readFileSync('src/assets/logo/versolyn-dark-logo.png').toString('base64');
const lightBase64 = fs.readFileSync('src/assets/logo/versolyn-light-logo.png').toString('base64');

const darkDataUri = 'data:image/png;base64,' + darkBase64;
const lightDataUri = 'data:image/png;base64,' + lightBase64;

const content = `// Auto-generated inline logo data URIs to guarantee 100% reliable rendering without network requests
export const DARK_LOGO_DATA_URI = "${darkDataUri}";
export const LIGHT_LOGO_DATA_URI = "${lightDataUri}";
`;

fs.writeFileSync('src/components/ui/logo-data.ts', content);
console.log('Generated logo-data.ts successfully! Dark size:', darkDataUri.length, 'Light size:', lightDataUri.length);
