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

export type SidebarTab = 'focus' | 'tasks' | 'insights' | 'hypotheses' | 'strategy' | 'resources';

export type FocusDuration = 25 | 50 | 90;

/**
 * Product Framework Types
 * Типы для Digital Business Space фреймворка
 */

export type HypothesisType = 'problem' | 'solution' | 'channel' | 'revenue' | 'other';
export type HypothesisStatus = 'draft' | 'testing' | 'validated' | 'invalidated';
export type RiskLevel = 'high' | 'medium' | 'low';

export interface Hypothesis {
  id: string;
  statement: string;
  type: HypothesisType;
  assumption: string;
  riskLevel: RiskLevel;
  status: HypothesisStatus;
  experiments: string[];
  insights: string[];
  createdAt: string;
  updatedAt: string;
  validatedAt?: string;
}

export type ExperimentMethod = 'interview' | 'survey' | 'ab_test' | 'landing' | 'mvp' | 'other';
export type ExperimentStatus = 'planned' | 'running' | 'completed' | 'cancelled';
export type ExperimentDecision = 'pivot' | 'persevere' | 'iterate';

export interface Experiment {
  id: string;
  name: string;
  hypothesisId: string;
  method: ExperimentMethod;
  description: string;
  successCriteria: string;
  status: ExperimentStatus;
  startDate?: string;
  endDate?: string;
  results?: string;
  decision?: ExperimentDecision;
  linkedInsights: string[];
  linkedTasks: string[];
}

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  linkedHypothesis?: string;
  linkedExperiment?: string;
  linkedKeyResult?: string;
  focusSessions: string[];
  estimatedPomodoros?: number;
  actualPomodoros?: number;
  createdAt: string;
  completedAt?: string;
}

export type OKRPeriod = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Year';

export interface KeyResult {
  id: string;
  description: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  linkedTasks: string[];
}

export interface OKR {
  id: string;
  objective: string;
  period: OKRPeriod;
  year: number;
  keyResults: KeyResult[];
  progress: number;
}

export interface Vision {
  mission: string;
  vision: string;
  values: string[];
  bigHairyGoal: string;
  updatedAt: string;
}

export type InsightType = 'pain' | 'gain' | 'quote' | 'observation' | 'idea' | 'other';
export type InsightImportance = 'high' | 'medium' | 'low';

export interface ExtendedInsight extends Insight {
  type: InsightType;
  linkedHypothesis?: string;
  linkedExperiment?: string;
  linkedPersona?: string;
  linkedCanvasBlock?: string;
  importance: InsightImportance;
  actionable: boolean;
}

export type MetricCategory = 'acquisition' | 'activation' | 'retention' | 'revenue' | 'referral';
export type MetricTrend = 'up' | 'down' | 'stable';

export interface MetricPoint {
  date: string;
  value: number;
}

export interface Metric {
  id: string;
  name: string;
  category: MetricCategory;
  currentValue: number;
  targetValue: number;
  unit: string;
  trend: MetricTrend;
  lastUpdated: string;
  history: MetricPoint[];
}

export type CompetitorType = 'direct' | 'indirect' | 'substitute';

export interface Competitor {
  id: string;
  name: string;
  url: string;
  type: CompetitorType;
  description: string;
  strengths: string[];
  weaknesses: string[];
  pricing?: string;
  features: string[];
  linkedInsights: string[];
  lastResearchedAt: string;
}

export interface Persona {
  id: string;
  name: string;
  avatar?: string;
  demographics: string;
  goals: string[];
  pains: string[];
  behaviors: string[];
  quote: string;
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  size: string;
  personas: Persona[];
  linkedInsights: string[];
}

export type CanvasBlockType = 
  | 'problem' 
  | 'solution' 
  | 'unique_value' 
  | 'unfair_advantage' 
  | 'customer_segments' 
  | 'channels' 
  | 'revenue_streams' 
  | 'cost_structure' 
  | 'key_metrics';

export interface CanvasBlock {
  type: CanvasBlockType;
  items: string[];
  linkedInsights: string[];
  updatedAt: string;
}

export interface LeanCanvas {
  id: string;
  name: string;
  blocks: Record<CanvasBlockType, CanvasBlock>;
  createdAt: string;
  updatedAt: string;
}
