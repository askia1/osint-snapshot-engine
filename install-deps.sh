#!/bin/bash

echo "📦 Installing OSINT tool dependencies..."

# Ensure system packages are installed
sudo apt update && sudo apt install -y nodejs npm

# Optional: Create project-local node_modules
npm init -y

# Install all Node.js packages
npm install puppeteer-extra puppeteer-extra-plugin-stealth \
  cheerio jsdom compromise chrono-node libphonenumber-js electron

echo "✅ Done. All core Node.js packages installed."
