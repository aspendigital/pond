import { app, ipcMain, BrowserWindow } from 'electron'; // eslint-disable-line
import storage from 'electron-json-storage';
import ProjectDb from './lib/projects-db';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
let projectDb = new ProjectDb(storage);

projectDb.init()
  .then(() => {
    registerIpcListeners();
  })
  .catch((error) => {
    console.log('Error initializing JSON storage:', error);
  });

const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 800,
    height: 715,
    minWidth: 800,
    minHeight: 715,
    useContentSize: true,
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

function registerIpcListeners()
{
  ipcMain.on('create-project', (event, payload) => {
    projectDb.create(payload)
      .then((data) => {
        event.sender.send('project-created', data);
      })
      .catch((error) => {
        console.log('Error creating project:', error);
      })
  });
}
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
