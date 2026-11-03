import { Task, Goal, StudentStats, UserSettings } from '../types';

const STORAGE_KEYS = {
  TASKS: 'study_todo_tasks',
  GOALS: 'study_todo_goals',
  STATS: 'study_todo_stats',
  SETTINGS: 'study_todo_settings',
};

const getTodayString = () => new Date().toISOString().split('T')[0];

const defaultSampleTasks: Task[] = [];

const defaultSampleGoals: Goal[] = [];

const defaultSettings: UserSettings = {
  language: 'ar',
  studentName: '',
  defaultStudyDuration: 25,
  defaultBreakDuration: 5,
  soundEnabled: true,
};

const defaultStats: StudentStats = {
  points: 0,
  completedTasksCount: 0,
  totalStudyMinutes: 0,
  streakDays: 0,
  lastActiveDate: getTodayString(),
  badges: [],
};

export const loadTasks = (): Task[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) {
      saveTasks([]);
      return [];
    }
    const parsed: Task[] = JSON.parse(raw);
    // Filter out old sample tasks if present
    const cleaned = parsed.filter((t) => !t.id.startsWith('sample-task-'));
    if (cleaned.length !== parsed.length) {
      saveTasks(cleaned);
    }
    return cleaned;
  } catch {
    return [];
  }
};

export const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
};

export const loadGoals = (): Goal[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (!raw) {
      saveGoals([]);
      return [];
    }
    const parsed: Goal[] = JSON.parse(raw);
    const cleaned = parsed.filter((g) => !g.id.startsWith('sample-goal-'));
    if (cleaned.length !== parsed.length) {
      saveGoals(cleaned);
    }
    return cleaned;
  } catch {
    return [];
  }
};

export const saveGoals = (goals: Goal[]) => {
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
};

export const loadStats = (): StudentStats => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    if (!raw) {
      saveStats(defaultStats);
      return defaultStats;
    }
    return JSON.parse(raw);
  } catch {
    return defaultStats;
  }
};

export const saveStats = (stats: StudentStats) => {
  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
};

export const loadSettings = (): UserSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      saveSettings(defaultSettings);
      return defaultSettings;
    }
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
};

export const saveSettings = (settings: UserSettings) => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

export const exportAllData = () => {
  const data = {
    app: 'My Study To-Do List',
    exportDate: new Date().toISOString(),
    version: '1.0',
    tasks: loadTasks(),
    goals: loadGoals(),
    stats: loadStats(),
    settings: loadSettings(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `my-study-todo-backup-${getTodayString()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importDataFromJSON = (jsonString: string): boolean => {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.tasks && Array.isArray(parsed.tasks)) {
      saveTasks(parsed.tasks);
    }
    if (parsed.goals && Array.isArray(parsed.goals)) {
      saveGoals(parsed.goals);
    }
    if (parsed.stats) {
      saveStats(parsed.stats);
    }
    if (parsed.settings) {
      saveSettings(parsed.settings);
    }
    return true;
  } catch (err) {
    console.error('Import error', err);
    return false;
  }
};

export const clearAllDataFromStorage = () => {
  localStorage.removeItem(STORAGE_KEYS.TASKS);
  localStorage.removeItem(STORAGE_KEYS.GOALS);
  localStorage.removeItem(STORAGE_KEYS.STATS);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
};
