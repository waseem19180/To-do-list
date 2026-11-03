import React, { useState } from 'react';
import { translations } from '../utils/translations';
import { StudentStats, UserSettings } from '../types';
import { 
  Sparkles, 
  Flame, 
  Award, 
  Globe, 
  Plus, 
  User, 
  CheckCircle2, 
  Clock
} from 'lucide-react';

interface HeaderProps {
  settings: UserSettings;
  stats: StudentStats;
  todayCompletionRate: number;
  onUpdateSettings: (settings: UserSettings) => void;
  onOpenQuickAdd: () => void;
  onOpenTimer: () => void;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  stats,
  todayCompletionRate,
  onUpdateSettings,
  onOpenQuickAdd,
  onOpenTimer,
  onOpenGuide,
}) => {
  const t = translations[settings.language];
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(settings.studentName);

  const toggleLanguage = () => {
    const nextLang = settings.language === 'ar' ? 'en' : 'ar';
    onUpdateSettings({ ...settings, language: nextLang });
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = nextLang;
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({ ...settings, studentName: nameInput.trim() });
    setIsEditingName(false);
  };

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      {/* Top micro-bar with developers & teacher accreditation */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white text-[11px] py-1 px-4 text-center font-medium flex items-center justify-center gap-2 flex-wrap">
        <span className="text-amber-300 font-bold">
          {settings.language === 'ar' ? 'مشروع إنجليزي التوجيهي (To-Do List)' : 'Tawjihi English Project (To-Do List)'}
        </span>
        <span className="text-slate-400">•</span>
        <span>
          {settings.language === 'ar' ? 'إعداد: وسيم القيمري / أكرم عواد' : 'Dev: Waseem Al-Qaimari & Akram Awwad'}
        </span>
        <span className="text-slate-400">•</span>
        <span className="text-emerald-300 font-semibold">
          {settings.language === 'ar' ? 'بإشراف المعلمة: ريناد مرار' : 'Supervised by: Teacher Renad Murrar'}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Logo & Student greeting */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-100 shrink-0">
              <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate">
                  {t.appName}
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {settings.language === 'ar' ? 'إنجليزي توجيهي' : 'Tawjihi Focus'}
                </span>
              </div>

              {/* Student Greeting */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                {isEditingName ? (
                  <form onSubmit={handleSaveName} className="flex items-center gap-1">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder={settings.language === 'ar' ? 'اسمك' : 'Your name'}
                      className="px-2 py-0.5 text-xs border border-indigo-300 rounded focus:outline-hidden focus:ring-1 focus:ring-indigo-500 w-28"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="text-indigo-600 hover:text-indigo-800 font-semibold px-1"
                    >
                      ✓
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingName(false)}
                      className="text-slate-400 hover:text-slate-600 px-1"
                    >
                      ✕
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => {
                      setNameInput(settings.studentName);
                      setIsEditingName(true);
                    }}
                    className="flex items-center gap-1 hover:text-indigo-600 transition-colors text-left truncate"
                    title={settings.language === 'ar' ? 'اضغط لتعديل اسم الطالب' : 'Click to edit student name'}
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {settings.studentName
                        ? (settings.language === 'ar' ? `مرحباً، ${settings.studentName}` : `Hello, ${settings.studentName}`)
                        : (settings.language === 'ar' ? '+ أضف اسم الطالب' : '+ Add your name')}
                    </span>
                  </button>
                )}
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="hidden sm:inline text-slate-400 truncate max-w-xs">{t.tagline}</span>
              </div>
            </div>
          </div>

          {/* Quick stats & action buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* User Guide Button */}
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all border border-indigo-200/60"
              title={settings.language === 'ar' ? 'دليل استخدام البرنامج وفكرته' : 'User Guide & Purpose'}
            >
              <span>📖</span>
              <span className="hidden sm:inline">{settings.language === 'ar' ? 'دليل الاستخدام' : 'User Guide'}</span>
            </button>

            {/* Quick Timer Shortcut */}
            <button
              onClick={onOpenTimer}
              className="p-2 sm:px-3 sm:py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5"
              title={t.tabs.timer}
            >
              <Clock className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">{settings.language === 'ar' ? 'المؤقت' : 'Timer'}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all border border-slate-200/60"
              title={settings.language === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{settings.language === 'ar' ? 'English' : 'عربي'}</span>
            </button>

            {/* Primary Action Button: Add Task */}
            <button
              onClick={onOpenQuickAdd}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">{t.addTaskBtn}</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
