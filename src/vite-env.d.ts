/// <reference types="vite/client" />

interface HTMLWebViewElement extends HTMLElement {
  src: string;
  goBack(): void;
  goForward(): void;
  reload(): void;
  canGoBack(): boolean;
  canGoForward(): boolean;
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
