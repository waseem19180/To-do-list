import React, { useState, useMemo } from 'react';
import { Task, Priority, TaskCategory, SubTask } from '../types';
import { translations } from '../utils/translations';
import { playCelebrationSound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Clock, 
  Trash2, 
  Edit3, 
  ArrowRightCircle, 
  ListOrdered, 
  Search, 
  Play, 
  Sparkles,
  Gift,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';

interface TaskManagementProps {
  tasks: Task[];
  language: 'ar' | 'en';
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onClearCompleted?: () => void;
  onClearAllTasks?: () => void;
  onStartTimerWithTask: (task: Task) => void;
  onRewardPoints: (points: number, reason: string) => void;
}

export const TaskManagement: React.FC<TaskManagementProps> = ({
  tasks,
  language,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onClearCompleted,
  onClearAllTasks,
  onStartTimerWithTask,
  onRewardPoints,
}) => {
  const t = translations[language];

  // Quick add form state
  const [quickTitle, setQuickTitle] = useState('');
  const [quickPriority, setQuickPriority] = useState<Priority>('high');
  const [quickMinutes, setQuickMinutes] = useState(25);
  const [isExpandingSteps, setIsExpandingSteps] = useState(false);
  const [subtaskInputs, setSubtaskInputs] = useState<string[]>(['']);
  const [taskReward, setTaskReward] = useState('');

  // Toast feedback & trash modal state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmTrashModal, setConfirmTrashModal] = useState<'completed' | 'all' | null>(null);

  // Filtering
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Editing state
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Subtask accordion states
  const [expandedSubtasks, setExpandedSubtasks] = useState<Record<string, boolean>>({});

  const toggleSubtasks = (taskId: string) => {
    setExpandedSubtasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const handleAddSubtaskInputRow = () => {
    setSubtaskInputs((prev) => [...prev, '']);
  };

  const handleSubtaskInputChange = (index: number, val: string) => {
    const updated = [...subtaskInputs];
    updated[index] = val;
    setSubtaskInputs(updated);
  };

  const handleRemoveSubtaskInputRow = (index: number) => {
    if (subtaskInputs.length <= 1) return;
    setSubtaskInputs((prev) => prev.filter((_, i) => i !== index));
  };

  // Create Task
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    const todayStr = new Date().toISOString().split('T')[0];

    const validSubtasks: SubTask[] = subtaskInputs
      .filter((s) => s.trim().length > 0)
      .map((s, idx) => ({
        id: `sub-${Date.now()}-${idx}`,
        title: s.trim(),
        completed: false,
      }));

    onAddTask({
      title: quickTitle.trim(),
      priority: quickPriority,
      category: 'study',
      estimatedMinutes: Number(quickMinutes) || 25,
      dueDate: todayStr,
      notes: taskReward.trim() 
        ? `${language === 'ar' ? 'المكافأة (Tip 5):' : 'Reward (Tip 5):'} ${taskReward.trim()}` 
        : undefined,
      subtasks: validSubtasks,
    });

    // Reset
    setQuickTitle('');
    setQuickPriority('high');
    setQuickMinutes(25);
    setIsExpandingSteps(false);
    setSubtaskInputs(['']);
    setTaskReward('');
  };

  // Toggle complete
  const handleToggleComplete = (task: Task) => {
    const nextCompleted = !task.completed;
    onUpdateTask({
      ...task,
      completed: nextCompleted,
      completedAt: nextCompleted ? new Date().toISOString() : undefined,
    });

    if (nextCompleted) {
      playCelebrationSound();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      const pts = task.priority === 'high' ? 30 : task.priority === 'medium' ? 20 : 10;
      onRewardPoints(pts, `Completed: ${task.title}`);
    }
  };

  // Toggle subtask step
  const handleToggleSubtask = (task: Task, subId: string) => {
    const updated = task.subtasks.map((s) =>
      s.id === subId ? { ...s, completed: !s.completed } : s
    );
    const allDone = updated.length > 0 && updated.every((s) => s.completed);

    onUpdateTask({
      ...task,
      subtasks: updated,
      completed: allDone ? true : task.completed,
      completedAt: allDone && !task.completed ? new Date().toISOString() : task.completedAt,
    });

    if (allDone && !task.completed) {
      playCelebrationSound();
      confetti({ particleCount: 40, spread: 50 });
      onRewardPoints(20, 'Completed all subtask steps (Tip 5)');
    } else {
      onRewardPoints(5, 'Completed micro-step');
    }
  };

  // Delete task with immediate toast feedback
  const handlePerformDeleteTask = (taskId: string) => {
    onDeleteTask(taskId);
    setToastMessage(language === 'ar' ? 'تم حذف المهمة بنجاح 🗑️' : 'Task deleted successfully 🗑️');
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Delete subtask step
  const handleDeleteSubtask = (task: Task, subId: string) => {
    const updated = task.subtasks.filter((s) => s.id !== subId);
    onUpdateTask({
      ...task,
      subtasks: updated,
    });
    setToastMessage(language === 'ar' ? 'تم حذف الخطوة 🗑️' : 'Micro-step removed 🗑️');
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Move to tomorrow
  const handleMoveToTomorrow = (task: Task) => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    onUpdateTask({
      ...task,
      dueDate: d.toISOString().split('T')[0],
    });
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        if (filterMode === 'pending' && t.completed) return false;
        if (filterMode === 'completed' && !t.completed) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return t.title.toLowerCase().includes(q) || t.notes?.toLowerCase().includes(q);
        }
        return true;
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        const weights = { high: 3, medium: 2, low: 1 };
        return weights[b.priority] - weights[a.priority];
      });
  }, [tasks, filterMode, searchQuery]);

  // First Things First top priority task
  const topPriorityTask = useMemo(() => {
    return tasks.find((t) => !t.completed && t.priority === 'high') || null;
  }, [tasks]);

  return (
    <div className="space-y-6">
      
      {/* 1. Quick Task Adder (Easiest, most direct entry point) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/90 space-y-4">
        
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-600 animate-pulse" />
            <span>{language === 'ar' ? 'المهام المطلوبة (قائمة المهام اليومية)' : 'Required Tasks (Daily To-Do List)'}</span>
          </h2>
          <span className="text-xs text-slate-400">
            {tasks.length} {language === 'ar' ? 'مهام مسجلة' : 'tasks recorded'}
          </span>
        </div>

        <form onSubmit={handleCreateTask} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              required
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              placeholder={language === 'ar' ? 'اكتب مهمتك المطلوبة هنا... (مثال: مراجعة درس التفاضل ص 52)' : 'Type your task here... (e.g. Study Physics Chapter 3)'}
              className="flex-1 px-4 py-3 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
            />

            {/* Simple Priority Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setQuickPriority('high')}
                className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                  quickPriority === 'high'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={t.priorityHigh}
              >
                🔴 {language === 'ar' ? 'عالية' : 'High'}
              </button>

              <button
                type="button"
                onClick={() => setQuickPriority('medium')}
                className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                  quickPriority === 'medium'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={t.priorityMedium}
              >
                🟡 {language === 'ar' ? 'متوسطة' : 'Med'}
              </button>

              <button
                type="button"
                onClick={() => setQuickPriority('low')}
                className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                  quickPriority === 'low'
                    ? 'bg-blue-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={t.priorityLow}
              >
                🔵 {language === 'ar' ? 'منخفضة' : 'Low'}
              </button>
            </div>

            {/* Estimated time */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-3 py-2 rounded-2xl shrink-0">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="number"
                min="5"
                max="180"
                step="5"
                value={quickMinutes}
                onChange={(e) => setQuickMinutes(Number(e.target.value))}
                className="w-12 text-xs font-bold text-slate-700 bg-transparent focus:outline-hidden"
              />
              <span className="text-[11px] text-slate-400 font-medium">{t.minutes}</span>
            </div>

            {/* Add Task Button */}
            <button
              type="submit"
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm rounded-2xl shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addTaskBtn}</span>
            </button>
          </div>

          {/* Tip 5 Toggle: Divide large tasks into smaller parts & reward yourself */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setIsExpandingSteps(!isExpandingSteps)}
              className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>
                {isExpandingSteps
                  ? (language === 'ar' ? 'إغلاق تقسيم الخطوات والمكافأة ▲' : 'Close Step Division ▲')
                  : (language === 'ar' ? '+ تقسيم المهمة لأجزاء أصغر وتحديد مكافأة (Tip 5) ▼' : '+ Divide into smaller parts & set a reward (Tip 5) ▼')}
              </span>
            </button>
            <span className="text-[11px] text-slate-400">
              {language === 'ar' ? 'أضف مهمتك واضغط إضافة' : 'Fill details & press Add'}
            </span>
          </div>

          {/* Tip 5 Expansion */}
          {isExpandingSteps && (
            <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200/80 space-y-3">
              <div>
                <label className="block text-xs font-bold text-purple-950 mb-1">
                  {language === 'ar' ? 'الخطوات الصغيرة (Divide large tasks into smaller parts):' : 'Micro-steps (Divide large tasks):'}
                </label>
                <div className="space-y-1.5">
                  {subtaskInputs.map((stepVal, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={stepVal}
                        onChange={(e) => handleSubtaskInputChange(idx, e.target.value)}
                        placeholder={language === 'ar' ? `الخطوة ${idx + 1} (مثال: قراءة الشرح وحل مثالين)` : `Step ${idx + 1}`}
                        className="flex-1 px-3 py-1.5 bg-white border border-purple-200 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-purple-500"
                      />
                      {subtaskInputs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSubtaskInputRow(idx)}
                          className="text-slate-400 hover:text-rose-500 px-1 font-bold text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddSubtaskInputRow}
                    className="text-xs font-semibold text-purple-700 hover:text-purple-900 pt-1"
                  >
                    + {language === 'ar' ? 'إضافة خطوة أخرى' : 'Add another step'}
                  </button>
                </div>
              </div>

              {/* Reward yourself */}
              <div>
                <label className="block text-xs font-bold text-purple-950 mb-1 flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5 text-pink-600" />
                  <span>{language === 'ar' ? 'مكافأتي عند إكمال هذه المهمة (Reward yourself by doing something fun):' : 'My reward upon completion (Fun treat):'}</span>
                </label>
                <input
                  type="text"
                  value={taskReward}
                  onChange={(e) => setTaskReward(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: مشاهدة مقطع مفضل، أو تناول وجبة خفيفة محببة' : 'e.g. 15 min video, favorite snack, gaming'}
                  className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
          )}

        </form>
      </div>

      {/* 2. "First Things First" Highlight Card (If high priority tasks exist) */}
      {topPriorityTask && (
        <div className="bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200/90 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-200/60 px-2 py-0.5 rounded-full">
                  Tip 2: First Things First
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {topPriorityTask.estimatedMinutes} {t.minutes}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                {topPriorityTask.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              onClick={() => onStartTimerWithTask(topPriorityTask)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{language === 'ar' ? 'ابدأ الآن (Just Do It)' : 'Start Now (Just Do It)'}</span>
            </button>

            <button
              onClick={() => handleToggleComplete(topPriorityTask)}
              className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
            >
              ✓ {language === 'ar' ? 'تم' : 'Done'}
            </button>
          </div>
        </div>
      )}

      {/* 3. Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchTasks}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filter & Trash Action buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterMode === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {t.filterAll} ({tasks.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterMode === 'pending'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {t.filterPending} ({tasks.filter((t) => !t.completed).length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterMode === 'completed'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {t.filterCompleted} ({tasks.filter((t) => t.completed).length})
          </button>

          {/* سلة المهملات: تنظيف المهام المكتملة */}
          {tasks.some((t) => t.completed) && onClearCompleted && (
            <button
              type="button"
              onClick={() => setConfirmTrashModal('completed')}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 transition-all flex items-center gap-1"
              title={language === 'ar' ? 'تفريغ سلة المهام المكتملة' : 'Clear completed tasks'}
            >
              <Trash2 className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === 'ar' ? 'سلة المهملات (تنظيف المكتملة)' : 'Trash (Completed)'}</span>
            </button>
          )}

          {/* مسح جميع المهام */}
          {tasks.length > 0 && onClearAllTasks && (
            <button
              type="button"
              onClick={() => setConfirmTrashModal('all')}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200/80 transition-all flex items-center gap-1"
              title={language === 'ar' ? 'مسح جميع المهام' : 'Clear all tasks'}
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>{language === 'ar' ? 'مسح الكل' : 'Clear All'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-lg border border-slate-800 text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* In-app Confirmation Modal for Trash Actions (No window.confirm!) */}
      {confirmTrashModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="font-bold text-base text-slate-900">
                {confirmTrashModal === 'completed'
                  ? (language === 'ar' ? 'تفريغ سلة المهام المكتملة؟' : 'Clear all completed tasks?')
                  : (language === 'ar' ? 'مسح جميع المهام من القائمة؟' : 'Clear all tasks from list?')}
              </h4>
              <p className="text-xs text-slate-500">
                {language === 'ar' 
                  ? 'هل أنت متأكد من تنفيذ هذا الإجراء؟ لا يمكن التراجع عن الحذف.' 
                  : 'Are you sure? This action cannot be undone.'}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmTrashModal(null)}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirmTrashModal === 'completed') {
                    onClearCompleted?.();
                    setToastMessage(language === 'ar' ? 'تم تنظيف المهام المكتملة بنجاح 🗑️' : 'Completed tasks cleared 🗑️');
                  } else {
                    onClearAllTasks?.();
                    setToastMessage(language === 'ar' ? 'تم مسح جميع المهام بنجاح 🗑️' : 'All tasks cleared 🗑️');
                  }
                  setConfirmTrashModal(null);
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
              >
                {language === 'ar' ? 'نعم، احذف' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. The Tasks List (المهام المطلوبة) */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-slate-200">
            <div className="w-14 h-14 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              {language === 'ar' ? 'لا توجد مهام مسجلة حالياً' : 'No tasks scheduled yet'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {language === 'ar'
                ? 'ابدأ بكتابة أول مهمة دراسية في الخانة أعلاه واضغط (إضافة مهمة) للبدء فوراً (Just Do It)!'
                : 'Start by typing your first study task in the box above and click Add Task (Just Do It)!'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task, idx) => {
            const hasSubtasks = task.subtasks && task.subtasks.length > 0;
            const completedSteps = task.subtasks?.filter((s) => s.completed).length || 0;
            const isSubExpanded = !!expandedSubtasks[task.id];

            const priorityBadge = {
              high: 'bg-rose-100 text-rose-800 border-rose-300 font-bold',
              medium: 'bg-amber-100 text-amber-800 border-amber-300 font-bold',
              low: 'bg-blue-100 text-blue-800 border-blue-300 font-bold',
            }[task.priority];

            return (
              <div
                key={task.id}
                className={`bg-white rounded-3xl border transition-all ${
                  task.completed
                    ? 'border-emerald-200 bg-emerald-50/20 opacity-80'
                    : task.priority === 'high'
                    ? 'border-rose-200 shadow-xs'
                    : 'border-slate-200/90 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
                  
                  {/* Left: Checkmark & Content */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => handleToggleComplete(task)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                      title={task.completed ? 'Mark incomplete' : 'Mark completed'}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-6 h-6 hover:border-emerald-500" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${priorityBadge}`}>
                          {task.priority === 'high' && '🔴 High'}
                          {task.priority === 'medium' && '🟡 Med'}
                          {task.priority === 'low' && '🔵 Low'}
                        </span>

                        <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {task.estimatedMinutes} {t.minutes}
                        </span>

                        {hasSubtasks && (
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                            {completedSteps}/{task.subtasks.length} {language === 'ar' ? 'خطوات' : 'steps'}
                          </span>
                        )}
                      </div>

                      <h4 className={`text-sm sm:text-base font-bold transition-all ${
                        task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}>
                        {task.title}
                      </h4>

                      {task.notes && (
                        <p className="text-xs text-purple-800 font-medium mt-1">
                          🎁 {task.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    
                    {/* Timer */}
                    {!task.completed && (
                      <button
                        onClick={() => onStartTimerWithTask(task)}
                        className="p-2 sm:px-2.5 sm:py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all flex items-center gap-1"
                        title={t.startStudySession}
                      >
                        <Play className="w-3.5 h-3.5 fill-indigo-600" />
                        <span className="hidden sm:inline">{language === 'ar' ? 'بدء المؤقت' : 'Timer'}</span>
                      </button>
                    )}

                    {/* Move to tomorrow */}
                    {!task.completed && (
                      <button
                        onClick={() => handleMoveToTomorrow(task)}
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
                        title={t.moveToTomorrow}
                      >
                        <ArrowRightCircle className="w-4 h-4" />
                      </button>
                    )}

                    {/* Subtasks expander */}
                    {hasSubtasks && (
                      <button
                        onClick={() => toggleSubtasks(task.id)}
                        className="p-2 text-purple-700 hover:bg-purple-50 rounded-xl transition-all"
                        title="Subtasks"
                      >
                        <ListOrdered className="w-4 h-4" />
                      </button>
                    )}

                    {/* Delete Task (سلة المهملات) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePerformDeleteTask(task.id);
                      }}
                      className="p-2 text-rose-400 hover:text-rose-700 hover:bg-rose-50 active:scale-90 rounded-xl transition-all"
                      title={language === 'ar' ? 'حذف المهمة (سلة المهملات)' : 'Delete task'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>

                {/* Subtasks drawer */}
                {isSubExpanded && hasSubtasks && (
                  <div className="bg-slate-50/90 border-t border-slate-100 p-4 rounded-b-3xl space-y-2">
                    <div className="text-xs font-bold text-slate-700">
                      {language === 'ar' ? 'الخطوات الصغيرة (Tip 5: One step at a time):' : 'Micro-steps:'}
                    </div>
                    {task.subtasks.map((st) => (
                      <div
                        key={st.id}
                        className="flex items-center justify-between gap-2 p-2 bg-white rounded-xl border border-slate-200 text-xs"
                      >
                        <div
                          onClick={() => handleToggleSubtask(task, st.id)}
                          className="flex items-center gap-2 flex-1 cursor-pointer min-w-0"
                        >
                          {st.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <span className={`truncate ${st.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {st.title}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteSubtask(task, st.id);
                          }}
                          className="text-slate-300 hover:text-rose-500 p-1 rounded-lg transition-colors"
                          title={language === 'ar' ? 'حذف هذه الخطوة' : 'Delete micro-step'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
