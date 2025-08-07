const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;
let gadgetWindow;

function createGadgetWindow() {
  gadgetWindow = new BrowserWindow({
    width: 80,
    height: 80,
    frame: false,
    resizable: false,
    movable: true,
    minimizable: false,
    maximizable: false,
    closable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    transparent: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true
    }
  });

  const startUrl = isDev 
    ? 'http://localhost:3000?mode=gadget' 
    : `file://${path.join(__dirname, '../build/index.html')}?mode=gadget`;
  
  gadgetWindow.loadURL(startUrl);

  // Position gadget in top-right corner
  const { screen } = require('electron');
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  gadgetWindow.setPosition(width - 100, 20);

  gadgetWindow.on('closed', () => {
    gadgetWindow = null;
  });

  gadgetWindow.on('click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    } else {
      createMainWindow();
    }
  });
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 600,
    minHeight: 400,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true
    },
    icon: path.join(__dirname, 'assets/icon.png')
  });

  const startUrl = isDev 
    ? 'http://localhost:3000?mode=main' 
    : `file://${path.join(__dirname, '../build/index.html')}?mode=main`;
  
  mainWindow.loadURL(startUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('minimize', () => {
    mainWindow.hide();
  });
}

app.whenReady().then(() => {
  createGadgetWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createGadgetWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers
ipcMain.handle('expand-gadget', () => {
  if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
  } else {
    createMainWindow();
  }
});

ipcMain.handle('minimize-to-gadget', () => {
  if (mainWindow) {
    mainWindow.hide();
  }
});

ipcMain.handle('open-external-link', async (event, url) => {
  await shell.openExternal(url);
});

ipcMain.handle('get-medication-data', () => {
  // This will be implemented to load medication JSON files
  return [];
});

ipcMain.handle('calculate-creatinine-clearance', (event, { age, weight, creatinine, gender }) => {
  const factor = gender === 'F' ? 0.85 : 1;
  return ((140 - age) * weight * factor) / (72 * creatinine);
});