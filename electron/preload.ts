import { contextBridge, ipcRenderer } from 'electron';

export interface ElectronAPI {
  store: {
    get: <T>(key: string, defaultValue?: T) => Promise<T>;
    set: <T>(key: string, value: T) => Promise<boolean>;
    delete: (key: string) => Promise<boolean>;
    clear: () => Promise<boolean>;
  };
  app: {
    getVersion: () => Promise<string>;
    getPlatform: () => Promise<NodeJS.Platform>;
  };
  window: {
    minimize: () => Promise<void>;
    maximize: () => Promise<void>;
    close: () => Promise<void>;
  };
}

const electronAPI: ElectronAPI = {
  store: {
    get: <T>(key: string, defaultValue?: T) =>
      ipcRenderer.invoke('store:get', key, defaultValue) as Promise<T>,
    set: <T>(key: string, value: T) =>
      ipcRenderer.invoke('store:set', key, value) as Promise<boolean>,
    delete: (key: string) =>
      ipcRenderer.invoke('store:delete', key) as Promise<boolean>,
    clear: () => ipcRenderer.invoke('store:clear') as Promise<boolean>,
  },
  app: {
    getVersion: () => ipcRenderer.invoke('app:getVersion') as Promise<string>,
    getPlatform: () =>
      ipcRenderer.invoke('app:getPlatform') as Promise<NodeJS.Platform>,
  },
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize') as Promise<void>,
    maximize: () => ipcRenderer.invoke('window:maximize') as Promise<void>,
    close: () => ipcRenderer.invoke('window:close') as Promise<void>,
  },
};

contextBridge.exposeInMainWorld('electron', electronAPI);

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
