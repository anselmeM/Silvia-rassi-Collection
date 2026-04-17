const { chromium } = require('playwright');

(async () => {
  console.log('Starting Playwright test...');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const consoleMessages = [];
  page.on('console', msg => consoleMessages.push({ type: msg.type(), text: msg.text() }));
  page.on('pageerror', err => consoleMessages.push({ type: 'pageerror', text: err.message }));
  
  console.log('Navigating to http://localhost:3004/...');
  await page.goto('http://localhost:3004/');
  
  console.log('Waiting 5 seconds...');
  await page.waitForTimeout(5000);
  
  const result = await page.evaluate(() => {
    const root = document.getElementById('root');
    return {
      title: document.title,
      rootHTML: root?.innerHTML || 'NOT FOUND',
      rootLength: root?.innerHTML?.length || 0,
      bodyChildCount: document.body.childElementCount
    };
  });
  
  console.log('RESULT:', JSON.stringify(result, null, 2));
  console.log('CONSOLE MESSAGES:', JSON.stringify(consoleMessages, null, 2));
  
  await browser.close();
  console.log('Done');
})().catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});