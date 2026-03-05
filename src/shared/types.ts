/**
 * Shared Types
 * Типы данных, используемые на всех платформах (desktop, mobile, web).
 */

export interface Insight {
  id: string;
  url: string;
  text: string;
  timestamp: string;
  tags: string[];
  projectId?: string;
}

export interface FocusSession {
  id: string;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  goal: string;
  completed: boolean;
  blockedAttempts: BlockedAttempt[];
}

export interface BlockedAttempt {
  domain: string;
  timestamp: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  defaultFocusDuration: number;
  customBlockedDomains: string[];
  showBlockedNotifications: boolean;
  autoStartBreak: boolean;
  soundEnabled: boolean;
}

export interface BrowserTab {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  isActive: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
}

export type SidebarTab = 'focus' | 'projects' | 'insights';

export type FocusDuration = 25 | 50 | 90;
