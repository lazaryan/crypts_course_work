//бибильотека для работы с путями
const path = require('path');

//библиотека для работы приложения в качетве desktop-а
const { app, BrowserWindow } = require('electron');

//если мы работаем в `dev` режиме, то получаем из командной строки параметры (electron . --dev --devtools)
let argv = { dev: false, devtools: false }
// в production версии библиотека yargs отсутствует, поэтому обернул в try/catch
try {
  const yargs = require('yargs/yargs')
  const { hideBin } = require('yargs/helpers')

  argv = yargs(hideBin(process.argv))
    .option('dev', { alias: 'd', type: 'boolean' })
    .option('devtools', { type: 'booleans' })
    .parse()
} catch (_) {}

// если у нас включен dev режим, то включаем автообновление, т.е. при обновление любого файла приложение автоматически перезапускается
if (argv.dev) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit'
  });
}

// функция для создния окна приложения
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

  // если передан параметр devtools - вклчаем консоль разработчика
  if (argv.devtools) {
    win.webContents.openDevTools();
  }

  //отображаем html файл
  win.loadFile(path.join(__dirname, 'public/index.html'))
}

app.whenReady().then(() => {
  createWindow()

  // на случай запуска нескольких экземпляров приложения
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// после закрытия всех окон выключаем программу (иначе будет крутиться в фоне)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
