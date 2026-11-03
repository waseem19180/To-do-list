import React, { useState } from 'react';
import { translations } from '../utils/translations';
import { 
  Zap, 
  ArrowUpCircle, 
  TrendingUp, 
  Heart, 
  Footprints, 
  ChevronRight, 
  ChevronLeft,
  BookOpen,
  X,
  Lightbulb
} from 'lucide-react';

interface FivePrinciplesBannerProps {
  language: 'ar' | 'en';
  onSelectPrincipleAction: (actionType: 'just_do_it' | 'first_things_first' | 'keep_going' | 'take_care' | 'one_step') => void;
}

export const FivePrinciplesBanner: React.FC<FivePrinciplesBannerProps> = ({
  language,
  onSelectPrincipleAction,
}) => {
  const t = translations[language];
  const [isOpen, setIsOpen] = useState(false);

  const principles = [
    {
      id: 'just_do_it' as const,
      number: 1,
      icon: Zap,
      title: t.principles.p1_title,
      desc: t.principles.p1_desc,
      action: t.principles.p1_action,
      color: 'from-amber-500 to-orange-500',
      badge: 'Tip 1',
    },
    {
      id: 'first_things_first' as const,
      number: 2,
      icon: ArrowUpCircle,
      title: t.principles.p2_title,
      desc: t.principles.p2_desc,
      action: t.principles.p2_action,
      color: 'from-rose-500 to-pink-500',
      badge: 'Tip 2',
    },
    {
      id: 'keep_going' as const,
      number: 3,
      icon: TrendingUp,
      title: t.principles.p3_title,
      desc: t.principles.p3_desc,
      action: t.principles.p3_action,
      color: 'from-blue-500 to-indigo-500',
      badge: 'Tip 3',
    },
    {
      id: 'take_care' as const,
      number: 4,
      icon: Heart,
      title: t.principles.p4_title,
      desc: t.principles.p4_desc,
      action: t.principles.p4_action,
      color: 'from-emerald-500 to-teal-500',
      badge: 'Tip 4',
    },
    {
      id: 'one_step' as const,
      number: 5,
      icon: Footprints,
      title: t.principles.p5_title,
      desc: t.principles.p5_desc,
      action: t.principles.p5_action,
      color: 'from-purple-500 to-violet-500',
      badge: 'Tip 5',
    },
  ];

  return (
    <div className="mb-6">
      {/* Compact toggle pill that doesn't block the task list */}
      <div className="flex items-center justify-between bg-indigo-50/90 border border-indigo-200/80 rounded-2xl px-4 py-2.5 transition-all">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div className="truncate">
            <h3 className="text-xs sm:text-sm font-bold text-indigo-950 truncate">
              {t.principlesTitle}
            </h3>
            <p className="text-[11px] text-indigo-700/80 hidden sm:block truncate">
              {language === 'ar' 
                ? 'مستوحاة من درس إدارة الوقت وقائمة المهام (To-Do List)' 
                : 'Tips 1 to 5 from the To-Do List & Time Management lesson'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs transition-all flex items-center gap-1 shrink-0"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{isOpen ? (language === 'ar' ? 'إخفاء النصائح' : 'Hide Tips') : (language === 'ar' ? 'عرض النصائح الـ 5' : 'View 5 Tips')}</span>
        </button>
      </div>

      {/* Expandable modal / card drawer */}
      {isOpen && (
        <div className="mt-3 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-lg space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                {t.principlesTitle}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.principlesSubtitle}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {principles.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.id}
                  className="bg-slate-50/80 hover:bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-indigo-300 transition-all flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${p.color} flex items-center justify-center text-white shadow-xs`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                        {p.badge}
                      </span>
                    </div>

                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 mb-1.5">
                      {p.title}
                    </h5>

                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {p.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onSelectPrincipleAction(p.id);
                      setIsOpen(false);
                    }}
                    className="w-full py-1.5 px-3 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                  >
                    <span>{p.action}</span>
                    {language === 'ar' ? (
                      <ChevronLeft className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
