/**
 * Theme Service
 * Управление темами приложения (dark/light/system).
 * Следует принципу единственной ответственности.
 */

import { COLORS, ThemeMode } from './tokens';

const THEME_STORAGE_KEY = 'swaim-theme';
const THEME_CLASS_DARK = 'theme-dark';
const THEME_CLASS_LIGHT = 'theme-light';

interface ThemeConfig {
  colors: {
    bgPrimary: string;
    bgSecondary: string;
    bgTertiary: string;
    bgElevated: string;
    bgHover: string;
    bgActive: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    textDisabled: string;
    borderPrimary: string;
    borderSecondary: string;
  };
}

type ThemeChangeListener = (theme: ThemeMode, resolvedTheme: 'dark' | 'light') => void;

class ThemeService {
  private currentTheme: ThemeMode = 'dark';
  private resolvedTheme: 'dark' | 'light' = 'dark';
  private listeners: Set<ThemeChangeListener> = new Set();
  private mediaQuery: MediaQueryList | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    if (savedTheme && ['dark', 'light', 'system'].includes(savedTheme)) {
      this.currentTheme = savedTheme;
    }

    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.mediaQuery.addEventListener('change', this.handleSystemThemeChange);

    this.applyTheme();
  }

  private handleSystemThemeChange = (): void => {
    if (this.currentTheme === 'system') {
      this.applyTheme();
    }
  };

  private resolveTheme(): 'dark' | 'light' {
    if (this.currentTheme === 'system') {
      return this.mediaQuery?.matches ? 'dark' : 'light';
    }
    return this.currentTheme;
  }

  private applyTheme(): void {
    if (typeof document === 'undefined') {
      return;
    }

    const resolved = this.resolveTheme();
    this.resolvedTheme = resolved;

    const root = document.documentElement;
    root.classList.remove(THEME_CLASS_DARK, THEME_CLASS_LIGHT);
    root.classList.add(resolved === 'dark' ? THEME_CLASS_DARK : THEME_CLASS_LIGHT);

    this.applyCSSVariables(resolved);
    this.notifyListeners();
  }

  private applyCSSVariables(theme: 'dark' | 'light'): void {
    const root = document.documentElement;
    const isDark = theme === 'dark';

    root.style.setProperty('--bg-primary', isDark ? COLORS.bgPrimary : COLORS.bgPrimaryLight);
    root.style.setProperty('--bg-secondary', isDark ? COLORS.bgSecondary : COLORS.bgSecondaryLight);
    root.style.setProperty('--bg-tertiary', isDark ? COLORS.bgTertiary : COLORS.bgTertiaryLight);
    root.style.setProperty('--bg-elevated', isDark ? COLORS.bgElevated : COLORS.bgElevatedLight);
    root.style.setProperty('--bg-hover', isDark ? COLORS.bgHover : COLORS.bgHoverLight);
    root.style.setProperty('--bg-active', isDark ? COLORS.bgActive : COLORS.bgActiveLight);
    root.style.setProperty('--text-primary', isDark ? COLORS.textPrimary : COLORS.textPrimaryLight);
    root.style.setProperty('--text-secondary', isDark ? COLORS.textSecondary : COLORS.textSecondaryLight);
    root.style.setProperty('--text-muted', isDark ? COLORS.textMuted : COLORS.textMutedLight);
    root.style.setProperty('--text-disabled', isDark ? COLORS.textDisabled : COLORS.textDisabledLight);
    root.style.setProperty('--border-primary', isDark ? COLORS.borderPrimary : COLORS.borderPrimaryLight);
    root.style.setProperty('--border-secondary', isDark ? COLORS.borderSecondary : COLORS.borderSecondaryLight);
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      listener(this.currentTheme, this.resolvedTheme);
    });
  }

  setTheme(theme: ThemeMode): void {
    if (!['dark', 'light', 'system'].includes(theme)) {
      console.warn(`Invalid theme: ${theme}. Expected 'dark', 'light', or 'system'.`);
      return;
    }

    this.currentTheme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    this.applyTheme();
  }

  getTheme(): ThemeMode {
    return this.currentTheme;
  }

  getResolvedTheme(): 'dark' | 'light' {
    return this.resolvedTheme;
  }

  isDark(): boolean {
    return this.resolvedTheme === 'dark';
  }

  isLight(): boolean {
    return this.resolvedTheme === 'light';
  }

  toggle(): void {
    const newTheme = this.resolvedTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  getConfig(): ThemeConfig {
    const isDark = this.isDark();
    return {
      colors: {
        bgPrimary: isDark ? COLORS.bgPrimary : COLORS.bgPrimaryLight,
        bgSecondary: isDark ? COLORS.bgSecondary : COLORS.bgSecondaryLight,
        bgTertiary: isDark ? COLORS.bgTertiary : COLORS.bgTertiaryLight,
        bgElevated: isDark ? COLORS.bgElevated : COLORS.bgElevatedLight,
        bgHover: isDark ? COLORS.bgHover : COLORS.bgHoverLight,
        bgActive: isDark ? COLORS.bgActive : COLORS.bgActiveLight,
        textPrimary: isDark ? COLORS.textPrimary : COLORS.textPrimaryLight,
        textSecondary: isDark ? COLORS.textSecondary : COLORS.textSecondaryLight,
        textMuted: isDark ? COLORS.textMuted : COLORS.textMutedLight,
        textDisabled: isDark ? COLORS.textDisabled : COLORS.textDisabledLight,
        borderPrimary: isDark ? COLORS.borderPrimary : COLORS.borderPrimaryLight,
        borderSecondary: isDark ? COLORS.borderSecondary : COLORS.borderSecondaryLight,
      },
    };
  }

  subscribe(listener: ThemeChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  destroy(): void {
    this.mediaQuery?.removeEventListener('change', this.handleSystemThemeChange);
    this.listeners.clear();
  }
}

export const themeService = new ThemeService();
export type { ThemeConfig, ThemeChangeListener };
