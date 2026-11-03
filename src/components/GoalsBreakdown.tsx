import React, { useState } from 'react';
import { Goal, GoalStep, Task } from '../types';
import { translations } from '../utils/translations';
import { playCelebrationSound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { 
  Footprints, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Gift, 
  Calendar, 
  Trash2, 
  ArrowRight, 
  Sparkles,
  BookOpen
} from 'lucide-react';

interface GoalsBreakdownProps {
  goals: Goal[];
  language: 'ar' | 'en';
  onAddGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'completed'>) => void;
  onUpdateGoal: (goal: Goal) => void;
  onDeleteGoal: (id: string) => void;
  onConvertStepsToTasks: (tasks: Omit<Task, 'id' | 'completed'>[]) => void;
  onRewardPoints: (points: number, reason: string) => void;
}

export const GoalsBreakdown: React.FC<GoalsBreakdownProps> = ({
  goals,
  language,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
  onConvertStepsToTasks,
  onRewardPoints,
}) => {
  const t = translations[language];

  // Modal / Add Goal state
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newTargetDate, setNewTargetDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [newReward, setNewReward] = useState('');
  const [stepInputs, setStepInputs] = useState<string[]>([
    language === 'ar' ? 'قراءة شرح الدرس وتحديد المفاهيم' : 'Read chapter summary & key terms',
    language === 'ar' ? 'فهم الأمثلة المحلولة خطوة بخطوة' : 'Understand worked examples step by step',
    language === 'ar' ? 'حل أسئلة وتدريبات الكتاب' : 'Solve textbook exercises',
    language === 'ar' ? 'مراجعة الأخطاء وتثبيت القوانين' : 'Review mistakes & formulas',
  ]);

  const handleStepInputChange = (index: number, val: string) => {
    const updated = [...stepInputs];
    updated[index] = val;
    setStepInputs(updated);
  };

  const handleAddStepInputRow = () => {
    setStepInputs((prev) => [...prev, '']);
  };

  const handleRemoveStepInputRow = (index: number) => {
    if (stepInputs.length <= 1) return;
    setStepInputs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const filteredSteps: GoalStep[] = stepInputs
      .filter((s) => s.trim().length > 0)
      .map((s, idx) => ({
        id: `step-${Date.now()}-${idx}`,
        title: s.trim(),
        completed: false,
      }));

    onAddGoal({
      title: newTitle.trim(),
      subject: newSubject.trim() || (language === 'ar' ? 'دراسة عامة' : 'General Study'),
      targetDate: newTargetDate,
      reward: newReward.trim() || undefined,
      steps: filteredSteps,
    });

    // Reset
    setNewTitle('');
    setNewSubject('');
    setNewReward('');
    setIsAddingGoal(false);
    onRewardPoints(15, 'Created a structured goal (One Step at a Time)');
  };

  // Toggle step complete
  const handleToggleStep = (goal: Goal, stepId: string) => {
    const updatedSteps = goal.steps.map((st) =>
      st.id === stepId ? { ...st, completed: !st.completed } : st
    );

    const allStepsCompleted = updatedSteps.length > 0 && updatedSteps.every((s) => s.completed);
    const updatedGoal: Goal = {
      ...goal,
      steps: updatedSteps,
      completed: allStepsCompleted,
    };

    onUpdateGoal(updatedGoal);

    if (allStepsCompleted && !goal.completed) {
      playCelebrationSound();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      onRewardPoints(100, `Completed whole goal: ${goal.title}`);
    } else {
      onRewardPoints(10, 'Completed goal step');
    }
  };

  // Convert uncompleted steps into daily tasks
  const handleConvertGoalSteps = (goal: Goal) => {
    const pendingSteps = goal.steps.filter((s) => !s.completed);
    if (pendingSteps.length === 0) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const newTasks: Omit<Task, 'id' | 'completed'>[] = pendingSteps.map((step) => ({
      title: `${goal.subject ? `[${goal.subject}] ` : ''}${step.title}`,
      subject: goal.subject,
      priority: 'high',
      category: 'study',
      estimatedMinutes: 25,
      dueDate: todayStr,
      notes: `${language === 'ar' ? 'خطوة مستخرجة من الهدف:' : 'Extracted from goal:'} ${goal.title}`,
      subtasks: [],
    }));

    onConvertStepsToTasks(newTasks);
    playCelebrationSound();
    setSuccessToast(t.convertedSuccess);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner explaining One Step at a Time */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-purple-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/30 border border-purple-400/40 flex items-center justify-center text-purple-200 shrink-0">
            <Footprints className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
              {t.goalsSectionTitle}
            </h2>
            <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-2xl leading-relaxed">
              {t.goalsSectionDesc}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddingGoal(true)}
          className="self-start md:self-center px-4 py-2.5 bg-purple-500 hover:bg-purple-600 active:scale-95 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addNewGoal}</span>
        </button>
      </div>

      {/* Add Goal Modal / Inline Form */}
      {isAddingGoal && (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-purple-100 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <span>{t.addNewGoal}</span>
            </h3>
            <button
              onClick={() => setIsAddingGoal(false)}
              className="text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSaveGoal} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.goalTitle} *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={t.goalTitlePlaceholder}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.subject}
                </label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder={t.subjectPlaceholder}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.targetDate}
                </label>
                <input
                  type="date"
                  value={newTargetDate}
                  onChange={(e) => setNewTargetDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5 text-pink-500" />
                  <span>{t.reward}</span>
                </label>
                <input
                  type="text"
                  value={newReward}
                  onChange={(e) => setNewReward(e.target.value)}
                  placeholder={t.rewardPlaceholder}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            {/* Step by step inputs */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                {t.stepsList}
              </label>

              {stepInputs.map((stepVal, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={stepVal}
                    onChange={(e) => handleStepInputChange(idx, e.target.value)}
                    placeholder={t.stepPlaceholder}
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-purple-500"
                  />
                  {stepInputs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStepInputRow(idx)}
                      className="text-slate-400 hover:text-rose-500 px-2 py-1 font-bold text-sm"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddStepInputRow}
                className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1 pt-1"
              >
                + {t.addStepBtn}
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddingGoal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs"
              >
                {language === 'ar' ? 'حفظ الهدف' : 'Save Goal'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Goals Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-10 text-center border border-dashed border-slate-300">
            <Footprints className="w-10 h-10 text-purple-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800 mb-1">{t.noGoalsYet}</h3>
            <button
              onClick={() => setIsAddingGoal(true)}
              className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold hover:bg-purple-700"
            >
              + {t.addNewGoal}
            </button>
          </div>
        ) : (
          goals.map((goal) => {
            const completedCount = goal.steps.filter((s) => s.completed).length;
            const progress = goal.steps.length > 0
              ? Math.round((completedCount / goal.steps.length) * 100)
              : 0;

            return (
              <div
                key={goal.id}
                className={`bg-white rounded-3xl p-5 border transition-all ${
                  goal.completed
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-slate-200/90 hover:border-purple-200 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                      {goal.subject}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {goal.title}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onDeleteGoal(goal.id);
                      setSuccessToast(language === 'ar' ? 'تم حذف الهدف بنجاح' : 'Goal deleted successfully');
                      setTimeout(() => setSuccessToast(null), 3000);
                    }}
                    className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-xl transition-all"
                    title={language === 'ar' ? 'حذف الهدف' : 'Delete goal'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="my-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-600">
                      {completedCount} / {goal.steps.length} {language === 'ar' ? 'خطوات منجزة' : 'steps completed'}
                    </span>
                    <span className="font-bold text-purple-700">{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        goal.completed ? 'bg-emerald-500' : 'bg-gradient-to-r from-purple-500 to-indigo-600'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Steps Checklist */}
                <div className="space-y-1.5 my-3">
                  {goal.steps.map((st, idx) => (
                    <div
                      key={st.id}
                      onClick={() => handleToggleStep(goal, st.id)}
                      className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                        st.completed
                          ? 'bg-slate-50 border-slate-200/60 line-through text-slate-400'
                          : 'bg-white border-slate-200/80 hover:border-purple-300 text-slate-800'
                      }`}
                    >
                      {st.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <span className="font-bold text-[10px] text-slate-400">{idx + 1}.</span>
                      <span className="flex-1">{st.title}</span>
                    </div>
                  ))}
                </div>

                {/* Reward pill if specified */}
                {goal.reward && (
                  <div className="flex items-center gap-2 p-2 bg-pink-50 border border-pink-200/60 rounded-xl text-xs text-pink-800 mb-3">
                    <Gift className="w-4 h-4 text-pink-600 shrink-0" />
                    <span className="truncate">
                      <strong>{language === 'ar' ? 'مكافأتي عند الإنجاز:' : 'My Reward:'}</strong> {goal.reward}
                    </span>
                  </div>
                )}

                {/* Footer buttons */}
                {!goal.completed && (
                  <button
                    onClick={() => handleConvertGoalSteps(goal)}
                    className="w-full py-2 px-3 bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>{t.convertStepsToTasks}</span>
                  </button>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
