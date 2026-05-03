/**
 * UI Design Tokens
 * Токены дизайн-системы для консистентного UI.
 * Следует принципам из Linear и Cursor.
 */

export const COLORS = Object.freeze({
  // Background
  bgPrimary: '#0a0b12',
  bgSecondary: '#11151f',
  bgTertiary: '#1a1f2e',
  bgElevated: 'rgba(255, 255, 255, 0.03)',
  bgHover: 'rgba(255, 255, 255, 0.06)',
  bgActive: 'rgba(255, 255, 255, 0.08)',

  // Light theme backgrounds
  bgPrimaryLight: '#ffffff',
  bgSecondaryLight: '#f9fafb',
  bgTertiaryLight: '#f3f4f6',
  bgElevatedLight: 'rgba(0, 0, 0, 0.02)',
  bgHoverLight: 'rgba(0, 0, 0, 0.04)',
  bgActiveLight: 'rgba(0, 0, 0, 0.06)',

  // Accent
  accentPrimary: '#4f8cff',
  accentSecondary: '#7b6aff',
  accentMuted: 'rgba(79, 140, 255, 0.15)',

  // Text (dark theme)
  textPrimary: '#f5f7fa',
  textSecondary: '#a1a8b8',
  textMuted: '#6b7280',
  textDisabled: '#4b5563',

  // Text (light theme)
  textPrimaryLight: '#111827',
  textSecondaryLight: '#4b5563',
  textMutedLight: '#9ca3af',
  textDisabledLight: '#d1d5db',

  // Border
  borderPrimary: 'rgba(255, 255, 255, 0.08)',
  borderSecondary: 'rgba(255, 255, 255, 0.04)',
  borderAccent: 'rgba(79, 140, 255, 0.3)',

  // Border (light theme)
  borderPrimaryLight: 'rgba(0, 0, 0, 0.08)',
  borderSecondaryLight: 'rgba(0, 0, 0, 0.04)',

  // Status
  success: '#10b981',
  successMuted: 'rgba(16, 185, 129, 0.15)',
  warning: '#f59e0b',
  warningMuted: 'rgba(245, 158, 11, 0.15)',
  error: '#ef4444',
  errorMuted: 'rgba(239, 68, 68, 0.15)',
  info: '#3b82f6',
  infoMuted: 'rgba(59, 130, 246, 0.15)',
});

export const SPACING = Object.freeze({
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
});

export const RADIUS = Object.freeze({
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
});

export const TYPOGRAPHY = Object.freeze({
  fontSans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
  fontMono: "'SF Mono', 'Fira Code', 'JetBrains Mono', monospace",

  sizes: {
    xs: 11,
    sm: 12,
    base: 13,
    lg: 14,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    '4xl': 32,
  },

  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
});

export const SHADOWS = Object.freeze({
  sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
  md: '0 4px 6px rgba(0, 0, 0, 0.3)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.3)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.4)',
  focus: '0 0 0 2px rgba(79, 140, 255, 0.4)',
});

export const TRANSITIONS = Object.freeze({
  fast: '0.1s ease',
  base: '0.2s ease',
  slow: '0.3s ease',
  spring: '0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
});

export const LAYOUT = Object.freeze({
  topbarHeight: 52,
  sidebarWidth: 320,
  sidebarCollapsedWidth: 48,
  trafficLightWidth: 78,
  maxContentWidth: 1200,
  mobileBreakpoint: 768,
  tabletBreakpoint: 1024,
});

export const Z_INDEX = Object.freeze({
  base: 0,
  dropdown: 100,
  sticky: 200,
  modal: 300,
  overlay: 400,
  toast: 500,
  tooltip: 600,
  commandPalette: 700,
});

export type ThemeMode = 'dark' | 'light' | 'system';
export type StatusType = 'success' | 'warning' | 'error' | 'info';
export type SpacingSize = keyof typeof SPACING;
export type RadiusSize = keyof typeof RADIUS;
export type TypographySize = keyof typeof TYPOGRAPHY.sizes;
