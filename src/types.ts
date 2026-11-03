export type Priority = 'high' | 'medium' | 'low';
export type TaskCategory = 'study' | 'personal';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  subject?: string;
  priority: Priority;
  category: TaskCategory;
  estimatedMinutes: number;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:MM
  notes?: string;
  completed: boolean;
  completedAt?: string;
  subtasks: SubTask[];
}

export interface GoalStep {
  id: string;
  title: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  subject: string;
  targetDate: string;
  steps: GoalStep[];
  reward?: string;
  completed: boolean;
  createdAt: string;
}


export interface StudentBadge {
  id: string;
  titleKey: string;
  descKey: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  conditionMet: boolean;
}

export interface StudentStats {
  points: number;
  completedTasksCount: number;
  totalStudyMinutes: number;
  streakDays: number;
  lastActiveDate: string;
  badges: string[];
}

export interface UserSettings {
  language: 'ar' | 'en';
  studentName: string;
  defaultStudyDuration: number; // minutes
  defaultBreakDuration: number; // minutes
  soundEnabled: boolean;
}
