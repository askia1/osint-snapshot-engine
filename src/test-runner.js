const fs = require('fs');
const { spawnSync } = require('child_process');

const testURL = 'https://www.linkedin.com/in/satyanadella';
const outputRegex = /dumps\/.+\.json/;

console.log(`🧪 Running OSINT on test profile...`);
const result = spawnSync('node', ['puppeteer-osint.js', testURL], { encoding: 'utf8' });

if (result.stderr || result.status !== 0) {
  console.error('❌ Error running puppeteer-osint.js');
  process.exit(1);
}

const match = result.stdout.match(outputRegex);
if (!match) {
  console.error('❌ No JSON output file found.');
  process.exit(1);
}

const outFile = match[0];
const data = JSON.parse(fs.readFileSync(outFile));
if (!data.name || !data.location) {
  console.error('❌ Enrichment fields missing.');
  process.exit(1);
}

console.log(`✅ OSINT snapshot test passed.`);
