import { create } from 'zustand';
import { generateId } from '@shared';
import type { Metric, MetricGroup, ApiStatus } from '@shared';

interface MetricsState {
  metricGroups: MetricGroup[];
  apiStatuses: ApiStatus[];
  lastUpdated: string;
  
  updateMetric: (groupId: string, metricId: string, value: number | string) => void;
  addMetricGroup: (name: string) => void;
  addMetric: (groupId: string, metric: Omit<Metric, 'id' | 'updatedAt'>) => void;
  setApiStatus: (name: string, status: ApiStatus['status'], latency?: number) => void;
  
  loadMetricGroups: (groups: MetricGroup[]) => void;
  loadApiStatuses: (statuses: ApiStatus[]) => void;
}

export const useMetricsStore = create<MetricsState>((set) => ({
  metricGroups: [
    {
      id: 'acquisition',
      name: 'Acquisition',
      metrics: [
        { id: 'm1', name: 'Visitors', value: 1247, trend: 'up', change: 12.3, updatedAt: new Date().toISOString() },
        { id: 'm2', name: 'Sign-ups', value: 89, trend: 'up', change: 8.5, updatedAt: new Date().toISOString() },
        { id: 'm3', name: 'Conversion', value: '7.1%', trend: 'stable', updatedAt: new Date().toISOString() },
      ],
    },
    {
      id: 'engagement',
      name: 'Engagement',
      metrics: [
        { id: 'm4', name: 'DAU', value: 423, trend: 'up', change: 5.2, updatedAt: new Date().toISOString() },
        { id: 'm5', name: 'Sessions', value: '2.4K', trend: 'up', change: 15.0, updatedAt: new Date().toISOString() },
        { id: 'm6', name: 'Avg. Session', value: '24m', trend: 'up', change: 3.1, updatedAt: new Date().toISOString() },
      ],
    },
    {
      id: 'satisfaction',
      name: 'Satisfaction',
      metrics: [
        { id: 'm7', name: 'NPS', value: 72, trend: 'up', change: 4, updatedAt: new Date().toISOString() },
        { id: 'm8', name: 'CSAT', value: '4.6', unit: '/ 5', trend: 'stable', updatedAt: new Date().toISOString() },
      ],
    },
    {
      id: 'focus',
      name: 'Focus Stats',
      metrics: [
        { id: 'm9', name: 'Sessions Today', value: 12, trend: 'up', change: 2, updatedAt: new Date().toISOString() },
        { id: 'm10', name: 'Focus Time', value: '4h 32m', trend: 'up', updatedAt: new Date().toISOString() },
        { id: 'm11', name: 'Blocked', value: 47, unit: 'sites', trend: 'down', change: -15, updatedAt: new Date().toISOString() },
      ],
    },
  ],
  
  apiStatuses: [
    { name: 'Analytics API', status: 'connected', latency: 45 },
    { name: 'Auth Service', status: 'connected', latency: 23 },
    { name: 'Metrics DB', status: 'connected', latency: 12 },
  ],
  
  lastUpdated: new Date().toISOString(),
  
  updateMetric: (groupId, metricId, value) => set((state) => ({
    metricGroups: state.metricGroups.map((group) =>
      group.id === groupId
        ? {
            ...group,
            metrics: group.metrics.map((m) =>
              m.id === metricId
                ? { ...m, value, updatedAt: new Date().toISOString() }
                : m
            ),
          }
        : group
    ),
    lastUpdated: new Date().toISOString(),
  })),
  
  addMetricGroup: (name) => set((state) => ({
    metricGroups: [
      ...state.metricGroups,
      { id: generateId(), name, metrics: [] },
    ],
  })),
  
  addMetric: (groupId, metric) => set((state) => ({
    metricGroups: state.metricGroups.map((group) =>
      group.id === groupId
        ? {
            ...group,
            metrics: [
              ...group.metrics,
              { ...metric, id: generateId(), updatedAt: new Date().toISOString() },
            ],
          }
        : group
    ),
  })),
  
  setApiStatus: (name, status, latency) => set((state) => ({
    apiStatuses: state.apiStatuses.map((api) =>
      api.name === name ? { ...api, status, latency } : api
    ),
  })),
  
  loadMetricGroups: (groups) => set({ metricGroups: groups }),
  loadApiStatuses: (statuses) => set({ apiStatuses: statuses }),
}));
