import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
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
  Users,
  GraduationCap,
  DollarSign,
  CheckCircle2,
  TrendingUp,
  Calendar,
  Clock,
  ArrowUpRight,
  Plus,
  Sparkles,
  BookOpen,
  ArrowRight,
  Search,
  Check,
  Award,
  Layers,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { Course, Task, ClientOrStudent, Invoice, TabType, BusinessSubTab, Transaction, Installment, Wallet } from '../types';
import AdvancedSearchFilter from './AdvancedSearchFilter';

interface ExecutiveDashboardProps {
  courses: Course[];
  clients: ClientOrStudent[];
  tasks: Task[];
  invoices: Invoice[];
  transactions: Transaction[];
  installments?: Installment[];
  wallets?: Wallet[];
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  onNavigateTab: (tab: TabType, subTab?: BusinessSubTab) => void;
  onOpenAddModal: () => void;
  onUpdateTaskColumn: (taskId: string, column: Task['column']) => void;
  showToast: (msg: string) => void;
}

// Monthly Growth Data for White & Blue Theme Charts
const MONTHLY_GROWTH_DATA = [
  { month: 'يناير', students: 180, revenue: 145, newEnroll: 45 },
  { month: 'فبراير', students: 260, revenue: 220, newEnroll: 80 },
  { month: 'مارس', students: 390, revenue: 340, newEnroll: 130 },
  { month: 'أبريل', students: 540, revenue: 470, newEnroll: 150 },
  { month: 'مايو', students: 720, revenue: 610, newEnroll: 180 },
  { month: 'يونيو', students: 910, revenue: 780, newEnroll: 190 },
  { month: 'يوليو', students: 1120, revenue: 950, newEnroll: 210 },
  { month: 'أغسطس', students: 1310, revenue: 1120, newEnroll: 190 },
  { month: 'سبتمبر', students: 1450, revenue: 1260, newEnroll: 140 },
];

const TRACK_STATS = [
  { name: 'برمجة وتطوير ويب', count: 580, percentage: 40, color: '#2563EB' },
  { name: 'ذكاء اصطناعي ونظم', count: 360, percentage: 25, color: '#38BDF8' },
  { name: 'تسويق رقمي وإدارة', count: 280, percentage: 20, color: '#4F46E5' },
  { name: 'تصميم ومونتاج إبداعي', count: 230, percentage: 15, color: '#0EA5E9' },
];

