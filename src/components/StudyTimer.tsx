import React, { useState, useEffect, useRef } from 'react';
import { Task, UserSettings } from '../types';
import { translations } from '../utils/translations';
import { playTimerDoneSound, playCelebrationSound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Heart, 
  Coffee, 
  BookOpen, 
  CheckCircle2, 
  Settings2,
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';

interface StudyTimerProps {
  tasks: Task[];
  settings: UserSettings;
  selectedTask?: Task | null;
  onSessionComplete: (durationMinutes: number, type: 'study' | 'break', task?: Task) => void;
  onRewardPoints: (points: number, reason: string) => void;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({
  tasks,
  settings,
  selectedTask,
  onSessionComplete,
  onRewardPoints,
}) => {
  const t = translations[settings.language];

  const [mode, setMode] = useState<'study' | 'break'>('study');
  const [studyDuration, setStudyDuration] = useState(settings.defaultStudyDuration || 25);
  const [breakDuration, setBreakDuration] = useState(settings.defaultBreakDuration || 5);
  const [timeLeft, setTimeLeft] = useState(studyDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(selectedTask || null);
  const [showSettings, setShowSettings] = useState(false);
  const [randomTipIndex, setRandomTipIndex] = useState(0);
  const [finishedMessage, setFinishedMessage] = useState<string | null>(null);

  // Sync when selectedTask prop changes
  useEffect(() => {
    if (selectedTask) {
      setCurrentTask(selectedTask);
    }
  }, [selectedTask]);

  // Sync timer when durations change if not running
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft((mode === 'study' ? studyDuration : breakDuration) * 60);
    }
  }, [studyDuration, breakDuration, mode, isRunning]);

  // Timer interval tick
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Completed!
      handleTimerFinished();
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft]);

  const handleTimerFinished = () => {
    setIsRunning(false);
    playTimerDoneSound(mode);

    if (mode === 'study') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
      onRewardPoints(studyDuration, `Completed ${studyDuration} min study block`);
      onSessionComplete(studyDuration, 'study', currentTask || undefined);
      setFinishedMessage(t.sessionFinished);
      // Switch automatically to break mode
      setMode('break');
      setTimeLeft(breakDuration * 60);
      setRandomTipIndex(Math.floor(Math.random() * t.selfCareTips.length));
    } else {
      onRewardPoints(5, 'Completed self-care rest break');
      onSessionComplete(breakDuration, 'break');
      setFinishedMessage(t.breakFinished);
      // Switch back to study mode
      setMode('study');
      setTimeLeft(studyDuration * 60);
    }
    setTimeout(() => setFinishedMessage(null), 5000);
  };

  const handleTogglePlay = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft((mode === 'study' ? studyDuration : breakDuration) * 60);
  };

  const handleSwitchMode = (newMode: 'study' | 'break') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft((newMode === 'study' ? studyDuration : breakDuration) * 60);
    if (newMode === 'break') {
      setRandomTipIndex(Math.floor(Math.random() * t.selfCareTips.length));
    }
  };

  // Format mm:ss
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalTime = (mode === 'study' ? studyDuration : breakDuration) * 60;
  const progressPercent = Math.round(((totalTime - timeLeft) / totalTime) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Timer Card */}
      <div className={`rounded-3xl p-6 sm:p-10 border transition-all duration-300 text-center relative overflow-hidden shadow-lg ${
        mode === 'study'
          ? 'bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-950 text-white border-indigo-800'
          : 'bg-gradient-to-b from-teal-950 via-slate-900 to-teal-950 text-white border-teal-800'
      }`}>
        
        {/* Glow ambient circle */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
          mode === 'study' ? 'bg-indigo-600/20' : 'bg-teal-500/20'
        }`} />

        {/* In-app Completion Banner (No alert!) */}
        {finishedMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 relative z-20 animate-in bounce-in duration-300">
            <span>🎉</span>
            <span>{finishedMessage}</span>
          </div>
        )}

        {/* Mode Switcher Tabs */}
        <div className="inline-flex p-1 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/10 mb-8 relative z-10">
          <button
            onClick={() => handleSwitchMode('study')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              mode === 'study'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t.studyMode}</span>
          </button>

          <button
            onClick={() => handleSwitchMode('break')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              mode === 'break'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>{t.breakMode}</span>
          </button>
        </div>

        {/* Selected Task pill */}
        <div className="mb-6 relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 text-xs text-slate-200">
            <span className="text-slate-400 font-medium">{t.linkToTask}</span>
            <select
              value={currentTask ? currentTask.id : ''}
              onChange={(e) => {
                const found = tasks.find((t) => t.id === e.target.value);
                setCurrentTask(found || null);
              }}
              aria-label={t.linkToTask}
              className="bg-transparent text-white font-bold focus:outline-hidden cursor-pointer"
            >
              <option value="" className="text-slate-900">{t.noTaskLinked}</option>
              {tasks.filter((t) => !t.completed).map((t) => (
                <option key={t.id} value={t.id} className="text-slate-900">
                  {t.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Large Digital Clock Display */}
        <div className="relative z-10 my-4">
          <div className="text-6xl sm:text-8xl font-black tracking-tight font-mono drop-shadow-md">
            {formattedTime}
          </div>

          <p className="text-xs sm:text-sm font-medium mt-3 text-slate-300">
            {mode === 'study'
              ? (settings.language === 'ar' ? 'جلسة دراسة مركزة (Just Do It)' : 'Focused Study Session (Just Do It)')
              : (settings.language === 'ar' ? 'استراحة مستحقة (Take Care of Yourself)' : 'Mindful Refresh Break (Take Care of Yourself)')}
          </p>

          {/* Progress bar */}
          <div className="max-w-xs mx-auto mt-4 w-full bg-white/15 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                mode === 'study' ? 'bg-indigo-400' : 'bg-teal-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center justify-center gap-4 mt-8 relative z-10">
          <button
            onClick={handleReset}
            className="p-3 bg-white/10 hover:bg-white/20 active:scale-90 text-white rounded-2xl transition-all border border-white/10"
            title={t.resetTimer}
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handleTogglePlay}
            className={`px-8 py-4 rounded-2xl font-black text-base sm:text-lg shadow-xl active:scale-95 transition-all flex items-center gap-2 ${
              mode === 'study'
                ? 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-indigo-600/30'
                : 'bg-teal-500 hover:bg-teal-600 text-white shadow-teal-600/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-white" />
                <span>{t.pauseTimer}</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" />
                <span>{t.startTimer}</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 bg-white/10 hover:bg-white/20 active:scale-90 text-white rounded-2xl transition-all border border-white/10"
            title="Timer Settings"
          >
            <Settings2 className="w-5 h-5" />
          </button>
        </div>

        {/* Break Tip Alert */}
        {mode === 'break' && (
          <div className="mt-8 p-4 bg-teal-900/50 rounded-2xl border border-teal-500/30 text-teal-200 text-xs sm:text-sm font-medium relative z-10 flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{t.selfCareTips[randomTipIndex] || t.selfCareTips[0]}</span>
          </div>
        )}

        {/* Inline Duration Settings */}
        {showSettings && (
          <div className="mt-8 pt-6 border-t border-white/15 relative z-10 grid grid-cols-2 gap-4 max-w-sm mx-auto text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.studyTimeSetting}
              </label>
              <input
                type="number"
                min="5"
                max="90"
                step="5"
                value={studyDuration}
                disabled={isRunning}
                onChange={(e) => setStudyDuration(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-xs focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.breakTimeSetting}
              </label>
              <input
                type="number"
                min="1"
                max="30"
                step="1"
                value={breakDuration}
                disabled={isRunning}
                onChange={(e) => setBreakDuration(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-xs focus:outline-hidden"
              />
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
