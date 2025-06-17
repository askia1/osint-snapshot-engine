const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  win.loadFile(path.join(__dirname, 'gui', 'index.html'));
}

app.whenReady().then(createWindow);

ipcMain.on('run-osint', (event, data) => {
  data.urls.forEach(url => {
    const cmd = ['puppeteer-osint.js', url, ...data.flags];
    const proc = spawn('node', cmd, { cwd: path.join(__dirname), shell: true });

    proc.stdout.on('data', chunk => {
      event.sender.send('console-log', chunk.toString());
    });

    proc.stderr.on('data', chunk => {
      event.sender.send('console-log', '[ERR] ' + chunk.toString());
    });

    proc.on('close', code => {
      event.sender.send('console-log', `>> Finished ${url} with exit code ${code}`);
    });
  });
});
