/**
 * Shared Constants
 * Этот модуль содержит константы, используемые как в desktop, так и в mobile версии.
 * Вынесен в shared для переиспользования между платформами.
 */

export const APP_CONFIG = Object.freeze({
  NAME: 'Swaim Browser',
  VERSION: '0.2.0',
});

export const FOCUS_CONFIG = Object.freeze({
  DEFAULT_DURATION_MINUTES: 25,
  TIMER_INTERVAL_MS: 1000,
  SECONDS_PER_MINUTE: 60,
  SESSION_DURATIONS: [25, 50, 90] as const,
});

export const BROWSER_CONFIG = Object.freeze({
  DEFAULT_SEARCH_ENGINE: 'https://www.google.com/search?q=',
  DEFAULT_PROTOCOL: 'https://',
  DEFAULT_HOME_URL: 'https://swaimapp.com',
});

export const BLOCKED_DOMAINS = Object.freeze([
  'youtube.com',
  'twitter.com',
  'x.com',
  'reddit.com',
  'facebook.com',
  'instagram.com',
  'tiktok.com',
]);

export const STORAGE_KEYS = Object.freeze({
  INSIGHTS: 'insights',
  SESSIONS: 'sessions',
  SETTINGS: 'settings',
  PROJECTS: 'projects',
});

export const UI_CONFIG = Object.freeze({
  SIDEBAR_WIDTH: 320,
  TOPBAR_HEIGHT: 52,
  RECENT_INSIGHTS_COUNT: 5,
  RECENT_SESSIONS_COUNT: 10,
});

export const HOTKEYS = Object.freeze({
  ADD_INSIGHT: { key: 'p', altKey: true },
  TOGGLE_FOCUS: { key: 'F', ctrlKey: true, shiftKey: true },
  TOGGLE_SIDEBAR: { key: 'b', metaKey: true },
});

export const CSS_CLASSES = Object.freeze({
  ACTIVE: 'active',
  OPEN: 'open',
  DISABLED: 'disabled',
});
