// src/process-json.js

const fs = require('fs');
const path = require('path');
const chrono = require('chrono-node');
const compromise = require('compromise');
const { parsePhoneNumberFromString } = require('libphonenumber-js');

const args = process.argv.slice(2);
const isBatch = args.includes('--batch');
const inputPath = args.find(a => !a.startsWith('--')) || '';

if (!inputPath) {
  console.error(`\n❌ No input path provided.
Usage:
  node src/process-json.js <file|folder> [--batch]
`);
  process.exit(1);
}

function extractEmails(text) {
  return (text.match(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/g) || []).filter((v, i, a) => a.indexOf(v) === i);
}

function extractPhones(text) {
  const matches = text.match(/[+()\d\s.-]{7,}/g) || [];
  const valid = [];
  for (const raw of matches) {
    try {
      const phone = parsePhoneNumberFromString(raw);
      if (phone?.isValid()) valid.push(phone.number);
    } catch {}
  }
  return [...new Set(valid)];
}

function extractEntities(text) {
  const doc = compromise(text);
  return {
    people: doc.people().out('array'),
    organizations: doc.organizations().out('array'),
    places: doc.places().out('array'),
    dates: chrono.parse(text).map(d => d.text)
  };
}

function processFile(filepath) {
  const raw = JSON.parse(fs.readFileSync(filepath, 'utf-8'));

  // Flatten to combined string for enrichment
  let combined = '';
  ['about', 'experiences', 'education', 'skills'].forEach(k => {
    const val = raw[k];
    if (Array.isArray(val)) combined += val.join('\n') + '\n';
    else if (typeof val === 'string') combined += val + '\n';
  });

  // Clean output
  const cleaned = {
    name: raw.name,
    headline: raw.headline,
    location: raw.location,
    about: raw.about,
    experiences: raw.experiences,
    education: raw.education,
    skills: raw.skills
  };

  const enriched = {
    ...cleaned,
    emails: extractEmails(combined),
    phoneNumbers: extractPhones(combined),
    entities: extractEntities(combined)
  };

  const outBase = filepath.replace(/\.json$/, '');
  fs.writeFileSync(`${outBase}_clean.json`, JSON.stringify(cleaned, null, 2));
  fs.writeFileSync(`${outBase}_tagged.json`, JSON.stringify(enriched, null, 2));

  console.log(`✅ Processed: ${path.basename(filepath)}`);
}

if (isBatch) {
  const files = fs.readdirSync(inputPath)
    .filter(f => f.endsWith('.json') && !f.includes('_tagged') && !f.includes('_clean'))
    .map(f => path.join(inputPath, f));

  for (const file of files) {
    processFile(file);
  }
} else {
  processFile(inputPath);
}
