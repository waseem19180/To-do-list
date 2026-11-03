import React, { useRef, useState } from 'react';
import { UserSettings } from '../types';
import { translations } from '../utils/translations';
import { 
  exportAllData, 
  importDataFromJSON, 
  clearAllDataFromStorage 
} from '../utils/storage';
import { 
  Download, 
  Upload, 
  Trash2, 
  Globe, 
  User, 
  Clock, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';

interface SettingsBackupModalProps {
  settings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
  onDataRestored: () => void;
}

export const SettingsBackupModal: React.FC<SettingsBackupModalProps> = ({
  settings,
  onUpdateSettings,
  onDataRestored,
}) => {
  const t = translations[settings.language];
  const importInputRef = useRef<HTMLInputElement>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleLanguageChange = (lang: 'ar' | 'en') => {
    onUpdateSettings({ ...settings, language: lang });
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const handleExport = () => {
    exportAllData();
    showToast(t.backupExportSuccess);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDataFromJSON(content);
      if (success) {
        showToast(t.backupImportSuccess);
        onDataRestored();
      } else {
        showToast(t.backupImportError);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmClearAll = () => {
    clearAllDataFromStorage();
    setShowConfirmModal(false);
    showToast(t.clearSuccess);
    onDataRestored();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Intro Box */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {t.settingsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {t.settingsDesc}
            </p>
          </div>
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900">
          {settings.language === 'ar' ? 'الإعدادات العامة واللغة' : 'General & Language Preferences'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Language selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.languageSwitch}</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleLanguageChange('ar')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                  settings.language === 'ar'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                العربية (RTL)
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                  settings.language === 'en'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                English (LTR)
              </button>
            </div>
          </div>

          {/* Student name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.studentName}</span>
            </label>
            <input
              type="text"
              value={settings.studentName}
              onChange={(e) => onUpdateSettings({ ...settings, studentName: e.target.value })}
              placeholder={t.studentNamePlaceholder}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>

        </div>
      </div>

      {/* Backup & Restore Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900">
          {settings.language === 'ar' ? 'النسخ الاحتياطي ونقل البيانات' : 'Backup & Data Portability'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Export */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between gap-3">
            <div>
              <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-indigo-600" />
                <span>{t.exportBackup}</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                {settings.language === 'ar' 
                  ? 'قم بتحميل ملف JSON يحتوي على جميع مهامك وأهدافك ونقاطك للاحتفاظ بنسخة على جهازك.' 
                  : 'Download a JSON file containing all your tasks, goals, and progress stats.'}
              </p>
            </div>
            <button
              onClick={handleExport}
              className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.exportBackup}</span>
            </button>
          </div>

          {/* Import */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between gap-3">
            <div>
              <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>{t.importBackup}</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                {settings.language === 'ar'
                  ? 'استرجع بياناتك السابقة عبر رفع ملف النسخة الاحتياطية الذي حفظته سابقاً.'
                  : 'Restore your previous data by uploading your saved backup JSON file.'}
              </p>
            </div>

            <input
              type="file"
              ref={importInputRef}
              onChange={handleImportFile}
              accept=".json"
              className="hidden"
            />

            <button
              onClick={() => importInputRef.current?.click()}
              className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{t.importBackup}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Danger Zone: Clear Data */}
      <div className="bg-rose-50/50 rounded-3xl p-6 border border-rose-200/80 shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-rose-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span>{settings.language === 'ar' ? 'منطقة الحذف الشامل' : 'Reset & Erase Data'}</span>
        </h3>
        <p className="text-xs text-rose-700">
          {settings.language === 'ar'
            ? 'إذا أردت البدء من جديد تماماً، يمكنك مسح كافة المهام والأهداف وسجل الأوسمة المحفوظة في المتصفح.'
            : 'If you wish to start completely fresh, you can erase all stored tasks, goals, and stats in this browser.'}
        </p>

        <button
          type="button"
          onClick={() => setShowConfirmModal(true)}
          className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
        >
          <Trash2 className="w-4 h-4" />
          <span>{t.clearAllData}</span>
        </button>
      </div>

      {/* Floating Feedback Toast */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2">
          <span>✓</span>
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* In-app Clear Confirmation Modal (No window.confirm!) */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="font-bold text-base text-slate-900">
                {settings.language === 'ar' ? 'مسح جميع البيانات وسلة المهملات؟' : 'Erase all data & empty trash?'}
              </h4>
              <p className="text-xs text-slate-500">
                {t.clearConfirmText}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                {settings.language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={handleConfirmClearAll}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
              >
                {settings.language === 'ar' ? 'نعم، احذف كل شيء' : 'Yes, Erase All'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
