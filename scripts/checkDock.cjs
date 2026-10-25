const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });

  const dock = await page.$('button[aria-label="Remember New Memory"]');
  console.log('dock button found:', !!dock);
  if (dock) {
    const box = await dock.boundingBox();
    console.log('box:', box);
    const isVisible = await dock.isIntersectingViewport();
    console.log('isIntersectingViewport:', isVisible);
  }
  await browser.close();
})();
