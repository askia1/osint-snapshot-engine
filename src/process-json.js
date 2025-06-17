const fs = require('fs');
const compromise = require('compromise');
const chrono = require('chrono-node');
const { parsePhoneNumberFromString } = require('libphonenumber-js');

const inputFile = process.argv[2];
if (!inputFile || !fs.existsSync(inputFile)) {
  console.error("❌ Usage: node process-json.js <input.json>");
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
const text = raw.content || "";

function extractEmails(text) {
  return (text.match(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/g) || [])
    .filter((v, i, a) => a.indexOf(v) === i);
}

function extractPhones(text) {
  const phones = [];
  const match = text.match(/[+()\d\s.-]{7,}/g) || [];
  match.forEach(m => {
    try {
      const phone = parsePhoneNumberFromString(m);
      if (phone && phone.isValid()) phones.push(phone.number);
    } catch {}
  });
  return [...new Set(phones)];
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

const enriched = {
  ...raw,
  emails: extractEmails(text),
  phones: extractPhones(text),
  entities: extractEntities(text)
};

const taggedPath = inputFile.replace(/\.json$/, '_tagged.json');
fs.writeFileSync(taggedPath, JSON.stringify(enriched, null, 2));
console.log(`✅ Enriched output saved to: ${taggedPath}`);
