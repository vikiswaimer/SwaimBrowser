import { useSidebarStore, useFocusStore, useInsightsStore } from '@store';
import { FOCUS_CONFIG, formatDate } from '@shared';
import type { SidebarTab, FocusDuration } from '@shared';
import styles from './Sidebar.module.css';

export function Sidebar() {
  const { isOpen, activeTab, close, setTab } = useSidebarStore();
  const {
    isActive: focusActive,
    selectedDuration,
    currentGoal,
    sessions,
    setDuration,
    setGoal,
    start,
  } = useFocusStore();
  const { recentInsights } = useInsightsStore();

  const tabs: { id: SidebarTab; label: string }[] = [
    { id: 'focus', label: 'Focus' },
    { id: 'projects', label: 'Projects' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <header className={styles.header}>
        <span className={styles.title}>Swaim</span>
        <button className={styles.closeBtn} onClick={close}>
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </header>

      <nav className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className={styles.content}>
        {activeTab === 'focus' && (
          <div className={styles.pane}>
            <h3 className={styles.sectionTitle}>New Session</h3>
            <div className={styles.durationPicker}>
              {FOCUS_CONFIG.SESSION_DURATIONS.map((duration) => (
                <button
                  key={duration}
                  className={`${styles.durationBtn} ${
                    selectedDuration === duration ? styles.selected : ''
                  }`}
                  onClick={() => setDuration(duration as FocusDuration)}
                >
                  {duration} min
                </button>
              ))}
            </div>
            <input
              type="text"
              className={styles.input}
              placeholder="What's your goal?"
              value={currentGoal}
              onChange={(e) => setGoal(e.target.value)}
            />
            <button
              className={styles.primaryBtn}
              onClick={start}
              disabled={focusActive}
            >
              Start Focus
            </button>

            {sessions.length > 0 && (
              <>
                <h4 className={styles.subTitle}>Recent Sessions</h4>
                <div className={styles.sessionList}>
                  {sessions
                    .slice(-5)
                    .reverse()
                    .map((session) => (
                      <div key={session.id} className={styles.sessionItem}>
                        <span className={styles.sessionGoal}>
                          {session.goal || 'No goal set'}
                        </span>
                        <span className={styles.sessionMeta}>
                          {session.durationMinutes}min • {formatDate(session.startTime)}
                        </span>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className={styles.pane}>
            <h3 className={styles.sectionTitle}>Projects</h3>
            <p className={styles.placeholder}>Projects feature coming soon...</p>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className={styles.pane}>
            <h3 className={styles.sectionTitle}>Recent Insights</h3>
            {recentInsights.length === 0 ? (
              <p className={styles.placeholder}>
                No insights yet. Press Alt+P to add one.
              </p>
            ) : (
              <div className={styles.insightList}>
                {recentInsights.map((insight) => (
                  <div key={insight.id} className={styles.insightItem}>
                    <p className={styles.insightText}>{insight.text}</p>
                    <span className={styles.insightMeta}>
                      {formatDate(insight.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
