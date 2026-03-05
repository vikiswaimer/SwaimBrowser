/**
 * Shared Utilities
 * Утилиты, работающие на всех платформах без зависимости от окружения.
 */

import { BROWSER_CONFIG, BLOCKED_DOMAINS, FOCUS_CONFIG } from './constants';

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatTimeDisplay(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / FOCUS_CONFIG.SECONDS_PER_MINUTE);
  const seconds = totalSeconds % FOCUS_CONFIG.SECONDS_PER_MINUTE;
  const paddedSeconds = seconds.toString().padStart(2, '0');
  return `${minutes}:${paddedSeconds}`;
}

export function normalizeUrl(inputValue: string): string | null {
  const trimmedInput = inputValue.trim();

  if (!trimmedInput) {
    return null;
  }

  const hasProtocol = trimmedInput.startsWith('http');
  if (hasProtocol) {
    return trimmedInput;
  }

  const looksLikeUrl = trimmedInput.includes('.');
  if (looksLikeUrl) {
    return BROWSER_CONFIG.DEFAULT_PROTOCOL + trimmedInput;
  }

  return BROWSER_CONFIG.DEFAULT_SEARCH_ENGINE + encodeURIComponent(trimmedInput);
}

export function extractDomainFromUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    const parts = url.split('/');
    return parts.length > 2 ? parts[2] : '';
  }
}

export function isBlockedDomain(
  url: string,
  customBlockedDomains: string[] = []
): boolean {
  if (!url) {
    return false;
  }
  const domain = extractDomainFromUrl(url).toLowerCase();
  const allBlockedDomains = [...BLOCKED_DOMAINS, ...customBlockedDomains];
  return allBlockedDomains.some((blocked) => domain.includes(blocked));
}

export function minutesToSeconds(minutes: number): number {
  return minutes * FOCUS_CONFIG.SECONDS_PER_MINUTE;
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
