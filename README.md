# 🕵️ OSINT Snapshot Toolkit

**A versatile, lightweight OSINT framework for rapid intelligence collection, enrichment, and reporting on individuals and organizations.**

---

## 🔧 Key Features

* **Automated OSINT Crawling** (via Puppeteer)
* **Metadata & Entity Extraction** (emails, phones, entities, dates)
* **Risk Analysis and Categorization**
* **Professional Report Generation** (HTML and PDF)
* **Easy-to-use GUI Interface**

---

## 📂 Project Structure

```
osint-snapshot-tool/
├── src/
│   ├── puppeteer-osint.js      # Main crawler script
│   ├── process-json.js         # JSON enrichment script
│   ├── generate-report.js      # Report generation
│   └── gui-server.js           # GUI backend server
├── gui/
│   └── index.html              # GUI frontend
├── dumps/                      # Raw and processed JSON files
├── reports/                    # HTML and PDF reports
├── batch.txt                   # List of URLs for batch mode
├── install-deps.sh             # Dependency installation script
├── package.json
└── README.md
```

---

## 🚀 Quick Start

### ✅ 1. Install Dependencies

```bash
bash install-deps.sh
```

### ✅ 2. Run OSINT via CLI

**Single URL:**

```bash
node src/puppeteer-osint.js https://example.com/profile --html --screenshot
```

**Batch Mode:**

Edit `batch.txt` with URLs (one per line), then run:

```bash
node src/puppeteer-osint.js --batch=batch.txt --html --screenshot
```

---

### ✅ 3. Process JSON & Enrich Data

Single File:

```bash
node src/process-json.js dumps/profile.json
```

Batch Enrichment:

```bash
node src/process-json.js dumps/ --batch
```

---

### ✅ 4. Generate Report

HTML and optional PDF:

```bash
node src/generate-report.js dumps/profile_tagged.json --pdf
```

---

### ✅ 5. Launch GUI

```bash
node src/gui-server.js
```

Open [http://localhost:3344](http://localhost:3344) in your browser.

---

## 📌 Dependencies

* Node.js
* Puppeteer + Puppeteer-extra (Stealth)
* Compromise (NLP)
* Chrono-node (Date Parsing)
* Libphonenumber-js (Phone Extraction)
* Express (GUI Server)

---

## 📝 License

MIT License

---

**Developed for precision OSINT operations.**
