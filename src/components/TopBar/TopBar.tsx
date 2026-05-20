import { useCallback, KeyboardEvent } from 'react';
import { useBrowserStore, useFocusStore } from '@store';
import styles from './TopBar.module.css';

interface TopBarProps {
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
}

export function TopBar({ onBack, onForward, onReload }: TopBarProps) {
  const { inputValue, setInputValue, navigate, canGoBack, canGoForward, isLoading } =
    useBrowserStore();
  const { isActive: focusActive, toggle: toggleFocus, timerDisplay } = useFocusStore();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        navigate(inputValue);
      }
    },
    [inputValue, navigate]
  );

  const handleWindowClose = useCallback(() => {
    window.electron?.window?.close();
  }, []);
  const handleWindowMinimize = useCallback(() => {
    window.electron?.window?.minimize();
  }, []);
  const handleWindowMaximize = useCallback(() => {
    window.electron?.window?.maximize();
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

      <div className={styles.navButtons}>
        <button
          className={styles.navBtn}
          onClick={onBack}
          disabled={!canGoBack}
          title="Back"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 3L5 7L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          className={styles.navBtn}
          onClick={onForward}
          disabled={!canGoForward}
          title="Forward"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className={styles.navBtn} onClick={onReload} title="Reload">
          {isLoading ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M10 6C10 8.21 8.21 10 6 10C3.79 10 2 8.21 2 6C2 3.79 3.79 2 6 2C7.38 2 8.6 2.68 9.33 3.73"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
              <path d="M10 2V4.5H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          )}
        </button>
      </div>

      <div className={styles.urlBar}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={styles.searchIcon}>
          <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 8L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
        {focusActive && (
          <div className={styles.miniTimer}>
            <span className={styles.timerDot} />
            <span className={styles.timerText}>{timerDisplay}</span>
          </div>
        )}
        <button
          className={`${styles.actionBtn} ${focusActive ? styles.active : ''}`}
          onClick={toggleFocus}
          title="Deep Work Mode"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7 4V7L9 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}
