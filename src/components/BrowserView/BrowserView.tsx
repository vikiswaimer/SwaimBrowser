import { useEffect, useRef, useCallback } from 'react';
import { useBrowserStore, useFocusStore } from '@store';
import { isBlockedDomain, extractDomainFromUrl } from '@shared';
import { FocusOverlay } from '../FocusOverlay';
import styles from './BrowserView.module.css';

interface BrowserViewProps {
  webviewRef: React.RefObject<HTMLWebViewElement>;
}

export function BrowserView({ webviewRef }: BrowserViewProps) {
  const { currentUrl, isLoading, setUrl, setLoading, setNavigationState, setPageTitle } =
    useBrowserStore();
  const { isActive: focusActive } = useFocusStore();
  const lastUrlRef = useRef<string>(currentUrl);

  const handleDomReady = useCallback(() => {
    const webview = webviewRef.current;
    if (!webview) return;

    setLoading(false);
    setUrl(webview.src);
    setNavigationState(webview.canGoBack(), webview.canGoForward());
  }, [setLoading, setUrl, setNavigationState, webviewRef]);

  const handleLoadStart = useCallback(() => {
    setLoading(true);
  }, [setLoading]);

  const handlePageTitleUpdated = useCallback(
    (event: Event & { title?: string }) => {
      if (event.title) {
        setPageTitle(event.title);
      }
    },
    [setPageTitle]
  );

  const handleWillNavigate = useCallback(
    (event: Event & { url?: string }) => {
      if (focusActive && event.url && isBlockedDomain(event.url)) {
        const domain = extractDomainFromUrl(event.url);
        console.log(`Blocked navigation to ${domain} during focus session`);
      }
    },
    [focusActive]
  );

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return;

    webview.addEventListener('dom-ready', handleDomReady);
    webview.addEventListener('did-start-loading', handleLoadStart);
    webview.addEventListener('page-title-updated', handlePageTitleUpdated as EventListener);
    webview.addEventListener('will-navigate', handleWillNavigate as EventListener);

    return () => {
      webview.removeEventListener('dom-ready', handleDomReady);
      webview.removeEventListener('did-start-loading', handleLoadStart);
      webview.removeEventListener('page-title-updated', handlePageTitleUpdated as EventListener);
      webview.removeEventListener('will-navigate', handleWillNavigate as EventListener);
    };
  }, [webviewRef, handleDomReady, handleLoadStart, handlePageTitleUpdated, handleWillNavigate]);

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview || currentUrl === lastUrlRef.current) return;

    lastUrlRef.current = currentUrl;
    webview.src = currentUrl;
  }, [currentUrl, webviewRef]);

  const showPlaceholder = isLoading;

  return (
    <main className={styles.browser}>
      {showPlaceholder && (
        <div className={styles.placeholder}>
          <div className={styles.placeholderContent}>
            <h2>Swaim Browser</h2>
            <p>Браузер для фаундеров: Deep Work + Product Discovery</p>
          </div>
        </div>
      )}
      <webview
        ref={webviewRef}
        className={styles.webview}
        src={currentUrl}
      />
      <FocusOverlay />
    </main>
  );
}
