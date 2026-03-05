import { create } from 'zustand';
import { BROWSER_CONFIG, normalizeUrl } from '@shared';
import type { BrowserTab } from '@shared';

interface BrowserState {
  currentUrl: string;
  inputValue: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  pageTitle: string;

  setUrl: (url: string) => void;
  setInputValue: (value: string) => void;
  navigate: (input: string) => void;
  setLoading: (loading: boolean) => void;
  setNavigationState: (canBack: boolean, canForward: boolean) => void;
  setPageTitle: (title: string) => void;
  goHome: () => void;
}

export const useBrowserStore = create<BrowserState>((set, get) => ({
  currentUrl: BROWSER_CONFIG.DEFAULT_HOME_URL,
  inputValue: BROWSER_CONFIG.DEFAULT_HOME_URL,
  isLoading: false,
  canGoBack: false,
  canGoForward: false,
  pageTitle: 'Swaim Browser',

  setUrl: (url) => set({ currentUrl: url, inputValue: url }),

  setInputValue: (value) => set({ inputValue: value }),

  navigate: (input) => {
    const normalizedUrl = normalizeUrl(input);
    if (normalizedUrl) {
      set({ currentUrl: normalizedUrl, inputValue: normalizedUrl });
    }
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setNavigationState: (canBack, canForward) =>
    set({ canGoBack: canBack, canGoForward: canForward }),

  setPageTitle: (title) => set({ pageTitle: title }),

  goHome: () =>
    set({
      currentUrl: BROWSER_CONFIG.DEFAULT_HOME_URL,
      inputValue: BROWSER_CONFIG.DEFAULT_HOME_URL,
    }),
}));
