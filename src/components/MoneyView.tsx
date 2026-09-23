import { useState } from 'react';
import { motion } from 'motion/react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Wallet as WalletIcon,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Target,
  Plus,
  Building2,
  Smartphone,
  Coins,
  CheckCircle2,
  GraduationCap,
  DollarSign,
  Activity,
  BarChart3,
  Percent,
} from 'lucide-react';
import { Wallet, Transaction, MoneySubTab } from '../types';
import AdvancedSearchFilter from './AdvancedSearchFilter';

// Financial & Student Growth Correlation Data
const FINANCIAL_MONITOR_DATA = [
  { month: 'يناير', income: 145000, incomeK: 145, expense: 62000, netProfit: 83000, students: 180 },
  { month: 'فبراير', income: 220000, incomeK: 220, expense: 85000, netProfit: 135000, students: 260 },
  { month: 'مارس', income: 340000, incomeK: 340, expense: 110000, netProfit: 230000, students: 390 },
  { month: 'أبريل', income: 470000, incomeK: 470, expense: 140000, netProfit: 330000, students: 540 },
  { month: 'مايو', income: 610000, incomeK: 610, expense: 175000, netProfit: 435000, students: 720 },
  { month: 'يونيو', income: 780000, incomeK: 780, expense: 210000, netProfit: 570000, students: 910 },
  { month: 'يوليو', income: 950000, incomeK: 950, expense: 245000, netProfit: 705000, students: 1120 },
  { month: 'أغسطس', income: 1120000, incomeK: 1120, expense: 280000, netProfit: 840000, students: 1310 },
  { month: 'سبتمبر', income: 1260000, incomeK: 1260, expense: 310000, netProfit: 950000, students: 1450 },
];

interface MoneyViewProps {
  wallets: Wallet[];
  transactions: Transaction[];
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  searchQuery: string;
  onOpenAddModal: () => void;
  showToast: (msg: string) => void;
}

