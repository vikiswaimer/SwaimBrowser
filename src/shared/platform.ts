/**
 * Platform Abstraction Layer
 * Абстракция для работы с разными платформами (Desktop, Mobile, Web).
 * Позволяет использовать одну логику на всех платформах.
 */

export type Platform = 'desktop' | 'mobile' | 'web';

export interface StorageAdapter {
  get<T>(key: string, defaultValue?: T): Promise<T>;
  set<T>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

export interface NotificationAdapter {
  show(title: string, body: string, options?: NotificationOptions): Promise<void>;
  requestPermission(): Promise<boolean>;
}

export interface HapticsAdapter {
  impact(style: 'light' | 'medium' | 'heavy'): Promise<void>;
  notification(type: 'success' | 'warning' | 'error'): Promise<void>;
}

export interface PlatformCapabilities {
  hasNotifications: boolean;
  hasHaptics: boolean;
  hasWebView: boolean;
  hasNativeMenu: boolean;
  hasSystemTray: boolean;
  hasBiometrics: boolean;
}

export interface PlatformAdapter {
  platform: Platform;
  capabilities: PlatformCapabilities;
  storage: StorageAdapter;
  notifications?: NotificationAdapter;
  haptics?: HapticsAdapter;
}

export function detectPlatform(): Platform {
  if (typeof window !== 'undefined' && 'electron' in window) {
    return 'desktop';
  }

  if (typeof window !== 'undefined' && 'ReactNativeWebView' in window) {
    return 'mobile';
  }

  return 'web';
}

export const PLATFORM_CAPABILITIES: Record<Platform, PlatformCapabilities> = {
  desktop: {
    hasNotifications: true,
    hasHaptics: false,
    hasWebView: true,
    hasNativeMenu: true,
    hasSystemTray: true,
    hasBiometrics: false,
  },
  mobile: {
    hasNotifications: true,
    hasHaptics: true,
    hasWebView: true,
    hasNativeMenu: false,
    hasSystemTray: false,
    hasBiometrics: true,
  },
  web: {
    hasNotifications: true,
    hasHaptics: false,
    hasWebView: false,
    hasNativeMenu: false,
    hasSystemTray: false,
    hasBiometrics: false,
  },
};
