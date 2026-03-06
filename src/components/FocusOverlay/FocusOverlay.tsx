import { useEffect } from 'react';
import { useFocusStore } from '@store';
import { FOCUS_CONFIG } from '@shared';
import styles from './FocusOverlay.module.css';

export function FocusOverlay() {
  const { isActive, timerDisplay, currentGoal, stop, tick } = useFocusStore();

  useEffect(() => {
    if (!isActive) return;

    const intervalId = setInterval(() => {
      tick();
    }, FOCUS_CONFIG.TIMER_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [isActive, tick]);

  if (!isActive) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <div className={styles.timer}>{timerDisplay}</div>
        {currentGoal && <p className={styles.goal}>{currentGoal}</p>}
        <button className={styles.endBtn} onClick={stop}>
          End Session
        </button>
      </div>
    </div>
  );
}
