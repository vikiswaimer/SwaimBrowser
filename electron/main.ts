import { app, BrowserWindow, ipcMain, shell, BrowserView, protocol, net } from 'electron';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import Store from 'electron-store';

const __dirname = dirname(fileURLToPath(import.meta.url));

const CONFIG = Object.freeze({
  WINDOW: {
    WIDTH: 1400,
    HEIGHT: 900,
    MIN_WIDTH: 800,
    MIN_HEIGHT: 600,
  },
  DEV_SERVER_URL: 'http://localhost:5173',
});

const store = new Store();
let mainWindow: BrowserWindow | null = null;
let browserView: BrowserView | null = null;

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, supportFetchAPI: true } },
]);

function registerAppProtocol(): void {
  const distPath = join(app.getAppPath(), 'dist');
  protocol.handle('app', (request) => {
    const pathname = request.url.slice('app://'.length).split('?')[0] || 'index.html';
    const filePath = join(distPath, pathname);
    return net.fetch(pathToFileURL(filePath).toString());
  });
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: CONFIG.WINDOW.WIDTH,
    height: CONFIG.WINDOW.HEIGHT,
    minWidth: CONFIG.WINDOW.MIN_WIDTH,
    minHeight: CONFIG.WINDOW.MIN_HEIGHT,
    title: 'Swaim Browser',
    frame: false,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: true,
    },
    backgroundColor: '#0a0b12',
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL('app://./index.html');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

function setupIpcHandlers(): void {
  ipcMain.handle('store:get', (_, key: string, defaultValue?: unknown) => {
    return store.get(key, defaultValue);
  });

  ipcMain.handle('store:set', (_, key: string, value: unknown) => {
    store.set(key, value);
    return true;
  });

  ipcMain.handle('store:delete', (_, key: string) => {
    store.delete(key);
    return true;
  });

  ipcMain.handle('store:clear', () => {
    store.clear();
    return true;
  });

  ipcMain.handle('app:getVersion', () => {
    return app.getVersion();
  });

  ipcMain.handle('app:getPlatform', () => {
    return process.platform;
  });

  ipcMain.handle('window:minimize', () => {
    mainWindow?.minimize();
  });

  ipcMain.handle('window:maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow?.maximize();
    }
  });

  ipcMain.handle('window:close', () => {
    mainWindow?.close();
  });
}

app.whenReady().then(() => {
  createWindow();
  setupIpcHandlers();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  browserView = null;
});
