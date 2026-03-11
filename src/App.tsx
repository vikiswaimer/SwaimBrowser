import { useRef, useCallback, useEffect } from 'react';
import { TopBar, BrowserView, Sidebar } from '@components';
import { useBrowserStore, useFocusStore, useInsightsStore } from '@store';
import { STORAGE_KEYS, HOTKEYS } from '@shared';
import './styles/theme.css';

function App() {
  const webviewRef = useRef<HTMLWebViewElement>(null);
  const { currentUrl } = useBrowserStore();
  const { toggle: toggleFocus } = useFocusStore();
  const { addInsight, loadInsights } = useInsightsStore();

  const handleBack = useCallback(() => {
    webviewRef.current?.goBack();
  }, []);

  const handleForward = useCallback(() => {
    webviewRef.current?.goForward();
  }, []);

  const handleReload = useCallback(() => {
    webviewRef.current?.reload();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (window.electron) {
        const insights = await window.electron.store.get(STORAGE_KEYS.INSIGHTS, []);
        loadInsights(insights);
      }
    };
    loadData();
  }, [loadInsights]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.altKey === HOTKEYS.ADD_INSIGHT.altKey &&
        event.key.toLowerCase() === HOTKEYS.ADD_INSIGHT.key
      ) {
        event.preventDefault();
        const text = prompt('Add insight:', '');
        if (text) {
          addInsight(currentUrl, text);
        }
      }

      if (
        event.ctrlKey === HOTKEYS.TOGGLE_FOCUS.ctrlKey &&
        event.shiftKey === HOTKEYS.TOGGLE_FOCUS.shiftKey &&
        event.key === HOTKEYS.TOGGLE_FOCUS.key
      ) {
        event.preventDefault();
        toggleFocus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentUrl, addInsight, toggleFocus]);

  return (
    <div className="app">
      <TopBar onBack={handleBack} onForward={handleForward} onReload={handleReload} />
      <div className="app-content">
        <BrowserView webviewRef={webviewRef} />
        <Sidebar />
      </div>
    </div>
  );
}

export default App;
