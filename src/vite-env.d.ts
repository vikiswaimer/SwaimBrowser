/// <reference types="vite/client" />

interface HTMLWebViewElement extends HTMLElement {
  src: string;
  goBack(): void;
  goForward(): void;
  reload(): void;
  canGoBack(): boolean;
  canGoForward(): boolean;
}

interface ElectronAPI {
  storeGet: (key: string) => Promise<unknown>;
  storeSet: (key: string, value: unknown) => Promise<void>;
  navigate: (url: string) => void;
}

interface Window {
  electronAPI?: ElectronAPI;
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
