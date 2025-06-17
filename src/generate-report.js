const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const args = process.argv.slice(2);
const inputFile = args[0];
const makePdf = args.includes('--pdf');

if (!inputFile || !inputFile.endsWith('_tagged.json')) {
  console.error('\n❌ Usage: node generate-report.js <path_to_tagged_json> [--pdf]');
  process.exit(1);
}

if (!fs.existsSync(inputFile)) {
  console.error(`❌ File not found: ${inputFile}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
const basename = path.basename(inputFile, '_tagged.json');
const outputDir = path.join('reports');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

function section(title, body) {
  return `<h2>${title}</h2><div>${body}</div>`;
}

function arrayToHtml(arr) {
  return `<ul>${arr.map(i => `<li>${i}</li>`).join('')}</ul>`;
}

const html = `
<html>
  <head>
    <title>OSINT Report: ${data.name}</title>
    <style>
      body { font-family: Arial; max-width: 800px; margin: auto; padding: 2rem; color: #333; }
      h1, h2 { border-bottom: 1px solid #ddd; padding-bottom: 4px; }
      ul { padding-left: 20px; }
      .tag { display: inline-block; background: #eee; margin: 2px; padding: 2px 6px; border-radius: 4px; }
    </style>
  </head>
  <body>
    <h1>${data.name || 'Unnamed'} — OSINT Profile</h1>
    <p><strong>Headline:</strong> ${data.headline || 'N/A'}</p>
    <p><strong>Location:</strong> ${data.location || 'N/A'}</p>

    ${section('About', data.about || 'N/A')}
    ${section('Experience', arrayToHtml(data.experiences || []))}
    ${section('Education', arrayToHtml(data.education || []))}
    ${section('Skills', arrayToHtml(data.skills || []))}
    ${section('Emails', arrayToHtml(data.emails || []))}
    ${section('Phone Numbers', arrayToHtml(data.phoneNumbers || []))}

    <h2>Entities</h2>
    <p><strong>People:</strong> ${data.entities?.people?.map(e => `<span class="tag">${e}</span>`).join(' ') || 'N/A'}</p>
    <p><strong>Orgs:</strong> ${data.entities?.organizations?.map(e => `<span class="tag">${e}</span>`).join(' ') || 'N/A'}</p>
    <p><strong>Places:</strong> ${data.entities?.places?.map(e => `<span class="tag">${e}</span>`).join(' ') || 'N/A'}</p>
    <p><strong>Dates:</strong> ${data.entities?.dates?.map(e => `<span class="tag">${e}</span>`).join(' ') || 'N/A'}</p>
  </body>
</html>
`;

const htmlOut = path.join(outputDir, `${basename}.html`);
fs.writeFileSync(htmlOut, html);
console.log(`📄 HTML report saved to: ${htmlOut}`);

if (!makePdf) process.exit(0);

// Optional PDF rendering
(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfPath = path.join(outputDir, `${basename}.pdf`);
  await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
  await browser.close();
  console.log(`🧾 PDF report saved to: ${pdfPath}`);
})();
