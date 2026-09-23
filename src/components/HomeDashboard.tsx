import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  GraduationCap,
  Users,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  Sparkles,
  Search,
  Printer,
  Share2,
  X,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Check,
  TrendingUp,
  BarChart3,
  Flame,
} from 'lucide-react';
import { Course, FocusItem, UpcomingBill, TabType, BusinessSubTab } from '../types';
import BrandLogo from './BrandLogo';

interface HomeDashboardProps {
  courses: Course[];
  focusItems: FocusItem[];
  bills: UpcomingBill[];
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  onToggleFocus: (id: string) => void;
  onNavigateTab: (tab: TabType, subTab?: BusinessSubTab) => void;
  onOpenAddModal: () => void;
}

// Analytics Data for Trainee Enrollments & Performance
const ENROLLMENT_TREND = [
  { month: 'يناير', students: 220, graduates: 180 },
  { month: 'فبراير', students: 340, graduates: 290 },
  { month: 'مارس', students: 480, graduates: 410 },
  { month: 'أبريل', students: 620, graduates: 560 },
  { month: 'مايو', students: 810, graduates: 740 },
  { month: 'يونيو', students: 990, graduates: 910 },
  { month: 'يوليو', students: 1180, graduates: 1090 },
  { month: 'أغسطس', students: 1320, graduates: 1240 },
  { month: 'سبتمبر', students: 1450, graduates: 1390 },
];

const TRACK_DISTRIBUTION = [
  { track: 'برمجة ويب', count: 580, percentage: 40 },
  { track: 'ذكاء اصطناعي', count: 360, percentage: 25 },
  { track: 'تسويق رقمي', count: 280, percentage: 20 },
  { track: 'تصميم ومونتاج', count: 230, percentage: 15 },
];