export default function MoneyView({
  wallets,
  transactions,
  totalBalance,
  totalIncome,
  totalExpense,
  searchQuery,
  onOpenAddModal,
  showToast,
}: MoneyViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<MoneySubTab>('wallets');
  const [txFilter, setTxFilter] = useState<'all' | 'income' | 'expense' | 'transfer'>('all');
  const [reportTimeframe, setReportTimeframe] = useState<'3m' | '6m' | '9m'>('9m');
  const [chartViewMode, setChartViewMode] = useState<'both' | 'students' | 'cashflow'>('both');

  const tabs = [
    { id: 'wallets' as MoneySubTab, label: 'المحافظ والحسابات', icon: WalletIcon },
    { id: 'transactions' as MoneySubTab, label: 'سجل المعاملات', icon: Coins },
    { id: 'reports' as MoneySubTab, label: 'المونيتور والتقارير المالية', icon: TrendingUp },
    { id: 'goals' as MoneySubTab, label: 'الأهداف التوسعية', icon: Target },
  ];

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.title.includes(searchQuery) ||
      t.category.includes(searchQuery) ||
      t.walletName.includes(searchQuery);
    const matchesType = txFilter === 'all' || t.type === txFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Distinctive Segmented Menu */}
      <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200/80 rounded-2xl overflow-x-auto scrollbar-none shadow-xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. WALLETS TAB */}
      {activeSubTab === 'wallets' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700">
              حسابات ومحافظ الأكاديمية
            </h3>
            <button
              onClick={onOpenAddModal}
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm shadow-blue-500/20 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>تسجيل حركة</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {wallets.map((w) => (
              <div
                key={w.id}
                className="relative overflow-hidden rounded-2xl p-4 bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all shadow-xs group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    {w.type === 'bank' && <Building2 className="w-4 h-4" />}
                    {w.type === 'instapay' && <Smartphone className="w-4 h-4" />}
                    {w.type === 'cash' && <Coins className="w-4 h-4" />}
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                    {w.badge}
                  </span>
                </div>

                <span className="text-[11px] text-slate-500 block mb-0.5">
                  {w.typeLabel}
                </span>
                <h4 className="text-xs font-bold text-slate-900 mb-2 line-clamp-1">
                  {w.name}
                </h4>

                <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                  <span className="text-xl font-black text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                    {w.balance.toLocaleString('ar-EG')}
                  </span>
                  <span className="text-xs font-bold text-blue-600">{w.currency}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Transfer / Action Bar */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/60">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="text-xs text-slate-700 font-medium">
                جميع الحسابات متصلة بالخزينة الرئيسية ومحدثة لحظياً
              </p>
            </div>
            <button
              onClick={() => showToast('جاري استخراج تقرير الحسابات المعتمد...')}
              className="px-3.5 py-1.5 rounded-xl bg-white text-blue-600 border border-blue-200 text-xs font-bold hover:bg-blue-50 shadow-xs transition-all cursor-pointer"
            >
              تصدير كشف حساب PDF
            </button>
          </div>
        </div>
      )}

      {/* 2. TRANSACTIONS TAB */}
      {activeSubTab === 'transactions' && (
        <div className="space-y-4">
          {/* Advanced Search & Filtering Component */}
          <AdvancedSearchFilter
            transactions={transactions}
            walletsList={wallets.map((w) => w.name)}
            defaultExpanded={true}
          />
        </div>
      )}

      {/* 3. REPORTS & FINANCIAL MONITOR TAB */}
      {activeSubTab === 'reports' && (
        <div className="space-y-4">
          {/* Header & Controls Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>المونيتور المالي ومؤشرات نمو الطلاب</span>
                  <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200/60">
                    مباشر Recharts
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  تحليل التدفقات النقدية والأرباح الصافية ومدى ارتباطها المباشر بازدياد تسجيل المتدربين
                </p>
              </div>
            </div>

            {/* Timeframe Filter */}
            <div className="flex items-center gap-1.5 self-stretch sm:self-auto justify-end">
              <span className="text-slate-500 text-xs hidden sm:inline ml-1">الفترة:</span>
              {[
                { id: '3m', label: 'آخر 3 شهور' },
                { id: '6m', label: 'آخر 6 شهور' },
                { id: '9m', label: 'كامل العام (9 شهور)' },
              ].map((tf) => (
                <button
                  key={tf.id}
                  onClick={() => setReportTimeframe(tf.id as any)}
                  className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    reportTimeframe === tf.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-blue-600'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4 Financial KPIs Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-[10px] text-slate-500 block mb-1">
                إجمالي تحصيلات الطلاب
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-emerald-600 font-['Plus_Jakarta_Sans',sans-serif]">
                  5,895,000
                </span>
                <span className="text-xs font-bold text-slate-400">ج.م</span>
              </div>
              <span className="text-[10px] text-emerald-600 mt-1 block font-semibold">
                +22.1% نمو الإيراد التراكمي
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-[10px] text-slate-500 block mb-1">
                إجمالي النفقات التشغيلية
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-rose-600 font-['Plus_Jakarta_Sans',sans-serif]">
                  1,407,000
                </span>
                <span className="text-xs font-bold text-slate-400">ج.م</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                رواتب مدربين + سيرفرات وتجهيز
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-[10px] text-slate-500 block mb-1">
                صافي الأرباح المحققة
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-blue-600 font-['Plus_Jakarta_Sans',sans-serif]">
                  4,488,000
                </span>
                <span className="text-xs font-bold text-blue-600">ج.م</span>
              </div>
              <span className="text-[10px] text-emerald-600 mt-1 block font-semibold">
                هامش ربح صافي: 76.1%
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-[10px] text-slate-500 block mb-1">
                إجمالي الطلاب المسجلين
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-amber-500 font-['Plus_Jakarta_Sans',sans-serif]">
                  1,450
                </span>
                <span className="text-xs font-bold text-slate-400">طالب نشط</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                متوسط العائد: 4,065 ج.م/طالب
              </span>
            </div>
          </div>

          {/* Interactive Recharts Financial & Students Chart */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-blue-600" />
                  <span>مخطط المونيتور: تدفق الإيرادات وتزامنها مع نمو الطلاب المسجلين</span>
                </h4>
                <span className="text-[10px] text-slate-500">
                  تتبع شهري تفاعلي يوضح تضاعف الإيراد مع صعود أعداد المتدربين في برامج الأكاديمية
                </span>
              </div>

              {/* Chart Mode Buttons */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
                {[
                  { id: 'both', label: 'مخطط شامل (إيراد + طلاب)' },
                  { id: 'cashflow', label: 'السيولة والأرباح' },
                  { id: 'students', label: 'نمو الطلاب فقط' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setChartViewMode(mode.id as any)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      chartViewMode === mode.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts Chart */}
            <div className="w-full h-80 pt-2" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={
                    reportTimeframe === '3m'
                      ? FINANCIAL_MONITOR_DATA.slice(-3)
                      : reportTimeframe === '6m'
                      ? FINANCIAL_MONITOR_DATA.slice(-6)
                      : FINANCIAL_MONITOR_DATA
                  }
                  margin={{ top: 15, right: 15, left: 15, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="finIncomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.85} />
                      <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.25} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />

                  {/* Left Y-Axis for Financials in Thousands */}
                  {(chartViewMode === 'both' || chartViewMode === 'cashflow') && (
                    <YAxis
                      yAxisId="fin"
                      orientation="left"
                      stroke="#2563EB"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickFormatter={(val) => `${val}K`}
                    />
                  )}

                  {/* Right Y-Axis for Students */}
                  {(chartViewMode === 'both' || chartViewMode === 'students') && (
                    <YAxis
                      yAxisId="students"
                      orientation={chartViewMode === 'both' ? 'right' : 'left'}
                      stroke="#F59E0B"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickFormatter={(val) => `${val}`}
                    />
                  )}

                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-white/95 border border-slate-200 backdrop-blur-md p-3 rounded-2xl shadow-xl text-right min-w-[200px]" dir="rtl">
                            <p className="text-xs font-black text-slate-900 mb-2 pb-1 border-b border-slate-100">
                              شهر {label}
                            </p>
                            <div className="space-y-1.5 text-[11px]">
                              <div className="flex items-center justify-between text-slate-600">
                                <span className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                                  <span>إجمالي التحصيل:</span>
                                </span>
                                <span className="font-black text-blue-600 font-['Plus_Jakarta_Sans',sans-serif]">
                                  {d.income.toLocaleString('ar-EG')} ج.م
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-slate-600">
                                <span className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                  <span>صافي الأرباح:</span>
                                </span>
                                <span className="font-bold text-emerald-600 font-['Plus_Jakarta_Sans',sans-serif]">
                                  {d.netProfit.toLocaleString('ar-EG')} ج.م
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-100">
                                <span className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                                  <span>إجمالي الطلاب:</span>
                                </span>
                                <span className="font-bold text-amber-500 font-['Plus_Jakarta_Sans',sans-serif]">
                                  {d.students.toLocaleString('ar-EG')} طالب
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  <Legend
                    verticalAlign="top"
                    height={36}
                    formatter={(value) => {
                      if (value === 'incomeK') return <span className="text-slate-600 text-xs font-semibold mr-1 ml-3">إجمالي الإيرادات (آلاف ج.م)</span>;
                      if (value === 'students') return <span className="text-slate-600 text-xs font-semibold mr-1 ml-3">عدد الطلاب المسجلين</span>;
                      return value;
                    }}
                  />

                  {/* Financial Bar */}
                  {(chartViewMode === 'both' || chartViewMode === 'cashflow') && (
                    <Bar
                      yAxisId="fin"
                      dataKey="incomeK"
                      name="incomeK"
                      fill="url(#finIncomeGrad)"
                      radius={[6, 6, 0, 0]}
                      barSize={24}
                    />
                  )}

                  {/* Student Growth Line */}
                  {(chartViewMode === 'both' || chartViewMode === 'students') && (
                    <Line
                      yAxisId="students"
                      type="monotone"
                      dataKey="students"
                      name="students"
                      stroke="#F59E0B"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#F59E0B', stroke: '#FFFFFF', strokeWidth: 1.5 }}
                      activeDot={{ r: 7, fill: '#D97706' }}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribution by Category & Payment Channel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-900 block">
                توزيع إيرادات الدورات التدريبية المعتمدة
              </span>

              <div className="space-y-2.5">
                {[
                  { name: 'دبلومة تطوير تطبيقات الويب المتكاملة', percent: 45, amount: 2450000, color: 'bg-blue-600' },
                  { name: 'ماستر كلاس الذكاء الاصطناعي والنظم', percent: 28, amount: 1620000, color: 'bg-sky-500' },
                  { name: 'التسويق الرقمي وإدارة الحملات', percent: 18, amount: 1180000, color: 'bg-indigo-600' },
                  { name: 'تصميم واجهات المستخدم والمونتاج', percent: 9, amount: 645000, color: 'bg-teal-500' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-700 font-medium">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-mono text-[10px]">{item.amount.toLocaleString('ar-EG')} ج.م</span>
                        <span className="font-bold text-slate-900">{item.percent}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`${item.color} h-full rounded-full`}
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-900 block">
                قنوات التحصيل النقدي لرسوم المتدربين
              </span>

              <div className="space-y-2.5">
                {[
                  { channel: 'إنستاباي (InstaPay)', percent: 48, label: 'التحويل اللحظي الأكثر استخداماً', color: 'bg-blue-600' },
                  { channel: 'الحساب البنكي التجاري الدولي (CIB)', percent: 32, label: 'التحويلات الكبرى والشركات', color: 'bg-indigo-600' },
                  { channel: 'فودافون كاش ومحافظ المحمول', percent: 20, label: 'الدفع المباشر للطلاب', color: 'bg-sky-500' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-bold text-slate-900">{item.channel}</span>
                      <span className="font-black text-blue-600">{item.percent}%</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mb-1.5">{item.label}</span>
                    <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`${item.color} h-full rounded-full`}
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. GOALS TAB */}
      {activeSubTab === 'goals' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700">
              الأهداف الاستراتيجية والتوسعية
            </h3>
            <button
              onClick={() => showToast('تم تسجيل الهدف بنجاح')}
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm shadow-blue-500/20 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>هدف جديد</span>
            </button>
          </div>

          <div className="space-y-3">
            {[
              {
                title: 'تجهيز معمل حواسيب الذكاء الاصطناعي (Lab 2)',
                target: 120000,
                current: 85000,
                deadline: 'أكتوبر 2026',
              },
              {
                title: 'إطلاق منصة التعليم التفاعلي والشهادات المشفرة',
                target: 60000,
                current: 45000,
                deadline: 'نوفمبر 2026',
              },
            ].map((goal, idx) => {
              const progress = Math.round((goal.current / goal.target) * 100);
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2.5"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 mb-0.5">
                        {goal.title}
                      </h4>
                      <span className="text-[10px] text-slate-500">
                        الموعد المستهدف: {goal.deadline}
                      </span>
                    </div>
                    <span className="text-xs font-black text-blue-600">
                      {progress}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-sky-500 h-full rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>المحقق: {goal.current.toLocaleString('ar-EG')} ج.م</span>
                    <span>الهدف: {goal.target.toLocaleString('ar-EG')} ج.م</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
