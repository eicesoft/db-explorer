import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { release } from 'node:os';
import { join } from 'node:path';
import fs from 'node:fs';
import Store from 'electron-store';

Store.initRenderer();
// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL ? join(process.env.DIST_ELECTRON, '../public') : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js');
// console.log(ipcMessage);
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');
// console.warn(app.getPath('userData'));
async function createWindow() {
  win = new BrowserWindow({
    title: 'DB Explorer',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    height: 800,
    width: 1024,
    minWidth: 800,
    minHeight: 700,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#2f3241',
      symbolColor: '#ccdbfd',
      height: 36,
    },
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(url, {
      extraHeaders: `Content-Security-Policy: default-src 'unsafe-eval'`,
    });
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.webContents.openDevTools();
    win.loadFile(indexHtml);
  }
  win.setMenu(null);
  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
    win?.webContents.send('did-finish-load', {
      key: 'jdub237v',
    });
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });

  // win.webContents.on('will-navigate', (event, url) => { }) #344
}

// console.log('App ready createWindow');
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});

ipcMain.handle('about', (event) => {
  const packageInfo = require('../../package.json');

  dialog.showMessageBox(win, {
    title: packageInfo.productName,
    message: `Name: \t\t${packageInfo.productName}\nVersion: \t\t${packageInfo.version}\nAuthor: ${packageInfo.author}`,
  });
});

ipcMain.handle('open_file', (event) => {
  let resp = dialog.showOpenDialogSync(win, {
    properties: ['openFile'],
    filters: [{ extensions: ['txt', 'sql'], name: '文本文件' }],
  });
  console.log(resp);
  if (resp.length > 0) {
    const data = fs.readFileSync(resp[0], 'utf-8');
    console.log(data);

    win?.webContents.send('load-file', data);
  }
});
