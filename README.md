# osint-snapshot-engine

# 🕵️ OSINT Snapshot Engine

A lightweight, modular OSINT toolkit for rapidly generating individual or org-level digital footprint reports.

## 🔧 Features
- LinkedIn + web profile scraping
- Entity/metadata extraction (emails, phones, orgs, places)
- PDF/JSON/HTML dump
- Modular risk categorization
- GUI and CLI options

## 📁 Structure
- `/src`: All scraping + parsing scripts
- `/outputs`: All reports/dumps
- `/templates`: Report/slide generation formats

## 🚀 Quick Start
```bash
bash install-deps.sh
node src/puppeteer-osint.js <target_url> --screenshot --html
