const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\pc\\.gemini\\antigravity\\brain\\6be84443-0d24-4517-94d4-ae95a9e19abd';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://127.0.0.1:5173/');
  await new Promise(r => setTimeout(r, 1500));

  // Click on the first card to open details
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.masonry-item'));
    if (cards.length > 0) cards[0].click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Click "Why this tag?" button
  await page.evaluate(() => {
    const btn = document.querySelector('button[title="Why this tag?"]');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'popover-why-tag.png') });
  console.log('Saved popover-why-tag.png');
  await browser.close();
})();
