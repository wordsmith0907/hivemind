const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\pc\\.gemini\\antigravity\\brain\\6be84443-0d24-4517-94d4-ae95a9e19abd';

async function run() {
  console.log('Launching Chrome for clean modal and view captures...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  // Helper to get a clean page in light mode
  async function createCleanLightPage() {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0', timeout: 30000 });
    await wait(1000);
    // ensure light mode
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mymind-theme', 'light');
    });
    await wait(300);
    return page;
  }

  // 1. Desktop Light Feed
  console.log('1. Capturing desktop-light.png...');
  {
    const page = await createCleanLightPage();
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'desktop-light.png') });
    await page.close();
  }

  // 2. Modal Quick Save
  console.log('2. Capturing modal-quicksave.png...');
  {
    const page = await createCleanLightPage();
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent && b.textContent.includes('Remember'));
      if (btn) btn.click();
    });
    await wait(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'modal-quicksave.png') });
    await page.close();
  }

  // 3. Serendipity Modal
  console.log('3. Capturing modal-serendipity.png...');
  {
    const page = await createCleanLightPage();
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent && b.textContent.includes('Serendipity'));
      if (btn) btn.click();
    });
    await wait(800);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'modal-serendipity.png') });
    await page.close();
  }

  // 4. Ask Library Drawer
  console.log('4. Capturing drawer-ask-library.png...');
  {
    const page = await createCleanLightPage();
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent && b.textContent.includes('Ask Mind'));
      if (btn) btn.click();
    });
    await wait(800);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'drawer-ask-library.png') });
    await page.close();
  }

  // 5. Card Detail Modal
  console.log('5. Capturing modal-card-detail.png...');
  {
    const page = await createCleanLightPage();
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.masonry-item'));
      if (cards.length > 0) cards[0].click();
    });
    await wait(800);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'modal-card-detail.png') });
    await page.close();
  }

  // 6. Reading Mode Modal
  console.log('6. Capturing modal-reading-mode.png...');
  {
    const page = await createCleanLightPage();
    // Click reading mode directly from card action button
    const opened = await page.evaluate(() => {
      const btn = document.querySelector('button[title*="Reading Mode"]');
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    if (!opened) {
      // open card first
      await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('.masonry-item'));
        if (cards.length > 0) cards[0].click();
      });
      await wait(500);
      await page.evaluate(() => {
        const btn = document.querySelector('button[title="Reading Mode"]');
        if (btn) btn.click();
      });
    }
    await wait(1000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'modal-reading-mode.png') });
    await page.close();
  }

  // 7. Desktop Dark Mode Feed
  console.log('7. Capturing desktop-dark.png...');
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0', timeout: 30000 });
    await wait(1000);
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('mymind-theme', 'dark');
    });
    await wait(400);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'desktop-dark.png') });
    await page.close();
  }

  await browser.close();
  console.log('All clean screenshots captured successfully!');
}

run().catch(e => {
  console.error('Capture error:', e);
  process.exit(1);
});
