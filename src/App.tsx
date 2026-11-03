import React, { useState, useEffect, useMemo } from 'react';
import { 
  Task, 
  Goal, 
  StudentStats, 
  UserSettings, 
  Priority 
} from './types';
import { 
  loadTasks, 
  saveTasks, 
  loadGoals, 
  saveGoals, 
  loadStats, 
  saveStats, 
  loadSettings, 
  saveSettings 
} from './utils/storage';
import { translations } from './utils/translations';
import { Header } from './components/Header';
import { FivePrinciplesBanner } from './components/FivePrinciplesBanner';
import { TaskManagement } from './components/TaskManagement';
import { GoalsBreakdown } from './components/GoalsBreakdown';
import { UserGuide } from './components/UserGuide';
import { StudyTimer } from './components/StudyTimer';
import { DashboardAnalytics } from './components/DashboardAnalytics';
import { SettingsBackupModal } from './components/SettingsBackupModal';

import { 
  CheckSquare, 
  BookOpen,
  Footprints, 
  Clock, 
  BarChart2, 
  Settings 
} from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [goals, setGoals] = useState<Goal[]>(() => loadGoals());
  const [stats, setStats] = useState<StudentStats>(() => loadStats());
  const [settings, setSettings] = useState<UserSettings>(() => loadSettings());

  const [activeTab, setActiveTab] = useState<
    'tasks' | 'guide' | 'timer' | 'goals' | 'analytics' | 'settings'
  >('tasks');

  const [selectedTaskForTimer, setSelectedTaskForTimer] = useState<Task | null>(null);

  // Sync document direction & language on mount and changes
  useEffect(() => {
    document.documentElement.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = settings.language;
  }, [settings.language]);

  // Persist tasks
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Persist goals
  useEffect(() => {
    saveGoals(goals);
  }, [goals]);

  // Persist stats
  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  // Persist settings
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const t = translations[settings.language];

  // Calculate today's completion rate
  const todayTasks = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return tasks.filter((t) => t.dueDate === todayStr || !t.completed);
  }, [tasks]);

  const todayCompletionRate = useMemo(() => {
    if (todayTasks.length === 0) return 0;
    const completed = todayTasks.filter((t) => t.completed).length;
    return Math.round((completed / todayTasks.length) * 100);
  }, [todayTasks]);

  // Reward points & badge unlock check
  const handleRewardPoints = (points: number, reason: string) => {
    setStats((prev) => {
      const nextPoints = prev.points + points;
      const nextCompletedCount = prev.completedTasksCount + (points >= 10 ? 1 : 0);
      const unlockedBadges = [...prev.badges];

      if (nextCompletedCount >= 1 && !unlockedBadges.includes('first_task')) {
        unlockedBadges.push('first_task');
      }
      if (nextCompletedCount >= 5 && !unlockedBadges.includes('five_tasks')) {
        unlockedBadges.push('five_tasks');
      }

      return {
        ...prev,
        points: nextPoints,
        completedTasksCount: nextCompletedCount,
        badges: unlockedBadges,
      };
    });
  };

  // Add Task
  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
    handleRewardPoints(5, 'Added new task');
  };

  // Update Task
  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  // Delete Task
  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Clear Completed Tasks (سلة المهملات للمهام المنجزة)
  const handleClearCompletedTasks = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  // Clear All Tasks (مسح جميع المهام)
  const handleClearAllTasks = () => {
    setTasks([]);
  };

  // Add Goal
  const handleAddGoal = (newGoalData: Omit<Goal, 'id' | 'createdAt' | 'completed'>) => {
    const newGoal: Goal = {
      ...newGoalData,
      id: `goal-${Date.now()}`,
      createdAt: new Date().toISOString(),
      completed: false,
    };
    setGoals((prev) => [newGoal, ...prev]);
  };

  // Update Goal
  const handleUpdateGoal = (updatedGoal: Goal) => {
    setGoals((prev) => prev.map((g) => (g.id === updatedGoal.id ? updatedGoal : g)));
    if (updatedGoal.completed) {
      setStats((prev) => {
        if (!prev.badges.includes('goal_crusher')) {
          return { ...prev, badges: [...prev.badges, 'goal_crusher'] };
        }
        return prev;
      });
    }
  };

  // Delete Goal
  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Convert Goal Steps into daily tasks
  const handleConvertStepsToTasks = (convertedTasks: Omit<Task, 'id' | 'completed'>[]) => {
    const created: Task[] = convertedTasks.map((ct) => ({
      ...ct,
      id: `task-from-step-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      completed: false,
    }));
    setTasks((prev) => [...created, ...prev]);
    setActiveTab('tasks');
  };

  // Start study timer with specific task
  const handleStartTimerWithTask = (task: Task) => {
    setSelectedTaskForTimer(task);
    setActiveTab('timer');
  };

  // Session completed in timer
  const handleSessionComplete = (durationMinutes: number, type: 'study' | 'break', task?: Task) => {
    if (type === 'study') {
      setStats((prev) => {
        const nextMinutes = prev.totalStudyMinutes + durationMinutes;
        const badges = [...prev.badges];
        if (nextMinutes >= 50 && !badges.includes('focus_master')) {
          badges.push('focus_master');
        }
        return {
          ...prev,
          totalStudyMinutes: nextMinutes,
          badges,
        };
      });

      // If task was linked, optionally mark it complete or update its subtasks
      if (task) {
        handleUpdateTask({
          ...task,
          completed: true,
          completedAt: new Date().toISOString(),
        });
      }
    } else {
      setStats((prev) => {
        if (!prev.badges.includes('self_care')) {
          return { ...prev, badges: [...prev.badges, 'self_care'] };
        }
        return prev;
      });
    }
  };

  // Sync progress reviewed from uploaded daily planner image
  const handleSyncReviewedProgress = (
    reviewedTasks: { title: string; completed: boolean; priority: Priority }[]
  ) => {
    const todayStr = new Date().toISOString().split('T')[0];

    // Merge or update tasks
    setTasks((prev) => {
      const updated = [...prev];
      reviewedTasks.forEach((rt) => {
        const existingIdx = updated.findIndex(
          (et) => et.title.toLowerCase().trim() === rt.title.toLowerCase().trim()
        );
        if (existingIdx >= 0) {
          updated[existingIdx] = {
            ...updated[existingIdx],
            completed: rt.completed,
            completedAt: rt.completed ? new Date().toISOString() : undefined,
            priority: rt.priority,
          };
        } else {
          // Add newly identified item
          updated.push({
            id: `task-reviewed-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            title: rt.title,
            priority: rt.priority,
            category: 'study',
            estimatedMinutes: 25,
            dueDate: todayStr,
            completed: rt.completed,
            completedAt: rt.completed ? new Date().toISOString() : undefined,
            subtasks: [],
          });
        }
      });
      return updated;
    });

    // Award badge for reviewer champion
    setStats((prev) => {
      if (!prev.badges.includes('review_champ')) {
        return { ...prev, badges: [...prev.badges, 'review_champ'] };
      }
      return prev;
    });
  };

  // Principles banner actions
  const handlePrincipleAction = (
    actionType: 'just_do_it' | 'first_things_first' | 'keep_going' | 'take_care' | 'one_step'
  ) => {
    switch (actionType) {
      case 'just_do_it': {
        const pending = tasks.find((t) => !t.completed);
        if (pending) {
          setSelectedTaskForTimer(pending);
        }
        setActiveTab('timer');
        break;
      }
      case 'first_things_first':
        setActiveTab('tasks');
        break;
      case 'keep_going':
        setActiveTab('analytics');
        break;
      case 'take_care':
        setActiveTab('timer');
        break;
      case 'one_step':
        setActiveTab('goals');
        break;
    }
  };

  // Reload data from local storage (used after backup restore or reset)
  const handleDataRestored = () => {
    setTasks(loadTasks());
    setGoals(loadGoals());
    setStats(loadStats());
    setSettings(loadSettings());
  };

  const navTabs = [
    { id: 'tasks' as const, label: t.tabs.tasks, icon: CheckSquare },
    { id: 'guide' as const, label: t.tabs.guide, icon: BookOpen },
    { id: 'timer' as const, label: t.tabs.timer, icon: Clock },
    { id: 'goals' as const, label: t.tabs.goals, icon: Footprints },
    { id: 'analytics' as const, label: t.tabs.analytics, icon: BarChart2 },
    { id: 'settings' as const, label: t.tabs.settings, icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800 flex flex-col font-sans">
      
      {/* 1. Top Global Header */}
      <Header
        settings={settings}
        stats={stats}
        todayCompletionRate={todayCompletionRate}
        onUpdateSettings={setSettings}
        onOpenQuickAdd={() => setActiveTab('tasks')}
        onOpenTimer={() => setActiveTab('timer')}
        onOpenGuide={() => setActiveTab('guide')}
      />

      {/* 2. Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        {/* Navigation Tabs Bar */}
        <nav aria-label="Main Navigation" className="mb-4 sm:mb-6 border-b border-slate-200/80 pb-1 overflow-x-auto">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-max pb-1">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-white border border-slate-200/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Five Golden Principles from textbook lesson (compact & expandable) */}
        <FivePrinciplesBanner
          language={settings.language}
          onSelectPrincipleAction={handlePrincipleAction}
        />

        {/* Active Tab View */}
        <div>
          {activeTab === 'tasks' && (
            <TaskManagement
              tasks={tasks}
              language={settings.language}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onClearCompleted={handleClearCompletedTasks}
              onClearAllTasks={handleClearAllTasks}
              onStartTimerWithTask={handleStartTimerWithTask}
              onRewardPoints={handleRewardPoints}
            />
          )}

          {activeTab === 'guide' && (
            <UserGuide
              language={settings.language}
              onGoToTasks={() => setActiveTab('tasks')}
              onGoToTimer={() => setActiveTab('timer')}
            />
          )}

          {activeTab === 'timer' && (
            <StudyTimer
              tasks={tasks}
              settings={settings}
              selectedTask={selectedTaskForTimer}
              onSessionComplete={handleSessionComplete}
              onRewardPoints={handleRewardPoints}
            />
          )}

          {activeTab === 'goals' && (
            <GoalsBreakdown
              goals={goals}
              language={settings.language}
              onAddGoal={handleAddGoal}
              onUpdateGoal={handleUpdateGoal}
              onDeleteGoal={handleDeleteGoal}
              onConvertStepsToTasks={handleConvertStepsToTasks}
              onRewardPoints={handleRewardPoints}
            />
          )}

          {activeTab === 'analytics' && (
            <DashboardAnalytics
              tasks={tasks}
              goals={goals}
              stats={stats}
              settings={settings}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsBackupModal
              settings={settings}
              onUpdateSettings={setSettings}
              onDataRestored={handleDataRestored}
            />
          )}
        </div>

      </main>

      {/* 3. Footer with developers and teacher credit */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-extrabold text-slate-900">{t.appName}</span>
              <span>•</span>
              <span className="font-semibold text-indigo-700">
                {settings.language === 'ar' ? 'مشروع مادة اللغة الإنجليزية - منهاج التوجيهي' : 'Tawjihi English Curriculum Project'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {settings.language === 'ar'
                ? 'مستوحى من درس إدارة الوقت وقائمة المهام (To-Do List / Time Management)'
                : 'Inspired by the To-Do List & Time Management textbook lesson'}
            </p>
          </div>

          <div className="text-center md:text-right space-y-1 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
            <p className="font-bold text-slate-800">
              {settings.language === 'ar' 
                ? 'فريق التطوير: وسيم القيمري / أكرم عواد' 
                : 'Developers: Waseem Al-Qaimari & Akram Awwad'}
            </p>
            <p className="text-[11px] text-emerald-700 font-semibold">
              {settings.language === 'ar' 
                ? 'بإشراف معلمة اللغة الإنجليزية: ريناد مرار (Renad Murrar)' 
                : 'Under the supervision of English Teacher: Renad Murrar'}
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
