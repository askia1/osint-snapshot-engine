const fs = require('fs');

const inputFile = process.argv[2];
if (!inputFile || !fs.existsSync(inputFile)) {
  console.error("❌ Usage: node risk-analyzer.js <tagged.json>");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
const text = JSON.stringify(data).toLowerCase();

function scoreCategory(name, condition) {
  return {
    category: name,
    risk: condition ? 'HIGH' : 'LOW',
    signal: condition
  };
}

const riskTable = [
  scoreCategory('Contact Exposure', (data.emails?.length || 0) + (data.phones?.length || 0) > 2),
  scoreCategory('Entity Overlap', (data.entities?.organizations?.length || 0) > 2 || (data.entities?.people?.length || 0) > 3),
  scoreCategory('Legal Mentions', /(court|affidavit|case\s?no|lawsuit|complaint)/.test(text)),
  scoreCategory('Network Surface', /(cloudflare|wordpress|analytics|ip|cdn)/.test(text)),
  scoreCategory('Public Metadata', /(passport|nid|id card|ssn|pan number)/.test(text))
];

const summary = {
  target: data.url || 'Unknown',
  timestamp: new Date().toISOString(),
  scorecard: riskTable
};

const outputFile = inputFile.replace(/\.json$/, '_risk.json');
fs.writeFileSync(outputFile, JSON.stringify(summary, null, 2));

console.log(`✅ Risk summary saved to: ${outputFile}`);
