const path = require('path');

const { app, BrowserWindow } = require('electron');

let argv = { dev: false, devtools: false }

try {
  const yargs = require('yargs/yargs')
  const { hideBin } = require('yargs/helpers')

  argv = yargs(hideBin(process.argv))
    .option('dev', { alias: 'd', type: 'boolean' })
    .option('devtools', { type: 'booleans' })
    .parse()
} catch (_) {}

if (argv.dev) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit'
  });
}

function createWindow () {
  const win = new BrowserWindow({
    width: 1000,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    autoHideMenuBar: true,
    darkTheme: true,
    backgroundColor: '#4d4d4f',
    icon: path.join(__dirname, '/public/icon.ico'),
    title: 'Курсовая работа',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  })

  if (argv.devtools) {
    win.webContents.openDevTools();
  }

  win.loadFile(path.join(__dirname, 'public/index.html'))
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
