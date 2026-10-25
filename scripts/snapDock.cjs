const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  const ARTIFACT_DIR = 'C:\\Users\\pc\\.gemini\\antigravity\\brain\\6be84443-0d24-4517-94d4-ae95a9e19abd';
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'mobile-dock-clip.png'),
    clip: { x: 0, y: 700, width: 390, height: 144 }
  });
  console.log('Saved mobile-dock-clip.png');
  await browser.close();
})();
