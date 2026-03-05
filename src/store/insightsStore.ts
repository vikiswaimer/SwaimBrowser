import { create } from 'zustand';
import { generateId, UI_CONFIG } from '@shared';
import type { Insight } from '@shared';

interface InsightsState {
  insights: Insight[];
  recentInsights: Insight[];

  addInsight: (url: string, text: string, tags?: string[]) => void;
  removeInsight: (id: string) => void;
  loadInsights: (insights: Insight[]) => void;
  updateInsight: (id: string, updates: Partial<Insight>) => void;
}

export const useInsightsStore = create<InsightsState>((set, get) => ({
  insights: [],
  recentInsights: [],

  addInsight: (url, text, tags = []) => {
    const newInsight: Insight = {
      id: generateId(),
      url,
      text,
      timestamp: new Date().toISOString(),
      tags,
    };
    const updatedInsights = [...get().insights, newInsight];
    set({
      insights: updatedInsights,
      recentInsights: updatedInsights.slice(-UI_CONFIG.RECENT_INSIGHTS_COUNT),
    });
  },

  removeInsight: (id) => {
    const updatedInsights = get().insights.filter((i) => i.id !== id);
    set({
      insights: updatedInsights,
      recentInsights: updatedInsights.slice(-UI_CONFIG.RECENT_INSIGHTS_COUNT),
    });
  },

  loadInsights: (insights) =>
    set({
      insights,
      recentInsights: insights.slice(-UI_CONFIG.RECENT_INSIGHTS_COUNT),
    }),

  updateInsight: (id, updates) => {
    const updatedInsights = get().insights.map((i) =>
      i.id === id ? { ...i, ...updates } : i
    );
    set({
      insights: updatedInsights,
      recentInsights: updatedInsights.slice(-UI_CONFIG.RECENT_INSIGHTS_COUNT),
    });
  },
}));
