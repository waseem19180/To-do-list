import React from 'react';
import { translations } from '../utils/translations';
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  CheckCircle2, 
  Zap, 
  ArrowUpCircle, 
  TrendingUp, 
  Heart, 
  Footprints, 
  Sparkles, 
  Award, 
  Clock, 
  Gift, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface UserGuideProps {
  language: 'ar' | 'en';
  onGoToTasks: () => void;
  onGoToTimer: () => void;
}

export const UserGuide: React.FC<UserGuideProps> = ({
  language,
  onGoToTasks,
  onGoToTimer,
}) => {
  const t = translations[language];

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Official Project & Developers Card */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-800/60 relative overflow-hidden">
        
        {/* Decorative blur rings */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-xs">
              <GraduationCap className="w-4 h-4" />
              <span>{language === 'ar' ? 'مشروع مادة اللغة الإنجليزية - الثانوية العامة (التوجيهي)' : 'Tawjihi English Curriculum Project'}</span>
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-indigo-200 border border-white/10">
              Unit: Time Management & To-Do Lists
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {language === 'ar' ? 'دليل استخدام تطبيق My Study To-Do List' : 'My Study To-Do List Guide & Purpose'}
            </h1>
            <p className="text-sm sm:text-base text-indigo-200/90 mt-2 leading-relaxed">
              {language === 'ar'
                ? 'تطبيق ويب تعليمي وتطبيقي يهدف إلى مساعدة طلاب التوجيهي والمراحل الدراسية على تحويل نصائح درس إدارة الوقت وقائمة المهام (To-Do List) إلى خطوات عملية يومية تمكنهم من الدراسة بذكاء وبدون توتر.'
                : 'An educational student web app translating the Tawjihi English lesson on Time Management into practical daily habits for peak academic focus and stress-free productivity.'}
            </p>
          </div>

          {/* Credits Box: Developers & Supervisor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/15">
            
            {/* Developers */}
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/30 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                  {language === 'ar' ? 'فريق البرمجة والتطوير' : 'Developed By'}
                </span>
                <span className="text-base font-extrabold text-white mt-0.5 block">
                  وسيم القيمري / أكرم عواد
                </span>
                <span className="text-xs text-indigo-200 block">
                  Waseem Al-Qaimari & Akram Awwad
                </span>
              </div>
            </div>

            {/* Supervisor Teacher */}
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/30 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-400/30">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                  {language === 'ar' ? 'إشراف المعلمة الفاضلة' : 'Supervised By Teacher'}
                </span>
                <span className="text-base font-extrabold text-white mt-0.5 block">
                  معلمة اللغة الإنجليزية: ريناد مرار
                </span>
                <span className="text-xs text-emerald-200 block">
                  Teacher: Renad Murrar
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 2. What is the Purpose of the App? (غاية البرنامج) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {language === 'ar' ? 'ما هي غاية وفكرة هذا البرنامج؟' : 'What is the Purpose of this Program?'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {language === 'ar' ? 'ربط منهاج اللغة الإنجليزية بالحياة العملية' : 'Bridging academic curriculum with real-world productivity'}
            </p>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
          <p>
            {language === 'ar' ? (
              <>
                في كتاب اللغة الإنجليزية لطلبة <strong>الثانوية العامة (التوجيهي)</strong>، يبدأ الدرس بطرح هذا التساؤل الهام:
                <br />
                <span className="font-semibold text-indigo-900 block mt-1 p-2 bg-indigo-50/80 rounded-xl border border-indigo-100">
                  "Do you sometimes feel that you're wasting a lot of your time and not getting enough done? Don't worry - you're not alone..."
                </span>
                وجاء هذا البرنامج ليكون أداة واقعية تجيب على هذا التساؤل، حيث تم تحويل النصائح الخمس التي وردت في الدرس إلى وظائف إلكترونية تفاعلية تساعد كل طالب على التخطيط ليومه وتجاوز عقبات التسويف والضغط العصبي.
              </>
            ) : (
              <>
                In the <strong>Tawjihi English curriculum</strong>, the lesson asks: 
                <span className="font-semibold text-indigo-900 block mt-1 p-2 bg-indigo-50/80 rounded-xl border border-indigo-100">
                  "Do you sometimes feel that you're wasting a lot of your time and not getting enough done? Don't worry - you're not alone..."
                </span>
                This application was engineered by <strong>Waseem Al-Qaimari & Akram Awwad</strong> under the guidance of teacher <strong>Renad Murrar</strong> to convert the lesson's 5 tips into an interactive everyday tool.
              </>
            )}
          </p>
        </div>
      </div>

      {/* 3. The 5 Steps of the Program (الخطوات العملية لتنظيم مهامك) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span>{language === 'ar' ? 'الخطوات العملية لتنظيم دراستك في البرنامج' : 'How to Use the 5 Steps in Your Daily Routine'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'ar' ? 'خطوات متسلسلة مستوحاة مباشرة من نصائح الدرس الخمس' : 'Step-by-step workflow inspired directly by the 5 tips'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full">
                الخطوة 1: Tip 1 - Just do it
              </span>
              <Zap className="w-4 h-4 text-amber-600" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">
              {language === 'ar' ? 'تحديد المهام والبدء الفوري دون تسويف' : 'Define your task & start without excuses'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ar' 
                ? 'لا تنتظر "الوقت المناسب"، فالوقت الأنسب هو الآن! افتح خانة المهام، اكتب المهمة التي تريد إنجازها، واضغط (بدء المؤقت) لمدة 5 أو 25 دقيقة وسيبدأ التركيز بالتدفق.' 
                : 'The right time never arrives; the best time is always now. Write down your first task and trigger the timer right away.'}
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-rose-900 bg-rose-200 px-2 py-0.5 rounded-full">
                الخطوة 2: Tip 2 - First things first
              </span>
              <ArrowUpCircle className="w-4 h-4 text-rose-600" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">
              {language === 'ar' ? 'ترتيب الأولويات (الأهم أولاً)' : 'Prioritize your tasks (First things first)'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ar'
                ? 'تذكر أن كتابة القائمة ليست هي التنفيذ! استخدم أزرار الأولوية الثلاثة (عالية 🔴، متوسطة 🟡، منخفضة 🔵) لتحدد المهام ذات الأهمية القصوى لتبدأ بها عندما تكون طاقتك في قمتها.'
                : 'Listing tasks is not doing them. Mark critical tasks as High Priority to tackle them when your mental energy is at its peak.'}
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-purple-900 bg-purple-200 px-2 py-0.5 rounded-full">
                الخطوة 3: Tip 5 - Divide large tasks & reward yourself
              </span>
              <Gift className="w-4 h-4 text-purple-600" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">
              {language === 'ar' ? 'تقسيم المهام الكبيرة ومكافأة النفس' : 'Divide large tasks into smaller parts & reward yourself'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ar'
                ? 'لا يمكنك دائماً جعل عقلك يعمل "تحت الطلب". قسّم الفصول الصعبة إلى خطوات صغيرة وسهلة، وحدد لنفسك مكافأة ممتعة (حلقة مسلسل، وجبة خفيفة) عند الانتهاء لتبقى متحمساً.'
                : "You can't make your brain work on demand. Break big tasks into manageable micro-steps and set a fun reward upon completion."}
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-emerald-900 bg-emerald-200 px-2 py-0.5 rounded-full">
                الخطوة 4: Tip 4 - Look after yourself
              </span>
              <Heart className="w-4 h-4 text-emerald-600" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">
              {language === 'ar' ? 'العناية بالنفس والنوم الصحي' : 'Look after your health, food, and sleep'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ar'
                ? 'الضغط لا يعالج بالمرض! تأكد من تناول طعام صحي، وشرب الماء، وأخذ قسط كافٍ من النوم والراحة، واستخدم مؤقت الاستراحة بعد كل جلسة دراسية لتجديد نشاطك.'
                : "Under stress, making yourself ill makes pressure worse. Eat well, sleep enough, and take mindful breaks between study sessions."}
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-2 md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-indigo-900 bg-indigo-200 px-2 py-0.5 rounded-full">
                الخطوة 5: Tip 3 - Keep going
              </span>
              <TrendingUp className="w-4 h-4 text-indigo-600" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">
              {language === 'ar' ? 'المثابرة عند الصعوبات أو أخذ استراحة وتغيير الجو' : 'Persevere when hitting the wall, or take a short break'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ar'
                ? 'إذا واجهت درساً معقداً وشعرت أنك تصطدم بجدار، جرب المثابرة بجهد إضافي بسيط، وإن لم تنجح خذ استراحة قصيرة وافعل شيئاً مختلفاً تماماً، ثم ارجع للمهمة بعقل منتعش.'
                : "If you 'hit the wall', try pushing with a bit more effort. If that fails, take a short break, do something completely different, and come back."}
            </p>
          </div>

        </div>

        {/* Quick CTA Buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500 font-medium text-center sm:text-left">
            {language === 'ar' ? 'جاهز للبدء بتنظيم يومك الدراسي الآن؟' : 'Ready to start planning your study day?'}
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onGoToTimer}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>{language === 'ar' ? 'مؤقت التركيز' : 'Focus Timer'}</span>
            </button>

            <button
              onClick={onGoToTasks}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'ar' ? 'الذهاب لقائمة المهام الآن' : 'Go to Task List'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* 4. Official Accreditation Signoff */}
      <div className="p-6 bg-slate-100/80 rounded-3xl border border-slate-200 text-center space-y-2">
        <p className="text-xs sm:text-sm font-bold text-slate-800">
          {language === 'ar'
            ? 'تم تصميم وبرمجة هذا التطبيق كنموذج تطبيقي لدرس إدارة الوقت وقائمة المهام لطلاب الثانوية العامة (التوجيهي)'
            : 'Designed & Developed as an Applied Model for the Tawjihi Time Management Lesson'}
        </p>
        <p className="text-xs text-slate-600">
          {language === 'ar'
            ? 'المطورون: وسيم القيمري • أكرم عواد | بإشراف المعلمة: ريناد مرار'
            : 'Developers: Waseem Al-Qaimari • Akram Awwad | Supervision: Teacher Renad Murrar'}
        </p>
      </div>

    </div>
  );
};
