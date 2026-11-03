import React from 'react';
import { Task, Goal, StudentStats, UserSettings } from '../types';
import { translations } from '../utils/translations';
import { 
  Award, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Target, 
  ShieldCheck, 
  Heart,
  Smile
} from 'lucide-react';

interface DashboardAnalyticsProps {
  tasks: Task[];
  goals: Goal[];
  stats: StudentStats;
  settings: UserSettings;
}

export const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({
  tasks,
  goals,
  stats,
  settings,
}) => {
  const t = translations[settings.language];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const completedGoals = goals.filter((g) => g.completed).length;

  // High priority stats
  const highPriorityTotal = tasks.filter((t) => t.priority === 'high').length;
  const highPriorityDone = tasks.filter((t) => t.priority === 'high' && t.completed).length;

  // Available badges definition
  const badgeKeys = [
    { id: 'first_task', icon: '🚀' },
    { id: 'five_tasks', icon: '⭐' },
    { id: 'high_priority', icon: '🎯' },
    { id: 'goal_crusher', icon: '🏆' },
    { id: 'focus_master', icon: '⏱️' },
    { id: 'planner_pro', icon: '🎨' },
    { id: 'review_champ', icon: '📸' },
    { id: 'self_care', icon: '🌿' },
  ];

  // Random encouraging message
  const encouragingMsg = t.encouragingMessages[
    (stats.completedTasksCount || 0) % t.encouragingMessages.length
  ];

  return (
    <div className="space-y-6">
      
      {/* Motivational Greeting Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 shadow-md border border-indigo-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center shrink-0">
            <Smile className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full">
              {settings.language === 'ar' ? 'رسالة تشجيعية (Keep Going)' : 'Daily Motivation (Keep Going)'}
            </span>
            <h3 className="text-base sm:text-lg font-bold mt-1">
              {encouragingMsg}
            </h3>
            <p className="text-xs text-indigo-200 mt-0.5">
              {settings.language === 'ar' 
                ? 'كل دقيقة تركيز وكل خطوة تنجزها تبني مستقبلك بثقة.' 
                : 'Every focused minute and completed step builds your future with confidence.'}
            </p>
          </div>
        </div>

        {/* Big XP Points Pill */}
        <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 text-center border border-white/15 shrink-0 self-end sm:self-center">
          <div className="flex items-center gap-1.5 text-amber-300 justify-center">
            <Sparkles className="w-4 h-4 fill-amber-300" />
            <span className="text-xs font-bold uppercase">{t.studentPoints}</span>
          </div>
          <span className="text-3xl font-black text-white">{stats.points}</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Today's completion */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">{t.todayCompletion}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{completionRate}%</div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${completionRate}%` }} />
          </div>
        </div>

        {/* Tasks status */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">{t.totalTasksToday}</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{completedTasks} <span className="text-xs text-slate-400 font-normal">/ {totalTasks}</span></div>
          <div className="text-[11px] text-slate-500 mt-2">
            {pendingTasks} {t.remainingTasks}
          </div>
        </div>

        {/* Streak days */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">{t.streakDays}</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.streakDays} <span className="text-xs text-slate-400 font-normal">{settings.language === 'ar' ? 'أيام' : 'days'}</span></div>
          <div className="text-[11px] text-amber-600 font-medium mt-2">
            🔥 Keep Going!
          </div>
        </div>

        {/* Conquered Goals */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">{t.completedGoals}</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{completedGoals} <span className="text-xs text-slate-400 font-normal">/ {goals.length}</span></div>
          <div className="text-[11px] text-purple-600 font-medium mt-2">
            One Step at a Time
          </div>
        </div>

      </div>

      {/* Priority Progress & Weekly Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Priority Focus Breakdown ("First things first") */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-rose-500" />
            <span>{settings.language === 'ar' ? 'تنفيذ الأولويات (First Things First)' : 'Priority Execution (First Things First)'}</span>
          </h3>

          <div className="space-y-3">
            {/* High Priority */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-rose-700">{t.priorityHigh}</span>
                <span className="text-slate-500">{highPriorityDone} / {highPriorityTotal}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-rose-500 h-full rounded-full"
                  style={{ width: `${highPriorityTotal > 0 ? (highPriorityDone / highPriorityTotal) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Medium Priority */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-amber-700">{t.priorityMedium}</span>
                <span className="text-slate-500">
                  {tasks.filter((t) => t.priority === 'medium' && t.completed).length} / {tasks.filter((t) => t.priority === 'medium').length}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{
                    width: `${tasks.filter((t) => t.priority === 'medium').length > 0 ? (tasks.filter((t) => t.priority === 'medium' && t.completed).length / tasks.filter((t) => t.priority === 'medium').length) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            {/* Low Priority */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-blue-700">{t.priorityLow}</span>
                <span className="text-slate-500">
                  {tasks.filter((t) => t.priority === 'low' && t.completed).length} / {tasks.filter((t) => t.priority === 'low').length}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-blue-500 h-full rounded-full"
                  style={{
                    width: `${tasks.filter((t) => t.priority === 'low').length > 0 ? (tasks.filter((t) => t.priority === 'low' && t.completed).length / tasks.filter((t) => t.priority === 'low').length) * 100 : 0}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Progress Bar Chart Simulation */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>{t.weeklySummary}</span>
          </h3>

          <div className="flex items-end justify-between h-40 pt-4 px-2">
            {['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, idx) => {
              // Sample aesthetic curve with today's real score
              const isToday = idx === 3;
              const heightPercent = isToday ? Math.max(completionRate, 20) : (40 + (idx * 9) % 55);

              return (
                <div key={day} className="flex flex-col items-center gap-2 flex-1">
                  <div className="text-[10px] text-slate-400 font-bold">{heightPercent}%</div>
                  <div className="w-6 sm:w-8 bg-slate-100 rounded-t-lg h-28 flex items-end overflow-hidden">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        isToday ? 'bg-indigo-600' : 'bg-slate-300'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className={`text-[10px] font-bold ${isToday ? 'text-indigo-600 font-black' : 'text-slate-400'}`}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Badges Showcase */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span>{t.badgesTitle}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {badgeKeys.map((b) => {
            const badgeMeta = t.badges[b.id as keyof typeof t.badges];
            const isUnlocked = stats.badges?.includes(b.id) || (b.id === 'first_task' && stats.completedTasksCount > 0);

            return (
              <div
                key={b.id}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  isUnlocked
                    ? 'bg-amber-50/60 border-amber-200 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 opacity-50 grayscale'
                }`}
              >
                <div className="text-2xl mb-1">{b.icon}</div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                  {badgeMeta?.name || b.id}
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                  {badgeMeta?.desc || ''}
                </p>
                <span
                  className={`inline-block mt-2 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    isUnlocked ? 'bg-amber-200 text-amber-900' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isUnlocked ? (settings.language === 'ar' ? 'مكتمل' : 'Unlocked') : (settings.language === 'ar' ? 'مغلق' : 'Locked')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
