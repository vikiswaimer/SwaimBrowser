/**
 * Storage Service
 * Универсальный сервис хранения данных.
 * Работает с Electron Store на desktop и localStorage на web.
 */

import type { StorageAdapter } from '../shared/platform';
import { detectPlatform } from '../shared/platform';

class ElectronStorageAdapter implements StorageAdapter {
  async get<T>(key: string, defaultValue?: T): Promise<T> {
    if (!window.electron) {
      throw new Error('Electron API not available');
    }
    return window.electron.store.get(key, defaultValue);
  }

  async set<T>(key: string, value: T): Promise<void> {
    if (!window.electron) {
      throw new Error('Electron API not available');
    }
    await window.electron.store.set(key, value);
  }

  async delete(key: string): Promise<void> {
    if (!window.electron) {
      throw new Error('Electron API not available');
    }
    await window.electron.store.delete(key);
  }

  async clear(): Promise<void> {
    if (!window.electron) {
      throw new Error('Electron API not available');
    }
    await window.electron.store.clear();
  }
}

class WebStorageAdapter implements StorageAdapter {
  async get<T>(key: string, defaultValue?: T): Promise<T> {
    const stored = localStorage.getItem(key);
    if (stored === null) {
      return defaultValue as T;
    }
    try {
      return JSON.parse(stored) as T;
    } catch {
      return stored as unknown as T;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value));
  }

  async delete(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    localStorage.clear();
  }
}

function createStorageAdapter(): StorageAdapter {
  const platform = detectPlatform();

  switch (platform) {
    case 'desktop':
      return new ElectronStorageAdapter();
    case 'mobile':
    case 'web':
    default:
      return new WebStorageAdapter();
  }
}

export const storage = createStorageAdapter();

export async function saveToStorage<T>(key: string, value: T): Promise<void> {
  await storage.set(key, value);
}

export async function loadFromStorage<T>(
  key: string,
  defaultValue: T
): Promise<T> {
  return storage.get(key, defaultValue);
}
