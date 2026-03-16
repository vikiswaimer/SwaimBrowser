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
  HYPOTHESES: 'hypotheses',
  EXPERIMENTS: 'experiments',
  TASKS: 'tasks',
  OKRS: 'okrs',
  VISION: 'vision',
  METRICS: 'metrics',
  COMPETITORS: 'competitors',
  CUSTOMERS: 'customers',
  CANVAS: 'canvas',
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

export const TREE_CONFIG = Object.freeze({
  INDENT_SIZE: 20,
  DRAG_OVERLAY_OPACITY: 0.8,
  DROP_ANIMATION_DURATION: 200,
  MAX_DEPTH: 10,
  DEFAULT_EXPANDED: true,
  AUTO_EXPAND_ON_DRAG: true,
});

export const IMPORT_SOURCES = Object.freeze([
  { type: 'chrome', name: 'Google Chrome' },
  { type: 'firefox', name: 'Mozilla Firefox' },
  { type: 'safari', name: 'Safari' },
  { type: 'edge', name: 'Microsoft Edge' },
  { type: 'notion', name: 'Notion' },
  { type: 'json', name: 'JSON File' },
] as const);

/**
 * Product Framework Configuration
 * Конфигурация для Digital Business Space
 */
export const PRODUCT_FRAMEWORK_CONFIG = Object.freeze({
  SIDEBAR_TABS: [
    { id: 'focus', label: 'Focus', icon: '⚡' },
    { id: 'tasks', label: 'Tasks', icon: '✓' },
    { id: 'insights', label: 'Insights', icon: '💡' },
    { id: 'hypotheses', label: 'Hypotheses', icon: '🎯' },
    { id: 'strategy', label: 'Strategy', icon: '📊' },
    { id: 'resources', label: 'Resources', icon: '📁' },
  ] as const,
  
  HYPOTHESIS_TYPES: [
    { value: 'problem', label: 'Problem' },
    { value: 'solution', label: 'Solution' },
    { value: 'channel', label: 'Channel' },
    { value: 'revenue', label: 'Revenue' },
    { value: 'other', label: 'Other' },
  ] as const,
  
  HYPOTHESIS_STATUSES: [
    { value: 'draft', label: 'Draft', color: '--text-muted' },
    { value: 'testing', label: 'Testing', color: '--accent-yellow' },
    { value: 'validated', label: 'Validated', color: '--accent-green' },
    { value: 'invalidated', label: 'Invalidated', color: '--accent-red' },
  ] as const,
  
  TASK_STATUSES: [
    { value: 'backlog', label: 'Backlog' },
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
  ] as const,
  
  TASK_PRIORITIES: [
    { value: 'high', label: 'High', color: '--accent-red' },
    { value: 'medium', label: 'Medium', color: '--accent-yellow' },
    { value: 'low', label: 'Low', color: '--text-muted' },
  ] as const,
  
  INSIGHT_TYPES: [
    { value: 'pain', label: 'Pain', icon: '😣' },
    { value: 'gain', label: 'Gain', icon: '🎉' },
    { value: 'quote', label: 'Quote', icon: '💬' },
    { value: 'observation', label: 'Observation', icon: '👁' },
    { value: 'idea', label: 'Idea', icon: '💡' },
    { value: 'other', label: 'Other', icon: '📝' },
  ] as const,
  
  EXPERIMENT_METHODS: [
    { value: 'interview', label: 'Customer Interview' },
    { value: 'survey', label: 'Survey' },
    { value: 'ab_test', label: 'A/B Test' },
    { value: 'landing', label: 'Landing Page' },
    { value: 'mvp', label: 'MVP Test' },
    { value: 'other', label: 'Other' },
  ] as const,
  
  CANVAS_BLOCKS: [
    { type: 'problem', label: 'Problem', position: 1 },
    { type: 'solution', label: 'Solution', position: 2 },
    { type: 'unique_value', label: 'Unique Value Proposition', position: 3 },
    { type: 'unfair_advantage', label: 'Unfair Advantage', position: 4 },
    { type: 'customer_segments', label: 'Customer Segments', position: 5 },
    { type: 'channels', label: 'Channels', position: 6 },
    { type: 'revenue_streams', label: 'Revenue Streams', position: 7 },
    { type: 'cost_structure', label: 'Cost Structure', position: 8 },
    { type: 'key_metrics', label: 'Key Metrics', position: 9 },
  ] as const,
  
  METRIC_CATEGORIES: [
    { value: 'acquisition', label: 'Acquisition' },
    { value: 'activation', label: 'Activation' },
    { value: 'retention', label: 'Retention' },
    { value: 'revenue', label: 'Revenue' },
    { value: 'referral', label: 'Referral' },
  ] as const,
});

export const HOTKEYS_EXTENDED = Object.freeze({
  ...HOTKEYS,
  ADD_TASK: { key: 't', altKey: true },
  LINK_HYPOTHESIS: { key: 'h', altKey: true },
  COMMAND_PALETTE: { key: 'k', metaKey: true },
  SWITCH_TAB_1: { key: '1', altKey: true },
  SWITCH_TAB_2: { key: '2', altKey: true },
  SWITCH_TAB_3: { key: '3', altKey: true },
  SWITCH_TAB_4: { key: '4', altKey: true },
  SWITCH_TAB_5: { key: '5', altKey: true },
  SWITCH_TAB_6: { key: '6', altKey: true },
});
