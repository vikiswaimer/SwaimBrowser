import { useEffect } from 'react';
import { useFocusStore } from '@store';
import { FOCUS_CONFIG } from '@shared';
import styles from './FocusOverlay.module.css';

export function FocusOverlay() {
  const { isActive, timerDisplay, currentGoal, remainingSeconds, selectedDuration, stop, tick } = useFocusStore();

  useEffect(() => {
    if (!isActive) return;

    const intervalId = setInterval(() => {
      tick();
    }, FOCUS_CONFIG.TIMER_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [isActive, tick]);

  if (!isActive) return null;

  const totalSeconds = selectedDuration * 60;
  const progress = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.label}>DEEP WORK</span>
          <span className={styles.sublabel}>Focus Mode Active</span>
        </div>

        <div className={styles.timerContainer}>
          <svg className={styles.progressRing} viewBox="0 0 200 200">
            <circle
              className={styles.progressBg}
              cx="100"
              cy="100"
              r="90"
              fill="none"
              strokeWidth="2"
            />
            <circle
              className={styles.progressCircle}
              cx="100"
              cy="100"
              r="90"
              fill="none"
              strokeWidth="2"
              strokeDasharray={2 * Math.PI * 90}
              strokeDashoffset={2 * Math.PI * 90 * (1 - progress / 100)}
              transform="rotate(-90 100 100)"
            />
          </svg>
          <div className={styles.timerDisplay}>
            <span className={styles.timer}>{timerDisplay}</span>
            <span className={styles.timerUnit}>remaining</span>
          </div>
        </div>

        {currentGoal && (
          <div className={styles.goalSection}>
            <span className={styles.goalLabel}>CURRENT GOAL</span>
            <p className={styles.goal}>{currentGoal}</p>
          </div>
        )}

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{selectedDuration}</span>
            <span className={styles.statLabel}>min session</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statValue}>{Math.round(progress)}%</span>
            <span className={styles.statLabel}>complete</span>
          </div>
        </div>

        <button className={styles.endBtn} onClick={stop}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="3" y="3" width="8" height="8" rx="1" fill="currentColor" />
          </svg>
          End Session
        </button>

        <div className={styles.hint}>
          Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>F</kbd> to toggle
        </div>
      </div>
    </div>
  );
}
