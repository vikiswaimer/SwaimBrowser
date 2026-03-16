import { create } from 'zustand';
import type { SidebarTab } from '@shared';

interface SidebarState {
  isOpen: boolean;
  activeTab: SidebarTab;

  toggle: () => void;
  open: () => void;
  close: () => void;
  setTab: (tab: SidebarTab) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true,
  activeTab: 'projects',

  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setTab: (tab) => set({ activeTab: tab, isOpen: true }),
}));
