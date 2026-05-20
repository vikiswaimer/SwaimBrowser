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

/**
 * Типы для древовидной структуры
 */
export type TreeNodeType = 'folder' | 'project' | 'bookmark' | 'note';

export interface TreeNode {
  id: string;
  parentId: string | null;
  type: TreeNodeType;
  name: string;
  url?: string;
  description?: string;
  icon?: string;
  color?: string;
  isExpanded?: boolean;
  createdAt: string;
  updatedAt: string;
  children?: TreeNode[];
}

export interface BookmarkImportSource {
  type: 'chrome' | 'firefox' | 'safari' | 'edge' | 'notion' | 'json';
  name: string;
}

export interface ImportedBookmark {
  title: string;
  url?: string;
  children?: ImportedBookmark[];
}

export interface FlatTreeNode extends Omit<TreeNode, 'children'> {
  depth: number;
  index: number;
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

/**
 * Lean Startup: Гипотезы и спринты
 */
export type HypothesisStatus = 'pending' | 'testing' | 'validated' | 'invalid';

export interface Hypothesis {
  id: string;
  text: string;
  status: HypothesisStatus;
  createdAt: string;
  validatedAt?: string;
  notes?: string;
}

export interface Sprint {
  id: string;
  number: number;
  name: string;
  goal: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  hypotheses: string[];
}

export interface SprintTask {
  id: string;
  sprintId: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

/**
 * Метрики в реальном времени
 */
export type MetricTrend = 'up' | 'down' | 'stable';

export interface Metric {
  id: string;
  name: string;
  value: number | string;
  unit?: string;
  trend?: MetricTrend;
  change?: number;
  updatedAt: string;
}

export interface MetricGroup {
  id: string;
  name: string;
  metrics: Metric[];
}

export interface ApiStatus {
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  latency?: number;
}