export default function HomeDashboard({
  courses,
  focusItems,
  onToggleFocus,
  onNavigateTab,
  onOpenAddModal,
}: HomeDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [analyticsView, setAnalyticsView] = useState<'enrollment' | 'tracks'>('enrollment');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState<boolean>(false);
  const [certificateData, setCertificateData] = useState({
    studentName: 'أحمد حسام الدين السيد',
    courseName: 'دبلومة تطوير تطبيقات الويب المتكاملة (Full-Stack Web Development)',
    track: 'React 19, TypeScript, Next.js & Node.js مع مشاريع حية',
    code: 'SG-2026-994',
    date: '11 سبتمبر 2026',
    score: 'ممتاز مع مرتبة الشرف (98.5%)',
    instructor: 'م. صابر عبد الرحمن',
    hours: '140 ساعة تدريبية معتمدة',
  });
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const activeCoursesCount = courses.filter((c) => c.status === 'active').length;
  const totalStudentsCount = courses.reduce((acc, curr) => acc + curr.studentsCount, 0);

  const filteredCourses = courses.filter(
    (c) => selectedCategory === 'all' || c.category === selectedCategory
  );

  const handleVerifyCode = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const query = verificationCode.trim().toUpperCase();
    if (!query) return;

    if (query.includes('994') || query.includes('SG') || query.includes('أحمد')) {
      setCertificateData({
        studentName: 'أحمد حسام الدين السيد',
        courseName: 'دبلومة تطوير تطبيقات الويب المتكاملة (Full-Stack Web Development)',
        track: 'React 19, TypeScript, Next.js & Node.js مع مشاريع حية',
        code: 'SG-2026-994',
        date: '11 سبتمبر 2026',
        score: 'ممتاز مع مرتبة الشرف (98.5%)',
        instructor: 'م. صابر عبد الرحمن',
        hours: '140 ساعة تدريبية معتمدة',
      });
      setIsCertificateModalOpen(true);
    } else {
      setCertificateData({
        studentName: 'متدرب معتمد لدى صابر جروب',
        courseName: 'ماستر كلاس التقنيات الحديثة وإدارة الأعمال',
        track: 'مسار معتمد من أكاديمية صابر جروب',
        code: query || 'SG-2026-VERIFIED',
        date: 'سبتمبر 2026',
        score: 'اجتياز معتمد (95%)',
        instructor: 'نخبة محاضري الأكاديمية',
        hours: '90 ساعة تدريبية',
      });
      setIsCertificateModalOpen(true);
    }
  };

  return (
    <div className="space-y-5 pb-16">
      {/* 1. Official Academy Master Brand Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
      >
        <BrandLogo size="hero" showSubtitle={true} />
      </motion.div>

      {/* 2. Top Bento Grid: Spotlight Certificate + Interactive Recharts Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left/Main Column: THE SPOTLIGHT ACCREDITED CERTIFICATE */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="lg:col-span-7 flex flex-col justify-between relative overflow-hidden rounded-3xl p-5 sm:p-6 border border-[#DC2626]/50 bg-[radial-gradient(ellipse_at_center,#5C0B15_0%,#2B050A_50%,#110204_85%,#080102_100%)] shadow-[0_16px_40px_rgba(0,0,0,0.85),0_0_25px_rgba(220,38,38,0.2)] text-right group"
        >
          {/* Ambient reflections and laser line */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.18),transparent_65%)] pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#EF4444] to-transparent shadow-[0_0_12px_#EF4444]" />
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#DC2626]/40 to-transparent" />

          <div className="relative z-10 space-y-3.5">
            {/* Top Badge & Accreditation status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 bg-[#3B0A11] border border-[#DC2626]/40 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm">
                <Award className="w-4 h-4 text-[#EF4444]" />
                <span>الشهادة المعتمدة الرسمية</span>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>موثقة ومؤكدة إلكترونياً</span>
              </span>
            </div>

            {/* Certificate Brand Header */}
            <div className="text-center pt-1 pb-1">
              <div className="flex items-center justify-center gap-1.5">
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-widest uppercase font-['Plus_Jakarta_Sans',sans-serif] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                  SABER GROUP
                </h3>
                <span className="text-xs font-bold text-white/90 border border-white/70 rounded-full w-4 h-4 flex items-center justify-center -mt-2">
                  ®
                </span>
              </div>
              <p className="text-[11px] sm:text-xs font-bold tracking-[0.25em] text-[#F3F4F6] uppercase font-['Plus_Jakarta_Sans',sans-serif] mt-0.5">
                COURSES ACADEMY
              </p>
              <p className="text-xs sm:text-sm font-bold tracking-[0.12em] text-[#EF4444] mt-0.5 font-['Cairo',sans-serif]">
                أكــاديــمــيــة تــدريــب مــعــتــمــدة
              </p>
            </div>

            {/* Trainee Certification Details */}
            <div className="p-4 rounded-2xl bg-black/50 border border-[#DC2626]/35 backdrop-blur-sm text-center space-y-1.5 shadow-inner">
              <span className="text-xs text-zinc-300 font-medium block font-['Cairo',sans-serif]">
                تـشـهـد الأكـاديـمـيـة بـاجـتـيـاز الـمـتـدرب الـمـتـمـيـز:
              </span>
              <h4 className="text-lg sm:text-xl font-black text-white font-['Cairo',sans-serif] tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-[#EF4444]">
                {certificateData.studentName}
              </h4>
              <div className="pt-1">
                <span className="text-xs sm:text-sm font-bold text-[#EF4444] block">
                  {certificateData.courseName}
                </span>
                <span className="text-xs text-emerald-400 font-bold block mt-1">
                  بتقدير: {certificateData.score}
                </span>
              </div>
            </div>

            {/* Verification Code & Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-3 text-xs text-zinc-300 w-full sm:w-auto justify-between sm:justify-start">
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-400">كود التحقق الرقمي:</span>
                  <span className="font-bold text-white font-['Plus_Jakarta_Sans',sans-serif] bg-[#2E0B12] px-2.5 py-0.5 rounded-md border border-[#DC2626]/30 text-xs">
                    {certificateData.code}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 font-medium">11 سبتمبر 2026</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsCertificateModalOpen(true)}
                className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#DC2626] via-[#B91C1C] to-[#991B1B] text-white text-xs font-bold shadow-lg shadow-[#DC2626]/40 hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>استعراض وطباعة الشهادة المعتمدة</span>
              </motion.button>
            </div>
          </div>

          {/* Quick Verification Search embedded directly */}
          <div className="mt-4 pt-3 border-t border-[#DC2626]/30">
            <form onSubmit={handleVerifyCode} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="تحقق سريع من كود شهادة (مثال: SG-2026-994)..."
                  className="w-full py-2 pr-9 pl-3 text-xs bg-[#19070B] border border-[#DC2626]/30 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#EF4444] transition-colors text-right"
                />
              </div>
              <button
                type="submit"
                className="py-2 px-4 bg-[#2C0910] hover:bg-[#3D0C17] border border-[#DC2626]/40 text-[#EF4444] hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0"
              >
                تحقق
              </button>
            </form>
          </div>
        </motion.div>

        {/* Right Column: INTERACTIVE RECHARTS ANALYTICS & PERFORMANCE (Figma Make Web App Dashboard) */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="lg:col-span-5 flex flex-col justify-between rounded-3xl p-5 sm:p-6 bg-gradient-to-b from-[#160609] via-[#100406] to-[#0A0204] border border-[#3E1018] shadow-xl"
        >
          <div>
            {/* Header & Chart View Switcher */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#2D0A11] border border-[#DC2626]/40 flex items-center justify-center text-[#EF4444]">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">مؤشرات أداء الأكاديمية</h3>
                  <span className="text-[10px] text-zinc-400">إحصائيات الخريجين والمسارات</span>
                </div>
              </div>

              {/* View Switcher Pills */}
              <div className="flex items-center gap-1 bg-[#1E070B] p-1 rounded-xl border border-[#380E15]">
                <button
                  onClick={() => setAnalyticsView('enrollment')}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    analyticsView === 'enrollment'
                      ? 'bg-[#DC2626] text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  النمو
                </button>
                <button
                  onClick={() => setAnalyticsView('tracks')}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    analyticsView === 'tracks'
                      ? 'bg-[#DC2626] text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  التخصصات
                </button>
              </div>
            </div>

            {/* Recharts Interactive Visualizer */}
            <div className="h-44 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                {analyticsView === 'enrollment' ? (
                  <AreaChart
                    data={ENROLLMENT_TREND}
                    margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="#DC2626" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2D0B12" vertical={false} />
                    <XAxis
                      dataKey="month"
                      stroke="#71717A"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#71717A"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#160608',
                        borderColor: '#DC2626',
                        borderRadius: '12px',
                        fontSize: '11px',
                        color: '#FFF',
                        textAlign: 'right',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.8)',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="students"
                      name="المتدربون"
                      stroke="#EF4444"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorStudents)"
                    />
                  </AreaChart>
                ) : (
                  <BarChart
                    data={TRACK_DISTRIBUTION}
                    margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#2D0B12" vertical={false} />
                    <XAxis
                      dataKey="track"
                      stroke="#71717A"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#71717A"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#160608',
                        borderColor: '#DC2626',
                        borderRadius: '12px',
                        fontSize: '11px',
                        color: '#FFF',
                        textAlign: 'right',
                      }}
                    />
                    <Bar
                      dataKey="count"
                      name="عدد المسجلين"
                      fill="#DC2626"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Metrics Bar at bottom of analytics */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#310D14] text-center mt-2">
            <div className="p-2 rounded-xl bg-black/30 border border-[#2E0B12]">
              <span className="text-[10px] text-zinc-400 block">إجمالي المتدربين</span>
              <span className="text-xs font-black text-white block mt-0.5">1,450+</span>
            </div>
            <div className="p-2 rounded-xl bg-black/30 border border-[#2E0B12]">
              <span className="text-[10px] text-zinc-400 block">نسبة الاجتياز</span>
              <span className="text-xs font-black text-emerald-400 block mt-0.5">98.5%</span>
            </div>
            <div className="p-2 rounded-xl bg-black/30 border border-[#2E0B12]">
              <span className="text-[10px] text-zinc-400 block">الدبلومات المعتمدة</span>
              <span className="text-xs font-black text-[#EF4444] block mt-0.5">8 مسارات</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 3. Academy Key Highlight Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#140608]/90 border border-[#3A0F15] flex items-center gap-3 shadow-sm hover:border-[#DC2626]/40 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-red-600/15 border border-[#DC2626]/30 flex items-center justify-center text-[#EF4444] shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-zinc-400 block">
              المسارات التدريبية
            </span>
            <span className="text-sm font-black text-white">
              {activeCoursesCount} دبلومات نشطة
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#140608]/90 border border-[#3A0F15] flex items-center gap-3 shadow-sm hover:border-[#DC2626]/40 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-zinc-400 block">
              الطلاب الحاليون
            </span>
            <span className="text-sm font-black text-white">
              {totalStudentsCount} متدرب مسجل
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#140608]/90 border border-[#3A0F15] flex items-center gap-3 shadow-sm hover:border-[#DC2626]/40 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-zinc-400 block">
              الشهادات الصادرة
            </span>
            <span className="text-sm font-black text-white">
              1,450+ شهادة معتمدة
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#140608]/90 border border-[#3A0F15] flex items-center gap-3 shadow-sm hover:border-[#DC2626]/40 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-zinc-400 block">
              نسبة اجتياز الطلاب
            </span>
            <span className="text-sm font-black text-white">
              98.5% امتياز
            </span>
          </div>
        </div>
      </div>

      {/* 4. CERTIFIED ACADEMY COURSES & DIPLOMAS (Responsive 3-column Figma Card Grid) */}
      <div className="space-y-3.5">
        {/* Section Header & Category Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#EF4444]" />
            <h3 className="text-sm font-bold text-white">
              المسارات والدورات التدريبية المعتمدة
            </h3>
            <span className="text-xs font-semibold text-zinc-400 bg-[#25090F] px-2.5 py-0.5 rounded-md border border-[#DC2626]/30">
              {filteredCourses.length} دورة معتمدة
            </span>
          </div>

          {/* Categories Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'برمجة وتطوير', label: 'برمجة وتطوير' },
              { id: 'تسويق رقمي', label: 'تسويق رقمي' },
              { id: 'تصميم ومونتاج', label: 'تصميم ومونتاج' },
              { id: 'ذكاء اصطناعي', label: 'ذكاء اصطناعي' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-all duration-150 shrink-0 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#DC2626] text-white border-[#DC2626] shadow-sm shadow-[#DC2626]/40'
                    : 'bg-[#18080B] text-zinc-400 border-[#380E15] hover:border-[#DC2626]/40 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* All Course Cards in 1, 2, or 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredCourses.map((course) => (
            <motion.div
              key={course.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCourse(course)}
              className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-b from-[#18070A] via-[#120507] to-[#0D0406] border border-[#3E1119] hover:border-[#EF4444]/80 hover:shadow-[0_12px_35px_-8px_rgba(220,38,38,0.35),0_0_15px_rgba(239,68,68,0.15)] hover:-translate-y-1 transition-all duration-250 ease-out shadow-md group cursor-pointer flex flex-col justify-between"
            >
              {/* Soft Ambient Ruby Glow Layer on Hover */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(239,68,68,0.18),transparent_65%)] opacity-0 group-hover:opacity-100 transition-opacity duration-250 pointer-events-none" />

              {/* Glowing Top Laser Line */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-transparent group-hover:via-[#EF4444] to-transparent transition-all duration-250 pointer-events-none shadow-[0_0_10px_#EF4444]" />

              <div className="relative z-10">
                {/* Status and Category */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-[#EF4444] bg-[#2E0B12] px-2 py-0.5 rounded-md border border-[#DC2626]/30 group-hover:border-[#EF4444]/60 group-hover:bg-[#3E0E18] transition-all">
                      {course.category}
                    </span>
                    <span className="text-[10px] font-semibold text-zinc-400 bg-[#1D080D] px-2 py-0.5 rounded-md">
                      {course.level}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-all ${
                      course.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {course.status === 'active' ? 'جارية ومباشرة ✓' : 'قيد التسجيل'}
                  </span>
                </div>

                {/* Course Title & Details */}
                <h4 className="text-sm font-bold text-white mb-1 leading-snug group-hover:text-[#EF4444] transition-colors">
                  {course.title}
                </h4>
                <p className="text-xs text-zinc-400 mb-3 line-clamp-2 leading-relaxed">
                  {course.subtitle}
                </p>

                {/* Progress bar */}
                <div className="space-y-1 mb-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400">نسبة إنجاز المنهج:</span>
                    <span className="font-bold text-white group-hover:text-[#EF4444] transition-colors">
                      {course.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-[#2A0B10] h-2 rounded-full overflow-hidden p-0.5 border border-transparent group-hover:border-[#DC2626]/30 transition-colors">
                    <div
                      className="bg-gradient-to-r from-[#991B1B] via-[#DC2626] to-[#EF4444] h-full rounded-full transition-all duration-300 shadow-[0_0_8px_#DC2626]"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Meta details */}
              <div className="relative z-10 flex items-center justify-between pt-2.5 border-t border-[#310C13] group-hover:border-[#4E131E] transition-colors text-xs">
                <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
                  <span className="text-zinc-300 font-medium">المدرب: {course.instructor}</span>
                  <span>•</span>
                  <span>
                    {course.studentsCount}/{course.maxStudents}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-black text-[#EF4444] text-sm group-hover:scale-105 transition-all">
                    {course.price.toLocaleString('ar-EG')} ج.م
                  </span>
                  <div className="w-5 h-5 rounded-full bg-[#2E0B12] border border-[#DC2626]/40 flex items-center justify-center text-[#EF4444] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 5. Schedule & Administrative Quick Toolbar (2-column layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Today's Lectures & Live Sessions */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#140608] border border-[#3E1018] shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#EF4444]" />
              <h3 className="text-xs font-bold text-white">
                المحاضرات والبث المباشر لليوم
              </h3>
            </div>
            <button
              onClick={onOpenAddModal}
              className="text-[11px] font-bold text-[#EF4444] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>جدولة محاضرة +</span>
            </button>
          </div>

          <div className="space-y-2">
            {focusItems.map((item) => (
              <motion.div
                key={item.id}
                whileTap={{ scale: 0.99 }}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  item.completed
                    ? 'bg-[#100507]/40 border-[#2A0A10] opacity-60'
                    : 'bg-[#19070A] border-[#380E15] hover:border-[#DC2626]/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      item.completed
                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                        : 'bg-[#2E0B12] text-[#EF4444] border border-[#DC2626]/30'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h5
                      className={`text-xs font-bold leading-snug ${
                        item.completed ? 'line-through text-zinc-400' : 'text-white'
                      }`}
                    >
                      {item.title}
                    </h5>
                    <p className="text-[10px] text-zinc-400 mt-0.5 flex items-center gap-1.5">
                      <span>{item.time}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-[#EF4444] font-medium">{item.tag}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onToggleFocus(item.id)}
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                    item.completed
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'border-[#4A121C] hover:border-[#DC2626]'
                  }`}
                >
                  {item.completed && <Check className="w-3.5 h-3.5" />}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Management Center */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#1E070B] via-[#140508] to-[#0D0305] border border-[#3E1018] shadow-md flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-8 h-8 rounded-xl bg-[#2E0A11] border border-[#DC2626]/40 flex items-center justify-center text-[#EF4444]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  مركز الإدارة والعمليات الأكاديمية
                </h4>
                <span className="text-[10px] text-zinc-400">إدارة المتدربين والشهادات والفواتير</span>
              </div>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed mt-2">
              لوحة متقدمة تتيح لمشرفي أكاديمية صابر جروب متابعة شؤون الطلاب، اعتماد الاختبارات النهائية، إصدار الشهادات الموثقة إلكترونياً، والربط المالي الفوري.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-[#330C13]">
            <button
              onClick={() => onNavigateTab('business', 'clients')}
              className="py-2.5 px-3 rounded-xl bg-[#28090F] hover:bg-[#3B0D16] text-zinc-200 hover:text-white text-xs font-bold border border-[#DC2626]/30 transition-all cursor-pointer text-center"
            >
              سجل المتدربين
            </button>
            <button
              onClick={() => onNavigateTab('business', 'invoices')}
              className="py-2.5 px-3 rounded-xl bg-[#28090F] hover:bg-[#3B0D16] text-zinc-200 hover:text-white text-xs font-bold border border-[#DC2626]/30 transition-all cursor-pointer text-center"
            >
              الفواتير والرسوم
            </button>
            <button
              onClick={onOpenAddModal}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#DC2626] to-[#991B1B] text-white text-xs font-bold shadow-md shadow-[#DC2626]/30 transition-all cursor-pointer text-center col-span-2 sm:col-span-1"
            >
              + إضافة دورة / طالب
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FULL OFFICIAL ACCREDITED CERTIFICATE MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isCertificateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCertificateModalOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-2xl bg-[#0F0305] border-2 border-[#DC2626]/70 rounded-3xl p-5 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(220,38,38,0.3)] z-10 text-right overflow-hidden my-auto"
            >
              {/* Decorative Frame */}
              <div className="absolute inset-2 border border-[#DC2626]/30 rounded-2xl pointer-events-none" />
              <div className="absolute inset-3 border border-[#EF4444]/20 rounded-xl pointer-events-none" />
              <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(circle,rgba(239,68,68,0.18),transparent_70%)] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[radial-gradient(circle,rgba(220,38,38,0.18),transparent_70%)] pointer-events-none" />

              <button
                onClick={() => setIsCertificateModalOpen(false)}
                className="absolute top-4 left-4 w-8 h-8 rounded-full bg-[#2A090F] border border-[#DC2626]/40 flex items-center justify-center text-zinc-300 hover:text-white cursor-pointer z-20"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="relative z-10 text-center space-y-2 pb-4 border-b border-[#DC2626]/40">
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-2xl sm:text-4xl font-black text-white tracking-widest uppercase font-['Plus_Jakarta_Sans',sans-serif] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                    SABER GROUP
                  </h2>
                  <span className="text-xs sm:text-sm font-bold text-white/95 border border-white/80 rounded-full w-5 h-5 flex items-center justify-center -mt-3 shrink-0">
                    ®
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold tracking-[0.35em] text-[#F3F4F6] uppercase font-['Plus_Jakarta_Sans',sans-serif]">
                  COURSES ACADEMY
                </p>
                <p className="text-sm sm:text-base font-bold tracking-[0.18em] text-[#EF4444] font-['Cairo',sans-serif]">
                  أكــاديــمــيــة تــدريــب مــعــتــمــدة
                </p>
              </div>

              {/* Certificate Title */}
              <div className="relative z-10 text-center my-4 space-y-1">
                <div className="inline-block px-4 py-1 rounded-full bg-[#2D0A11] border border-[#DC2626]/50 text-xs font-bold text-[#EF4444] uppercase tracking-wider">
                  CERTIFICATE OF COMPLETION & EXCELLENCE
                </div>
                <h3 className="text-lg sm:text-2xl font-black text-white font-['Cairo',sans-serif] mt-1">
                  شـهـادة تـخـرج واجـتـيـاز مـعـتـمـدة
                </h3>
              </div>

              {/* Content */}
              <div className="relative z-10 text-center space-y-3 max-w-lg mx-auto py-2">
                <p className="text-xs sm:text-sm text-zinc-300 font-['Cairo',sans-serif]">
                  تـشـهـد إدارة أكـاديـمـيـة صـابـر جـروب لـلـتـدريـب بـأن الـمـتـدرب:
                </p>

                <div className="p-3 sm:p-4 rounded-2xl bg-black/60 border border-[#DC2626]/50 shadow-inner">
                  <h4 className="text-xl sm:text-3xl font-black text-white tracking-wide font-['Cairo',sans-serif] text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-[#EF4444]">
                    {certificateData.studentName}
                  </h4>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 font-['Cairo',sans-serif]">
                  قد اجتاز بنجاح وتفوق كافة المتطلبات الأكاديمية والمشاريع العملية المقررة في:
                </p>

                <div className="p-3 rounded-xl bg-[#23080E]/70 border border-[#DC2626]/40">
                  <h5 className="text-sm sm:text-base font-bold text-[#EF4444] font-['Cairo',sans-serif]">
                    {certificateData.courseName}
                  </h5>
                  <p className="text-xs text-zinc-400 mt-0.5">{certificateData.hours}</p>
                </div>

                <div className="flex justify-center items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-400">التقدير العام:</span>
                  <span className="text-xs sm:text-sm font-black text-emerald-400 bg-emerald-950/50 px-3 py-1 rounded-md border border-emerald-500/40">
                    {certificateData.score}
                  </span>
                </div>
              </div>

              {/* Verification & Seals Footer */}
              <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-[#DC2626]/40 text-xs mt-3">
                <div className="p-2.5 rounded-xl bg-black/40 border border-[#3E1018] text-right">
                  <span className="text-[10px] text-zinc-400 block">رئيس مجلس الإدارة:</span>
                  <span className="font-bold text-white block mt-0.5">{certificateData.instructor}</span>
                  <span className="text-[9px] text-[#EF4444] block">التوقيع المعتمد ✓</span>
                </div>

                <div className="p-2.5 rounded-xl bg-black/40 border border-[#3E1018] text-center flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full border-2 border-[#DC2626] bg-[#2E0B12] flex items-center justify-center text-[#EF4444] shadow-md shadow-[#DC2626]/40">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-bold text-zinc-300 mt-1">الختم الرقمي الرسمي</span>
                </div>

                <div className="p-2.5 rounded-xl bg-black/40 border border-[#3E1018] text-right col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-zinc-400 block">كود التوثيق الإلكتروني:</span>
                  <span className="font-black text-[#EF4444] font-['Plus_Jakarta_Sans',sans-serif] block mt-0.5 text-xs">
                    {certificateData.code}
                  </span>
                  <span className="text-[9px] text-emerald-400 block">مرخص ومسجل رسمياً</span>
                </div>
              </div>

              {/* Actions */}
              <div className="relative z-10 flex gap-2 pt-4">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 bg-gradient-to-r from-[#DC2626] via-[#B91C1C] to-[#991B1B] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#DC2626]/40 hover:brightness-110 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة الشهادة الرسمية</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(
                      `https://saber-academy.com/verify/${certificateData.code}`
                    );
                    alert('تم نسخ رابط التوثيق المعتمد للشهادة بنجاح!');
                  }}
                  className="py-3 px-4 bg-[#23080E] border border-[#DC2626]/40 text-zinc-300 hover:text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>مشاركة الرابط</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Course Detail Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCourse(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#160609] border border-[#DC2626]/50 rounded-3xl p-5 shadow-2xl z-10 text-right max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between pb-3 border-b border-[#3E1018] mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#2D0A11] border border-[#DC2626]/40 flex items-center justify-center text-[#EF4444]">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">تفاصيل المسار التدريبي</h3>
                    <span className="text-[10px] text-zinc-400">أكاديمية صابر جروب للتدريب</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="w-7 h-7 rounded-full bg-[#270B10] flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[radial-gradient(ellipse_at_top,#4E0911_0%,#200408_60%,#090102_100%)] border border-[#DC2626]/40 mb-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#EF4444] bg-[#2E0B12] px-2.5 py-0.5 rounded-md border border-[#DC2626]/30">
                    {selectedCourse.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    {selectedCourse.status === 'active' ? 'جارية ومباشرة ✓' : 'قيد التسجيل'}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white leading-snug">
                  {selectedCourse.title}
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {selectedCourse.subtitle}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#3E1018] text-xs">
                  <div className="p-2 rounded-xl bg-black/30 border border-[#3E1018]">
                    <span className="text-[10px] text-zinc-400 block">المدرب المعتمد</span>
                    <span className="font-bold text-white mt-0.5 block">{selectedCourse.instructor}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/30 border border-[#3E1018]">
                    <span className="text-[10px] text-zinc-400 block">الطلاب المسجلون</span>
                    <span className="font-bold text-emerald-400 mt-0.5 block">
                      {selectedCourse.studentsCount} / {selectedCourse.maxStudents} طالب
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-[#DC2626]/30">
                  <span className="text-xs font-bold text-zinc-300">رسوم التسجيل للمتدرب:</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white font-['Plus_Jakarta_Sans',sans-serif]">
                      {selectedCourse.price.toLocaleString('ar-EG')}
                    </span>
                    <span className="text-xs font-bold text-[#EF4444]">ج.م</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCertificateData({
                      studentName: 'أحمد حسام الدين السيد',
                      courseName: selectedCourse.title,
                      track: selectedCourse.subtitle,
                      code: `SG-2026-${selectedCourse.id.toUpperCase()}`,
                      date: 'سبتمبر 2026',
                      score: 'امتياز (98%)',
                      instructor: selectedCourse.instructor,
                      hours: '120 ساعة تدريبية',
                    });
                    setSelectedCourse(null);
                    setIsCertificateModalOpen(true);
                  }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#DC2626] to-[#991B1B] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>استعراض نموذج شهادة المسار</span>
                </button>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="px-4 py-2.5 bg-[#250B10] text-zinc-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