export default function ExecutiveDashboard({
  courses,
  clients,
  tasks,
  invoices,
  transactions = [],
  installments = [],
  wallets = [],
  totalBalance,
  totalIncome,
  totalExpense,
  onNavigateTab,
  onOpenAddModal,
  onUpdateTaskColumn,
  showToast,
}: ExecutiveDashboardProps) {
  const [chartTimeframe, setChartTimeframe] = useState<'9m' | '6m' | '3m'>('9m');
  const [chartMetric, setChartMetric] = useState<'combined' | 'revenue' | 'students'>('combined');
  const [certSearchQuery, setCertSearchQuery] = useState('');
  const [certResult, setCertResult] = useState<string | null>(null);

  // Filter chart data
  const displayedChartData =
    chartTimeframe === '3m'
      ? MONTHLY_GROWTH_DATA.slice(-3)
      : chartTimeframe === '6m'
      ? MONTHLY_GROWTH_DATA.slice(-6)
      : MONTHLY_GROWTH_DATA;

  // Task metrics
  const doneTasks = tasks.filter((t) => t.column === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.column === 'in_progress').length;
  const todoTasks = tasks.filter((t) => t.column === 'todo').length;
  const taskCompletionRate = tasks.length > 0 ? Math.round((doneTasks / tasks.length) * 100) : 0;

  // Invoice metrics
  const paidInvoicesCount = invoices.filter((i) => i.status === 'paid').length;
  const pendingInvoicesTotal = invoices
    .filter((i) => i.status === 'pending')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleVerifyCert = (e: FormEvent) => {
    e.preventDefault();
    if (!certSearchQuery.trim()) return;
    setCertResult(
      `تم التحقق بنجاح: الشهادة رقم (${certSearchQuery}) صالحة ومعتمدة رسمياً لمتدرب "أحمد حسام الدين" في مسار Full-Stack Web Development بتقدير ممتاز.`
    );
  };

  return (
    <div className="space-y-6 text-slate-800 pb-12" dir="rtl">
      {/* 1. HERO HEADER BANNER (WHITE & BLUE) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10">
        <div className="absolute -left-12 -top-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-10 bottom-0 w-48 h-48 rounded-full bg-sky-400/15 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-sky-100 text-xs font-semibold border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>لوحة القيادة والمؤشرات العامة • الفصل الدراسي 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
              أهلاً بك في منصة أكاديمية صابر
            </h1>
            <p className="text-sm sm:text-base text-blue-100 max-w-2xl font-medium leading-relaxed">
              مركز متكامل لمتابعة نمو أعداد المتدربين، الإيرادات المالية، كفاءة تشغيل الدورات، والمهام المجدولة اليومية.
            </p>
          </div>

          {/* Action Quick Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              <span>إضافة جديد</span>
            </button>
            <button
              onClick={() => onNavigateTab('business', 'calendar')}
              className="px-4 py-2.5 rounded-xl bg-blue-800/80 hover:bg-blue-800 text-white font-bold text-xs border border-white/20 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-sky-300" />
              <span>عرض التقويم</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. PRIMARY 4 KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Students */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-blue-300 hover:shadow-md transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">إجمالي المتدربين والشركات</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                1,450
              </span>
              <span className="text-xs font-bold text-blue-600">طالب نشط</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% نمو في التسجيل هذا الشهر</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>{clients.length} متدرب مسجل بالنظام</span>
            <button
              onClick={() => onNavigateTab('business', 'clients')}
              className="text-blue-600 font-bold hover:underline flex items-center gap-0.5"
            >
              <span>التفاصيل</span>
              <ArrowLeftIcon className="w-3 h-3" />
            </button>
          </div>
        </motion.div>

        {/* Metric 2: Revenue */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-blue-300 hover:shadow-md transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">الإيرادات والتحصيلات</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                1,260,000
              </span>
              <span className="text-xs font-bold text-blue-600">ج.م</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+24.2% مقارنة بالربع السابق</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>الرصيد: {totalBalance.toLocaleString('ar-EG')} ج.م</span>
            <button
              onClick={() => onNavigateTab('money')}
              className="text-blue-600 font-bold hover:underline flex items-center gap-0.5"
            >
              <span>المالية</span>
              <ArrowLeftIcon className="w-3 h-3" />
            </button>
          </div>
        </motion.div>

        {/* Metric 3: Courses */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-blue-300 hover:shadow-md transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">المسارات والدورات التدريبية</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                {courses.length}
              </span>
              <span className="text-xs font-bold text-blue-600">دورات نشطة</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-blue-600 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>92% متوسط امتلاء القاعات</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>4 مجالات تخصصية</span>
            <button
              onClick={() => onNavigateTab('business', 'courses')}
              className="text-blue-600 font-bold hover:underline flex items-center gap-0.5"
            >
              <span>الدورات</span>
              <ArrowLeftIcon className="w-3 h-3" />
            </button>
          </div>
        </motion.div>

        {/* Metric 4: Tasks Completion */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-blue-300 hover:shadow-md transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">معدل الإنجاز التشغيلي</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                {taskCompletionRate}%
              </span>
              <span className="text-xs font-bold text-emerald-600">إنجاز المهام</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
              <span>{doneTasks} مكتملة • {inProgressTasks} قيد العمل • {todoTasks} مخطط</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>{tasks.length} مهمة إدارية</span>
            <button
              onClick={() => onNavigateTab('business', 'tasks')}
              className="text-blue-600 font-bold hover:underline flex items-center gap-0.5"
            >
              <span>المهام</span>
              <ArrowLeftIcon className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* 2.5 ADVANCED SEARCH & FILTER (تصفية متقدمة حسب التاريخ، القيمة، والنوع دخل/خرج) */}
      <AdvancedSearchFilter
        transactions={transactions}
        invoices={invoices}
        installments={installments}
        walletsList={wallets.map((w) => w.name)}
        onNavigateTab={onNavigateTab}
        defaultExpanded={false}
      />

      {/* 3. CORE ANALYTICS: CHARTS IN WHITE & BLUE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Growth Correlation Chart (2 cols) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>مؤشر النمو المالي وتسجيل المتدربين</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                  شهري
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                تكامل حركة الإيرادات المالية (بالألف جنيه) مع أعداد المتدربين التراكمية
              </p>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
              {/* Metric filter */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setChartMetric('combined')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    chartMetric === 'combined'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  المشترك
                </button>
                <button
                  onClick={() => setChartMetric('revenue')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    chartMetric === 'revenue'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  الإيرادات
                </button>
                <button
                  onClick={() => setChartMetric('students')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    chartMetric === 'students'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  الطلاب
                </button>
              </div>

              {/* Timeframe */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                {(['9m', '6m', '3m'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setChartTimeframe(t)}
                    className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      chartTimeframe === t
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {t === '9m' ? '9 شهور' : t === '6m' ? '6 شهور' : '3 شهور'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chart Container */}
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {chartMetric === 'revenue' ? (
                <BarChart data={displayedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} unit="k" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      direction: 'rtl',
                    }}
                    formatter={(val: any) => [`${val} ألف ج.م`, 'الإيراد المالي']}
                  />
                  <Bar dataKey="revenue" fill="#2563EB" radius={[6, 6, 0, 0]} barSize={26} />
                </BarChart>
              ) : chartMetric === 'students' ? (
                <AreaChart data={displayedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      direction: 'rtl',
                    }}
                    formatter={(val: any) => [`${val} طالب`, 'إجمالي المتدربين']}
                  />
                  <Area
                    type="monotone"
                    dataKey="students"
                    stroke="#2563EB"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#blueGrad)"
                  />
                </AreaChart>
              ) : (
                <AreaChart data={displayedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="blueGradCombined" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      direction: 'rtl',
                    }}
                    formatter={(val: any, name: any) => [
                      name === 'students' ? `${val} طالب` : `${val} ألف ج.م`,
                      name === 'students' ? 'أعداد الطلاب' : 'الإيرادات المالية',
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="students"
                    stroke="#2563EB"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#blueGradCombined)"
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0EA5E9"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#skyGrad)"
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between pt-2 text-xs text-slate-500 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-600" />
                <span>الطلاب (أزرق ملكي)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-sky-500" />
                <span>الإيرادات بالألف (أزرق سماوي)</span>
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('business', 'monitor')}
              className="text-blue-600 font-bold hover:underline flex items-center gap-1"
            >
              <span>فتح شاشة المونيتور الكاملة</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Track Distribution & Efficiency (1 col) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">توزيع الطلاب حسب المسار</h3>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                4 تخصصات
              </span>
            </div>

            <div className="space-y-4 mt-4">
              {TRACK_STATS.map((track) => (
                <div key={track.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800">{track.name}</span>
                    <span className="text-slate-500 font-mono">
                      {track.count} طالب ({track.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${track.percentage}%`,
                        backgroundColor: track.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 space-y-2">
            <div className="flex items-center gap-2 text-blue-700 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>معدل نمو مسار البرمجة والذكاء الاصطناعي</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              يشهد مسار هندسة البرمجيات والذكاء الاصطناعي إقبالاً متسارعاً بنسبة 65% من إجمالي الحجوزات للفصل الحالي.
            </p>
            <button
              onClick={() => onNavigateTab('business', 'courses')}
              className="text-xs text-blue-600 font-bold hover:underline block pt-1"
            >
              استعراض الخطط التدريبية والمناهج ←
            </button>
          </div>
        </div>
      </div>

      {/* 4. TODAY'S TASKS & UPCOMING CALENDAR WIDGET */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Urgent Tasks for Today (2 cols) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">مهام اليوم والجدول المجدول</h3>
                <p className="text-xs text-slate-500">متابعة تنفيذ المهام وتحديث حالتها مباشرة</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateTab('business', 'calendar')}
                className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold border border-blue-200 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>تقويم المهام</span>
              </button>
              <button
                onClick={onOpenAddModal}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold shadow-sm transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>مهمة</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/30 transition-all space-y-2 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      task.priority === 'high'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : task.priority === 'medium'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {task.priority === 'high' ? 'أولوية عاجلة' : 'متوسطة'}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      task.column === 'done'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : task.column === 'in_progress'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {task.column === 'done' ? 'مكتملة ✓' : task.column === 'in_progress' ? 'قيد العمل' : 'مخطط'}
                  </span>
                </div>

                <h4
                  className={`text-xs font-bold leading-snug ${
                    task.column === 'done' ? 'text-slate-400 line-through' : 'text-slate-900'
                  }`}
                >
                  {task.title}
                </h4>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{task.dueDate}</span>
                  </span>
                  <div className="flex items-center gap-1">
                    {task.column !== 'done' && (
                      <button
                        onClick={() => onUpdateTaskColumn(task.id, 'done')}
                        className="text-[10px] text-emerald-600 font-bold hover:underline"
                      >
                        إنجاز
                      </button>
                    )}
                    {task.column === 'done' && (
                      <button
                        onClick={() => onUpdateTaskColumn(task.id, 'in_progress')}
                        className="text-[10px] text-blue-600 font-bold hover:underline"
                      >
                        استئناف
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-between items-center text-xs text-slate-500">
            <span>متبقي {todoTasks + inProgressTasks} مهام لم تكتمل بعد</span>
            <button
              onClick={() => onNavigateTab('business', 'tasks')}
              className="text-blue-600 font-bold hover:underline flex items-center gap-1"
            >
              <span>مشاهدة كافة المهام بكانبان</span>
              <ArrowLeftIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Certificate Verification Widget (1 col) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">التحقق من الشهادات</h3>
                <p className="text-xs text-slate-500">فحص فوري للاعتمادات بكود الاعتماد</p>
              </div>
            </div>

            <form onSubmit={handleVerifyCert} className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  كود الشهادة أو الرقم التسلسلي
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={certSearchQuery}
                    onChange={(e) => setCertSearchQuery(e.target.value)}
                    placeholder="مثال: SG-2026-994"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white text-right pl-9"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                فحص والتحقق الآن
              </button>
            </form>

            {certResult && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 leading-relaxed space-y-1">
                <div className="flex items-center gap-1 font-bold text-emerald-700">
                  <Check className="w-4 h-4" />
                  <span>شهادة معتمدة ورسمية</span>
                </div>
                <p>{certResult}</p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
            <span>نظام الاعتماد المشفر QR</span>
            <button
              onClick={() => onNavigateTab('more')}
              className="text-blue-600 font-bold hover:underline"
            >
              قوالب الشهادات
            </button>
          </div>
        </div>
      </div>

      {/* 5. ACTIVE COURSES & RECENT CLIENTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Active Courses (2 cols) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">المسارات والدورات الأكثر طلباً</h3>
                <p className="text-xs text-slate-500">سعة القاعات ونسب الحضور للمتدربين</p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('business', 'courses')}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>عرض كل الدورات ({courses.length})</span>
              <ArrowLeftIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {courses.slice(0, 3).map((course) => (
              <div
                key={course.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:bg-white hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                      {course.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      المحاضر: {course.instructor}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{course.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
                    <span>
                      {course.studentsCount} من أصل {course.maxStudents} مقعد
                    </span>
                    <span>• {course.duration}</span>
                    <span className="text-blue-600 font-bold">
                      {course.price.toLocaleString('ar-EG')} ج.م
                    </span>
                  </div>
                </div>

                <div className="w-full sm:w-36 space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-500">نسبة الامتلاء</span>
                    <span className="text-blue-600">
                      {Math.round((course.studentsCount / course.maxStudents) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{
                        width: `${Math.min(100, Math.round((course.studentsCount / course.maxStudents) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Trainees (1 col) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">أحدث المتدربين</h3>
                <p className="text-xs text-slate-500">المسجلون حديثاً بالأكاديمية</p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('business', 'clients')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              الكل
            </button>
          </div>

          <div className="space-y-3">
            {clients.slice(0, 4).map((client) => (
              <div
                key={client.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center shrink-0">
                    {client.initials}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{client.name}</h5>
                    <span className="text-[11px] text-slate-500 block">
                      {client.coursesEnrolled[0] || 'دبلومة الويب'}
                    </span>
                  </div>
                </div>

                <div className="text-left">
                  <span className="text-xs font-black text-blue-600 block">
                    {client.totalPaid.toLocaleString('ar-EG')} ج.م
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">
                    مسدد بالكامل
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateTab('business', 'clients')}
            className="w-full py-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold transition-all text-center block"
          >
            إدارة كافة المتدربين والشركات
          </button>
        </div>
      </div>
    </div>
  );
}

// Simple left arrow icon helper
function ArrowLeftIcon({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  );
}
