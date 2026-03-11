import { useCallback, KeyboardEvent } from 'react';
import { useBrowserStore, useFocusStore, useSidebarStore } from '@store';
import styles from './TopBar.module.css';

interface TopBarProps {
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
}

export function TopBar({ onBack, onForward, onReload }: TopBarProps) {
  const { inputValue, setInputValue, navigate, canGoBack, canGoForward, isLoading } =
    useBrowserStore();
  const { isActive: focusActive, toggle: toggleFocus } = useFocusStore();
  const { toggle: toggleSidebar } = useSidebarStore();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        navigate(inputValue);
      }
    },
    [inputValue, navigate]
  );

  const handleWindowClose = useCallback(() => {
    window.electron?.window.close();
  }, []);
  const handleWindowMinimize = useCallback(() => {
    window.electron?.window.minimize();
  }, []);
  const handleWindowMaximize = useCallback(() => {
    window.electron?.window.maximize();
  }, []);

  return (
    <header className={styles.topbar}>
      <div className={styles.trafficLights}>
        <button
          type="button"
          className={`${styles.trafficLight} ${styles.red}`}
          onClick={handleWindowClose}
          title="Закрыть"
          aria-label="Закрыть"
        />
        <button
          type="button"
          className={`${styles.trafficLight} ${styles.yellow}`}
          onClick={handleWindowMinimize}
          title="Свернуть"
          aria-label="Свернуть"
        />
        <button
          type="button"
          className={`${styles.trafficLight} ${styles.green}`}
          onClick={handleWindowMaximize}
          title="Развернуть"
          aria-label="Развернуть"
        />
      </div>

      <div className={styles.logo}>
        <div className={styles.logoIcon} />
        <span className={styles.logoText}>Swaim</span>
      </div>

      <div className={styles.navButtons}>
        <button
          className={styles.navBtn}
          onClick={onBack}
          disabled={!canGoBack}
          title="Back"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M10.5 13L5.5 8L10.5 3" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </button>
        <button
          className={styles.navBtn}
          onClick={onForward}
          disabled={!canGoForward}
          title="Forward"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5.5 3L10.5 8L5.5 13" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </button>
        <button className={styles.navBtn} onClick={onReload} title="Reload">
          {isLoading ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <path
                d="M12 7C12 9.76 9.76 12 7 12C4.24 12 2 9.76 2 7C2 4.24 4.24 2 7 2C8.76 2 10.3 2.91 11.18 4.27"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <path d="M12 2V5H9" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          )}
        </button>
      </div>

      <div className={styles.urlBar}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className={styles.searchIcon}>
          <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M9 9L12 12" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <input
          type="text"
          className={styles.urlInput}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search or enter URL..."
          spellCheck={false}
        />
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.actionBtn} ${focusActive ? styles.active : ''}`}
          onClick={toggleFocus}
          title="Focus Mode"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path
              d="M8 3V8L11 10"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </button>
        <button className={styles.actionBtn} onClick={toggleSidebar} title="Sidebar">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <rect x="2" y="3" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M10 3V13" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
    </header>
  );
}
