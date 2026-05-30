import { useRef, useCallback, useEffect } from 'react';
import { TopBar, BrowserView, LeftPanel, RightPanel } from '@components';
import { useBrowserStore, useFocusStore, useInsightsStore, useHypothesesStore, useMetricsStore } from '@store';
import { STORAGE_KEYS, HOTKEYS } from '@shared';
import type { Insight, FocusSession, Hypothesis, Sprint, SprintTask } from '@shared';
import './styles/theme.css';

const HYPOTHESES_KEY = 'hypotheses';
const SPRINTS_KEY = 'sprints';
const TASKS_KEY = 'tasks';

function App() {
  const webviewRef = useRef<HTMLWebViewElement>(null);
  const { currentUrl } = useBrowserStore();
  const { toggle: toggleFocus, sessions, loadSessions } = useFocusStore();
  const { addInsight, loadInsights, insights } = useInsightsStore();
  const { 
    hypotheses, 
    sprints, 
    tasks, 
    loadHypotheses, 
    loadSprints, 
    loadTasks 
  } = useHypothesesStore();

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
      try {
        if (window.electron) {
          const [
            savedInsights,
            savedSessions,
            savedHypotheses,
            savedSprints,
            savedTasks
          ] = await Promise.all([
            window.electron.store.get(STORAGE_KEYS.INSIGHTS, []) as Promise<Insight[]>,
            window.electron.store.get(STORAGE_KEYS.SESSIONS, []) as Promise<FocusSession[]>,
            window.electron.store.get(HYPOTHESES_KEY, null) as Promise<Hypothesis[] | null>,
            window.electron.store.get(SPRINTS_KEY, null) as Promise<Sprint[] | null>,
            window.electron.store.get(TASKS_KEY, null) as Promise<SprintTask[] | null>,
          ]);
          
          loadInsights(savedInsights);
          loadSessions(savedSessions);
          
          if (savedHypotheses) loadHypotheses(savedHypotheses);
          if (savedSprints) loadSprints(savedSprints);
          if (savedTasks) loadTasks(savedTasks);
        }
      } catch (error) {
        console.warn('Failed to load data from storage:', error);
      }
    };
    loadData();
  }, [loadInsights, loadSessions, loadHypotheses, loadSprints, loadTasks]);

  useEffect(() => {
    const saveData = async () => {
      try {
        if (window.electron) {
          await Promise.all([
            window.electron.store.set(STORAGE_KEYS.INSIGHTS, insights),
            window.electron.store.set(STORAGE_KEYS.SESSIONS, sessions),
            window.electron.store.set(HYPOTHESES_KEY, hypotheses),
            window.electron.store.set(SPRINTS_KEY, sprints),
            window.electron.store.set(TASKS_KEY, tasks),
          ]);
        }
      } catch (error) {
        console.warn('Failed to save data to storage:', error);
      }
    };
    saveData();
  }, [insights, sessions, hypotheses, sprints, tasks]);

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
        <LeftPanel />
        <BrowserView webviewRef={webviewRef} />
        <RightPanel />
      </div>
    </div>
  );
}

export default App;
