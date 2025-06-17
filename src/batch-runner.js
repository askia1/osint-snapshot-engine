const fs = require('fs');
const { spawnSync } = require('child_process');

const inputFile = process.argv[2];
if (!inputFile || !fs.existsSync(inputFile)) {
  console.error('❌ Provide a valid batch file.');
  process.exit(1);
}

const urls = fs.readFileSync(inputFile, 'utf8')
  .split('\n')
  .map(l => l.trim())
  .filter(l => l.length > 5 && l.startsWith('http'));

const options = process.argv.slice(3); // forward additional CLI flags

for (const url of urls) {
  console.log(`🌐 Target: ${url}`);
  const result = spawnSync('node', ['puppeteer-osint.js', url, ...options], { stdio: 'inherit' });

  if (result.status !== 0) {
    console.warn(`❌ Error with ${url}, continuing...`);
  }
}
