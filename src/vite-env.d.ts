/// <reference types="vite/client" />

interface HTMLWebViewElement extends HTMLElement {
  src: string;
  goBack(): void;
  goForward(): void;
  reload(): void;
  canGoBack(): boolean;
  canGoForward(): boolean;
}

interface ElectronStore {
  get: (key: string, defaultValue?: unknown) => Promise<unknown>;
  set: (key: string, value: unknown) => Promise<void>;
  delete: (key: string) => Promise<void>;
  clear: () => Promise<void>;
}

interface Window {
  electron?: {
    store: ElectronStore;
    app?: { getVersion: () => Promise<string>; getPlatform: () => Promise<string> };
    window?: { minimize: () => void; maximize: () => void; close: () => void };
  };
}

declare namespace JSX {
  interface IntrinsicElements {
    webview: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLWebViewElement> & {
        src?: string;
        ref?: React.Ref<HTMLWebViewElement>;
      },
      HTMLWebViewElement
    >;
  }
}
