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
  stop: () => void;
  toggle: () => void;
  tick: () => void;
  loadSessions: (sessions: FocusSession[]) => void;
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
    const session: FocusSession = {
      id: generateId(),
      startTime: new Date().toISOString(),
      durationMinutes: selectedDuration,
      goal: currentGoal,
      completed: false,
      blockedAttempts: [],
    };
    set({
      isActive: true,
      currentSession: session,
      remainingSeconds: minutesToSeconds(selectedDuration),
    });
  },

  stop: () => {
    const { currentSession, sessions } = get();
    if (currentSession) {
      const completedSession: FocusSession = {
        ...currentSession,
        endTime: new Date().toISOString(),
        completed: true,
      };
      set({
        isActive: false,
        currentSession: null,
        sessions: [...sessions, completedSession],
      });
    } else {
      set({ isActive: false });
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
      get().stop();
      return;
    }
    set({
      remainingSeconds: newSeconds,
      timerDisplay: formatTimeDisplay(newSeconds),
    });
  },

  loadSessions: (sessions) => set({ sessions }),
}));
