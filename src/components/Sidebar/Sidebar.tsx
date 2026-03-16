import { useState, useEffect, useCallback } from 'react';
import { useSidebarStore, useFocusStore, useInsightsStore, useProjectsStore } from '@store';
import { FOCUS_CONFIG, formatDate, STORAGE_KEYS } from '@shared';
import type { SidebarTab, FocusDuration, TreeNode } from '@shared';
import { TreeView, ImportBookmarks } from '../TreeView';
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
  const { nodes, loadNodes } = useProjectsStore();
  const [showImport, setShowImport] = useState(false);

  const loadProjectsFromStorage = useCallback(async () => {
    try {
      if (window.electronAPI) {
        const savedNodes = await window.electronAPI.storeGet(STORAGE_KEYS.PROJECTS);
        if (savedNodes && Array.isArray(savedNodes)) {
          loadNodes(savedNodes as TreeNode[]);
        }
      } else {
        const savedNodes = localStorage.getItem(STORAGE_KEYS.PROJECTS);
        if (savedNodes) {
          loadNodes(JSON.parse(savedNodes));
        }
      }
    } catch (error) {
      console.warn('Failed to load projects from storage:', error);
    }
  }, [loadNodes]);

  const saveProjectsToStorage = useCallback(async () => {
    try {
      if (window.electronAPI) {
        await window.electronAPI.storeSet(STORAGE_KEYS.PROJECTS, nodes);
      } else {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(nodes));
      }
    } catch (error) {
      console.warn('Failed to save projects to storage:', error);
    }
  }, [nodes]);

  useEffect(() => {
    loadProjectsFromStorage();
  }, [loadProjectsFromStorage]);

  useEffect(() => {
    if (nodes.length > 0) {
      saveProjectsToStorage();
    }
  }, [nodes, saveProjectsToStorage]);

  const handleOpenUrl = useCallback((url: string) => {
    if (window.electronAPI) {
      window.electronAPI.navigate(url);
    } else {
      window.open(url, '_blank');
    }
  }, []);

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
            <div className={styles.projectsHeader}>
              <h3 className={styles.sectionTitle}>Projects</h3>
              <button
                className={styles.importBtn}
                onClick={() => setShowImport(true)}
                title="Import bookmarks"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1V10M7 10L4 7M7 10L10 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Import
              </button>
            </div>
            <TreeView onOpenUrl={handleOpenUrl} />
            {showImport && (
              <ImportBookmarks onClose={() => setShowImport(false)} />
            )}
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
