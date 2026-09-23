import { useState } from 'react';
import {
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  Scale,
  Wallet,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Download,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Transaction, Wallet as WalletType } from '../types';
import AdvancedSearchFilter from './AdvancedSearchFilter';

interface CashflowDashboardProps {
  transactions: Transaction[];
  wallets: WalletType[];
}

export default function CashflowDashboard({
  transactions,
  wallets,
}: CashflowDashboardProps) {
  const [timeline, setTimeline] = useState<'month' | 'quarter'>('month');

  // Calculations
  const incomeTxs = transactions.filter((t) => t.type === 'income');
  const expenseTxs = transactions.filter((t) => t.type === 'expense');

  const totalIn = incomeTxs.reduce((acc, curr) => acc + curr.amount, 0);
  const totalOut = expenseTxs.reduce((acc, curr) => acc + curr.amount, 0);
  const netCashflow = totalIn - totalOut;
  const totalLiquidity = wallets.reduce((acc, curr) => acc + curr.balance, 0);

  // Cashflow timeline chart data
  const cashflowTimelineData = [
    { name: '1 سبتمبر', in: 18000, out: 8500, net: 9500 },
    { name: '5 سبتمبر', in: 15000, out: 3200, net: 11800 },
    { name: '8 سبتمبر', in: 24000, out: 4100, net: 19900 },
    { name: '12 سبتمبر', in: 32000, out: 7800, net: 24200 },
    { name: '16 سبتمبر', in: 28000, out: 5400, net: 22600 },
    { name: '20 سبتمبر', in: 39000, out: 6200, net: 32800 },
  ];

  // Liquidity by wallet
  const walletLiquidityData = wallets.map((w) => ({
    name: w.name.split(' ')[0] + ' ' + (w.name.split(' ')[1] || ''),
    balance: w.balance,
  }));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-emerald-700 via-emerald-600 to-teal-500 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black">
                داشبورد التدفقات النقدية (داخل وخارج)
              </span>
              <span className="text-xs text-emerald-100">تحليل ميزان المدفوعات والسيولة الفورية</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">ميزان الداخل والخارج وصافي التدفق</h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
              رؤية تحليلية متقدمة لحركة السيولة الصافية ومقارنة المقبوضات الشهرية بالنفقات اللحظية.
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center">
            <span className="text-xs text-emerald-100 font-bold block">صافي السيولة النقدية الحالية</span>
            <span className="text-2xl font-black text-white">{netCashflow.toLocaleString()} ج.م</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total In */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">إجمالي المقبوضات (داخل)</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">
            +{totalIn.toLocaleString()} <span className="text-xs font-medium text-slate-500">ج.م</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-bold mt-2 block">
            تدفقات دورات ورسوم تسجيل
          </span>
        </div>

        {/* Total Out */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">إجمالي المدفوعات (خارج)</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600">
            -{totalOut.toLocaleString()} <span className="text-xs font-medium text-slate-500">ج.م</span>
          </div>
          <span className="text-[11px] text-rose-600 font-bold mt-2 block">
            تكاليف ومصاريف تشغيل
          </span>
        </div>

        {/* Net Ratio */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">معدل الفائض المالي</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {totalIn > 0 ? Math.round(((totalIn - totalOut) / totalIn) * 100) : 0}%
          </div>
          <span className="text-[11px] text-blue-600 font-bold mt-2 block">
            هامش أمان نقدي ممتاز
          </span>
        </div>

        {/* Total Liquidity */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">الرصيد المتاح بجميع الحسابات</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {totalLiquidity.toLocaleString()}{' '}
            <span className="text-xs font-medium text-slate-500">ج.م</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">موزعة على 3 محافظ وخزائن</span>
        </div>
      </div>

      {/* Main Dual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* In vs Out Comparison Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-black text-slate-800">
                مقارنة المقبوضات (داخل) بالنفقات (خارج)
              </h2>
              <p className="text-xs text-slate-500">المسار الزمني لحجم السيولة الواردة والصادرة</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                المقبوضات
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-rose-600">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                المصروفات
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashflowTimelineData}>
                <defs>
                  <linearGradient id="incomeColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="expenseColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    textAlign: 'right',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="in"
                  name="المقبوضات (داخل)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#incomeColor)"
                />
                <Area
                  type="monotone"
                  dataKey="out"
                  name="المصروفات (خارج)"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#expenseColor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Liquidity by Wallet bar chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-800 mb-1">
              السيولة المتوفرة حسب المحفظة
            </h2>
            <p className="text-xs text-slate-500 mb-4">الأرصدة الحالية الجاهزة للاستخدام</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={walletLiquidityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    textAlign: 'right',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="balance" name="الرصيد (ج.م)" fill="#0284c7" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
            <span>إجمالي الاحتياطي النقدي:</span>
            <span className="text-blue-700 text-sm font-black">
              {totalLiquidity.toLocaleString()} ج.م
            </span>
          </div>
        </div>
      </div>

      {/* Detailed In & Out Ledger with Advanced Filter */}
      <AdvancedSearchFilter
        transactions={transactions}
        walletsList={wallets.map((w) => w.name)}
        defaultExpanded={true}
      />
    </div>
  );
}
