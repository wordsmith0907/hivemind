const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\pc\\.gemini\\antigravity\\brain\\6be84443-0d24-4517-94d4-ae95a9e19abd';

async function capture() {
  console.log('Launching Chrome via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  // Helper to wait
  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  // 1. Desktop Screenshot (1440x900, Dark Mode)
  console.log('Capturing Desktop Feed (1440x900, Dark Mode)...');
  const pageDesktop = await browser.newPage();
  await pageDesktop.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await pageDesktop.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0', timeout: 30000 });
  await wait(2000);
  await pageDesktop.screenshot({ path: path.join(ARTIFACT_DIR, 'desktop-feed.png') });
  console.log('Saved desktop-feed.png');

  // 2. Desktop Search Focused with grid dimming
  console.log('Capturing Desktop Search Focused with grid dimming...');
  const searchInput = await pageDesktop.$('input[type="text"]');
  if (searchInput) {
    await searchInput.focus();
    await wait(600);
    await pageDesktop.screenshot({ path: path.join(ARTIFACT_DIR, 'desktop-search-focused.png') });
    console.log('Saved desktop-search-focused.png');
  }

  // 3. Desktop Light Mode (toggle theme)
  console.log('Capturing Desktop Light Mode (1440x900)...');
  const themeToggle = await pageDesktop.$('button[title*="Parchment"]');
  if (themeToggle) {
    await themeToggle.click();
    await wait(800);
    await pageDesktop.screenshot({ path: path.join(ARTIFACT_DIR, 'desktop-light.png') });
    console.log('Saved desktop-light.png');
    // toggle back to dark
    const darkToggle = await pageDesktop.$('button[title*="Obsidian"]');
    if (darkToggle) await darkToggle.click();
  }
  await pageDesktop.close();

  // 4. Tablet Screenshot (768x1024)
  console.log('Capturing Tablet Feed (768x1024)...');
  const pageTablet = await browser.newPage();
  await pageTablet.setViewport({ width: 768, height: 1024, deviceScaleFactor: 2 });
  await pageTablet.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0', timeout: 30000 });
  await wait(1500);
  await pageTablet.screenshot({ path: path.join(ARTIFACT_DIR, 'tablet-feed.png') });
  console.log('Saved tablet-feed.png');
  await pageTablet.close();

  // 5. Mobile Screenshot (390x844 iPhone 14)
  console.log('Capturing Mobile Feed with Floating Dock (390x844)...');
  const pageMobile = await browser.newPage();
  await pageMobile.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await pageMobile.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0', timeout: 30000 });
  await wait(1500);
  await pageMobile.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile-feed.png') });
  console.log('Saved mobile-feed.png');
  await pageMobile.close();

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
