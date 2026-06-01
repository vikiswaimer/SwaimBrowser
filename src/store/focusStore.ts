import { create } from 'zustand';
import {
  FOCUS_CONFIG,
  generateId,
  minutesToSeconds,
  formatTimeDisplay,
} from '@shared';
import type { FocusSession, FocusDuration } from '@shared';

interface FocusState {
  isActive: boolean;
  remainingSeconds: number;
  currentGoal: string;
  selectedDuration: FocusDuration;
  currentSession: FocusSession | null;
  sessions: FocusSession[];
  timerDisplay: string;

  setDuration: (duration: FocusDuration) => void;
  setGoal: (goal: string) => void;
  start: () => void;
  stop: (wasCompleted?: boolean) => void;
  toggle: () => void;
  tick: () => void;
  loadSessions: (sessions: FocusSession[]) => void;
}

function showSessionCompleteNotification(session: FocusSession): void {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification('Deep Work Complete!', {
      body: session.goal 
        ? `Great job! You completed "${session.goal}"` 
        : `${session.durationMinutes} minute session completed!`,
      icon: '/favicon.ico',
      tag: 'focus-complete',
    });
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
}

function requestNotificationPermission(): void {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

export const useFocusStore = create<FocusState>((set, get) => ({
  isActive: false,
  remainingSeconds: minutesToSeconds(FOCUS_CONFIG.DEFAULT_DURATION_MINUTES),
  currentGoal: '',
  selectedDuration: FOCUS_CONFIG.DEFAULT_DURATION_MINUTES as FocusDuration,
  currentSession: null,
  sessions: [],
  timerDisplay: formatTimeDisplay(
    minutesToSeconds(FOCUS_CONFIG.DEFAULT_DURATION_MINUTES)
  ),

  setDuration: (duration) => {
    const seconds = minutesToSeconds(duration);
    set({
      selectedDuration: duration,
      remainingSeconds: seconds,
      timerDisplay: formatTimeDisplay(seconds),
    });
  },

  setGoal: (goal) => set({ currentGoal: goal }),

  start: () => {
    const { selectedDuration, currentGoal } = get();
    requestNotificationPermission();
    
    const session: FocusSession = {
      id: generateId(),
      startTime: new Date().toISOString(),
      durationMinutes: selectedDuration,
      goal: currentGoal,
      completed: false,
      blockedAttempts: [],
    };
    
    const seconds = minutesToSeconds(selectedDuration);
    set({
      isActive: true,
      currentSession: session,
      remainingSeconds: seconds,
      timerDisplay: formatTimeDisplay(seconds),
    });
  },

  stop: (wasCompleted = false) => {
    const { currentSession, sessions, selectedDuration } = get();
    
    if (currentSession) {
      const completedSession: FocusSession = {
        ...currentSession,
        endTime: new Date().toISOString(),
        completed: wasCompleted,
      };
      
      if (wasCompleted) {
        showSessionCompleteNotification(completedSession);
      }
      
      const initialSeconds = minutesToSeconds(selectedDuration);
      set({
        isActive: false,
        currentSession: null,
        sessions: [...sessions, completedSession],
        remainingSeconds: initialSeconds,
        timerDisplay: formatTimeDisplay(initialSeconds),
      });
    } else {
      const initialSeconds = minutesToSeconds(selectedDuration);
      set({ 
        isActive: false,
        remainingSeconds: initialSeconds,
        timerDisplay: formatTimeDisplay(initialSeconds),
      });
    }
  },

  toggle: () => {
    const { isActive, start, stop } = get();
    if (isActive) {
      stop();
    } else {
      start();
    }
  },

  tick: () => {
    const { remainingSeconds, isActive } = get();
    if (!isActive) return;

    const newSeconds = remainingSeconds - 1;
    if (newSeconds <= 0) {
      set({
        remainingSeconds: 0,
        timerDisplay: formatTimeDisplay(0),
      });
      get().stop(true);
      return;
    }
    set({
      remainingSeconds: newSeconds,
      timerDisplay: formatTimeDisplay(newSeconds),
    });
  },

  loadSessions: (sessions) => set({ sessions }),
}));
