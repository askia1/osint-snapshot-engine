const express = require('express');
const path = require('path');
const { spawnSync } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = 3344;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'gui')));

app.post('/run', async (req, res) => {
  const { urls, html, ss, pdf } = req.body;
  if (!urls || !Array.isArray(urls)) return res.status(400).send("No URLs provided");

  let log = '';

  for (const url of urls) {
    log += `\n🌀 Processing ${url}\n`;
    const args = ['src/puppeteer-osint.js', url];
    if (html) args.push('--html');
    if (ss) args.push('--screenshot');

    const result = spawnSync('node', args, { encoding: 'utf8' });
    log += result.stdout || '';
    log += result.stderr || '';

    const basename = url.replace(/[^\w]/g, '_').slice(0, 80);
    const taggedPath = `dumps/${basename}_tagged.json`;
    if (fs.existsSync(taggedPath) && pdf) {
      const rpt = spawnSync('node', ['src/generate-report.js', taggedPath, '--pdf'], { encoding: 'utf8' });
      log += rpt.stdout || '';
      log += rpt.stderr || '';
    }
  }

  res.send(log);
});

app.listen(PORT, () => {
  console.log(`🌐 GUI running at http://localhost:${PORT}`);
});
