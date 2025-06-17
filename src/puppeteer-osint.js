// src/puppeteer-osint.js

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

puppeteer.use(StealthPlugin());

const args = process.argv.slice(2);
const targetURL = args[0];
const options = {
  screenshot: args.includes('--screenshot'),
  htmlDump: args.includes('--html'),
  verbose: args.includes('--verbose'),
  cookie: null,
  delay: 0,
};

const cookieArg = args.find(arg => arg.startsWith('--cookie='));
if (cookieArg) options.cookie = cookieArg.split('=')[1];

const delayArg = args.find(arg => arg.startsWith('--delay='));
if (delayArg) options.delay = parseInt(delayArg.split('=')[1]);

if (!targetURL || targetURL.startsWith('--')) {
  console.error("\n❌ Usage: node puppeteer-osint.js <url> [--cookie=] [--screenshot] [--html] [--verbose]");
  process.exit(1);
}

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114 Safari/537.36');
  await page.setViewport({ width: 1280, height: 800 });

  if (options.cookie) {
    await page.setCookie({
      name: 'li_at',
      value: options.cookie,
      domain: '.linkedin.com',
      path: '/',
      httpOnly: true,
      secure: true
    });
  }

  if (options.verbose) {
    page.on('console', msg => console.log(`[PAGE LOG]: ${msg.text()}`));
  }

  console.log(`🌐 Navigating to: ${targetURL}`);
  await page.goto(targetURL, { waitUntil: 'networkidle2', timeout: 60000 });

  // Expand "see more"
  await page.evaluate(() => {
    document.querySelectorAll('button, span').forEach(el => {
      if (el.innerText && el.innerText.toLowerCase().includes('see more')) el.click();
    });
  });

  await new Promise(r => setTimeout(r, 3000));

  const safeName = targetURL.replace(/[^\w]/g, '_').slice(0, 80);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outPath = `outputs/${safeName}_${timestamp}`;
  if (!fs.existsSync('outputs')) fs.mkdirSync('outputs');

  const content = await page.content();
  fs.writeFileSync(`${outPath}.json`, JSON.stringify({ url: targetURL, content }, null, 2));

  if (options.screenshot) {
    await page.screenshot({ path: `${outPath}.png`, fullPage: true });
    console.log(`📸 Screenshot saved: ${outPath}.png`);
  }

  if (options.htmlDump) {
    fs.writeFileSync(`${outPath}.html`, content);
    console.log(`💾 HTML dump saved: ${outPath}.html`);
  }

  await browser.close();
})();
