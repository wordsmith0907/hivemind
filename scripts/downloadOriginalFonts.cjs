const https = require('https');
const fs = require('fs');
const path = require('path');

const FONTS_DIR = path.join(__dirname, 'public', 'assets', 'fonts');
if (!fs.existsSync(FONTS_DIR)) {
  fs.mkdirSync(FONTS_DIR, { recursive: true });
}

const fontFiles = [
  'Louize-Regular-205TF.woff2',
  'Louize-Italic-205TF.woff2',
  'Louize-Medium-205TF.woff2',
  'Louize-Bold-205TF.woff2',
  'MaisonNeue-Book.woff2',
  'MaisonNeue-Medium.woff2',
  'MaisonNeue-Demi.woff2',
  'MaisonNeue-Light.woff2',
  'Nunito-Regular.woff2',
  'Nunito-Medium.woff2',
  'Nunito-SemiBold.woff2',
  'Satoshi-Variable.woff2',
  'Satoshi-Medium.woff2',
  'Satoshi-Bold.woff2',
  'Satoshi-Italic.woff2',
  'mymindai-Regular.woff2'
];

async function downloadFont(filename) {
  const url = `https://mymind.com/assets/fonts/${filename}`;
  const dest = path.join(FONTS_DIR, filename);

  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(dest);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`Downloaded ${filename} (${fs.statSync(dest).size} bytes)`);
          resolve();
        });
      } else {
        console.warn(`Failed ${filename}: HTTP ${res.statusCode}`);
        resolve(); // continue even if one fails
      }
    }).on('error', (err) => {
      console.warn(`Error ${filename}:`, err.message);
      resolve();
    });
  });
}

async function run() {
  console.log('Downloading mymind original fonts to public/assets/fonts/...');
  for (const f of fontFiles) {
    await downloadFont(f);
  }
  console.log('Finished downloading original mymind fonts!');
}

run();
