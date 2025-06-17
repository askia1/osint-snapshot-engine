#!/bin/bash

echo "Installing OSINT tool dependencies..."

sudo apt update && sudo apt install -y nodejs npm

npm install puppeteer-extra puppeteer-extra-plugin-stealth \
  cheerio jsdom compromise chrono-node libphonenumber-js electron

  

echo "Done. All core Node.js packages installed."

