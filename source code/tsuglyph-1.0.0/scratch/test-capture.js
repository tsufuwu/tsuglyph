const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    x: 100,
    y: 100,
    width: 400,
    height: 300,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    alwaysOnTop: true,
    resizable: false,
    show: false,
  });

  const indexPath = path.join(__dirname, '../dist/renderer/index.html');
  await win.loadFile(indexPath, { hash: 'overlay' });
  await new Promise((r) => setTimeout(r, 1000));
  const image = await win.webContents.capturePage();
  fs.writeFileSync(path.join(__dirname, 'capture.png'), image.toPNG());
  console.log('Saved capture.png! Size:', image.getSize());
  app.quit();
});
