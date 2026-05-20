import { create } from 'zustand';
import type { Hypothesis, Sprint, SprintTask, HypothesisStatus } from '@shared';

interface HypothesesState {
  hypotheses: Hypothesis[];
  sprints: Sprint[];
  tasks: SprintTask[];
  activeSprint: Sprint | null;
  
  addHypothesis: (text: string) => void;
  updateHypothesisStatus: (id: string, status: HypothesisStatus) => void;
  removeHypothesis: (id: string) => void;
  
  addSprint: (name: string, goal: string) => void;
  setActiveSprint: (id: string) => void;
  closeSprint: (id: string) => void;
  
  addTask: (sprintId: string, text: string, priority?: 'low' | 'medium' | 'high') => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  
  loadHypotheses: (hypotheses: Hypothesis[]) => void;
  loadSprints: (sprints: Sprint[]) => void;
  loadTasks: (tasks: SprintTask[]) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useHypothesesStore = create<HypothesesState>((set, get) => ({
  hypotheses: [
    {
      id: '1',
      text: 'Users prefer dark mode for focused work',
      status: 'validated',
      createdAt: new Date().toISOString(),
      validatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      text: 'Blocking distracting sites increases productivity by 40%',
      status: 'testing',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      text: 'Real-time metrics motivate users to achieve goals',
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      text: 'Gamification of focus sessions increases retention',
      status: 'invalid',
      createdAt: new Date().toISOString(),
    },
  ],
  
  sprints: [
    {
      id: 's1',
      number: 2,
      name: 'Product Hunt Launch',
      goal: 'Validate core value proposition',
      startDate: new Date().toISOString(),
      isActive: true,
      hypotheses: ['1', '2', '3'],
    },
  ],
  
  tasks: [
    { id: 't1', sprintId: 's1', text: 'Design landing page', completed: true, priority: 'high' },
    { id: 't2', sprintId: 's1', text: 'Implement metrics dashboard', completed: false, priority: 'high' },
    { id: 't3', sprintId: 's1', text: 'User interviews (5)', completed: false, priority: 'medium' },
    { id: 't4', sprintId: 's1', text: 'A/B test onboarding', completed: false, priority: 'low' },
  ],
  
  activeSprint: null,
  
  addHypothesis: (text) => set((state) => ({
    hypotheses: [
      ...state.hypotheses,
      {
        id: generateId(),
        text,
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    ],
  })),
  
  updateHypothesisStatus: (id, status) => set((state) => ({
    hypotheses: state.hypotheses.map((h) =>
      h.id === id
        ? {
            ...h,
            status,
            validatedAt: status === 'validated' || status === 'invalid'
              ? new Date().toISOString()
              : h.validatedAt,
          }
        : h
    ),
  })),
  
  removeHypothesis: (id) => set((state) => ({
    hypotheses: state.hypotheses.filter((h) => h.id !== id),
  })),
  
  addSprint: (name, goal) => {
    const { sprints } = get();
    const maxNumber = sprints.length > 0 
      ? Math.max(...sprints.map(s => s.number)) 
      : 0;
    
    set((state) => ({
      sprints: [
        ...state.sprints.map(s => ({ ...s, isActive: false })),
        {
          id: generateId(),
          number: maxNumber + 1,
          name,
          goal,
          startDate: new Date().toISOString(),
          isActive: true,
          hypotheses: [],
        },
      ],
    }));
  },
  
  setActiveSprint: (id) => set((state) => ({
    sprints: state.sprints.map((s) => ({
      ...s,
      isActive: s.id === id,
    })),
    activeSprint: state.sprints.find((s) => s.id === id) || null,
  })),
  
  closeSprint: (id) => set((state) => ({
    sprints: state.sprints.map((s) =>
      s.id === id
        ? { ...s, isActive: false, endDate: new Date().toISOString() }
        : s
    ),
  })),
  
  addTask: (sprintId, text, priority = 'medium') => set((state) => ({
    tasks: [
      ...state.tasks,
      {
        id: generateId(),
        sprintId,
        text,
        completed: false,
        priority,
      },
    ],
  })),
  
  toggleTask: (id) => set((state) => ({
    tasks: state.tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ),
  })),
  
  removeTask: (id) => set((state) => ({
    tasks: state.tasks.filter((t) => t.id !== id),
  })),
  
  loadHypotheses: (hypotheses) => set({ hypotheses }),
  loadSprints: (sprints) => set({ sprints }),
  loadTasks: (tasks) => set({ tasks }),
}));
