import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  MessageSquareText,
  Mic,
  Scan,
  Coins,
  Calculator,
  TrendingUp,
  BarChart2,
  PieChart as PieIcon,
  Sparkles,
  Send,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Wallet as WalletIcon,
  Activity,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import { Transaction, Wallet } from '../../types';

interface SmartToolsAnalyticsViewProps {
  wallets: Wallet[];
  transactions: Transaction[];
  onAddTransaction: (tx: Partial<Transaction>) => void;
  showToast: (msg: string) => void;
}

const EXPENSE_COLORS = [
  '#dc2626', // Red
  '#ea580c', // Orange
  '#d97706', // Amber
  '#7c3aed', // Purple
  '#2563eb', // Blue
  '#0891b2', // Cyan
  '#e11d48', // Rose
  '#059669', // Emerald
];

const INCOME_COLORS = [
  '#059669', // Emerald
  '#0284c7', // Sky Blue
  '#16a34a', // Green
  '#0d9488', // Teal
  '#2563eb', // Blue
  '#8b5cf6', // Violet
];

// Custom Recharts Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl text-xs font-['Cairo',sans-serif] border border-slate-700 space-y-1">
        {label && <p className="font-bold text-purple-300 border-b border-slate-800 pb-1 mb-1.5">{label}</p>}
        {payload.map((entry: any, index: number) => {
          const val = typeof entry.value === 'number' ? entry.value.toLocaleString('ar-EG') : entry.value;
          return (
            <div key={`item-${index}`} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: entry.color || entry.fill }} />
                <span className="text-slate-300 font-medium">{entry.name}:</span>
              </div>
              <span className="font-bold text-white font-['Cairo',sans-serif]">{val} ج.م</span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

export default function SmartToolsAnalyticsView({
  wallets,
  transactions,
  onAddTransaction,
  showToast,
}: SmartToolsAnalyticsViewProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'assistant' | 'sms' | 'zakat'>('analytics');
  const [timeframe, setTimeframe] = useState<'all' | 'month' | 'week'>('all');

  // 1. AI Assistant Chat state
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; text: string; actionData?: any }>>([
    {
      role: 'ai',
      text: 'أهلاً بك! أنا مساعد قرشنات الذكي 🤖. يمكنك كتابة مصروفك (مثلاً: "صرفت 250 ج.م غداء مع الأصدقاء كاش")، أو رفع صورة فاتورة، أو طرح أسئلة تحليلية عن إجمالي مصاريفك هذا الشهر!',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isSimulatingOcr, setIsSimulatingOcr] = useState(false);

  // 2. SMS Helper state
  const [smsText, setSmsText] = useState(
    'تم خصم مبلغ 450.00 ج.م من حسابك لدى البنك الأهلي المصري عبر InstaPay لصالح سوبرماركت الفرجاني بتاريخ 2026/09/20 الساعة 14:30'
  );

  // 3. Zakat Calculator state
  const [gold24Grams, setGold24Grams] = useState('0');
  const [gold21Grams, setGold21Grams] = useState('50');
  const [gold24Price, setGold24Price] = useState('4200'); // EGP per gram
  const [silverGrams, setSilverGrams] = useState('0');
  const [silverPrice, setSilverPrice] = useState('50');
  const [deductibleDebts, setDeductibleDebts] = useState('10000');

  // Assistant Message Send Handler
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      let aiReply = 'فهمت طلبك! تم تسجيل وتحليل البيانات في حساباتك بقرشنات.';

      if (userMsg.includes('صرفت') || userMsg.includes('دفعت') || userMsg.includes('اشتريت')) {
        aiReply = `💡 استخرجت عملية جديدة من رسالتك:
• المبلغ: 250 ج.م
• التصنيف: طعام ومشروبات
• المحفظة: المحفظة النقدية
هل ترغب بتأكيد وحفظ هذه العملية في المحافظ؟`;
      } else if (userMsg.includes('إجمالي') || userMsg.includes('تقرير') || userMsg.includes('كم')) {
        aiReply = `📊 بناءً على سجلات قرشنات لهذا الشهر:
• إجمالي المصروفات: 14,250 ج.م
• إجمالي الإيرادات: 35,000 ج.م
• أعلى تصنيف استهلاكاً: فواتير واشتراكات (38%).`;
      }

      setMessages((prev) => [...prev, { role: 'ai', text: aiReply }]);
    }, 800);
  };

  // Simulate Invoice OCR
  const handleSimulateInvoiceOcr = () => {
    setIsSimulatingOcr(true);
    setTimeout(() => {
      setIsSimulatingOcr(false);
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: `🧾 تم المسح الضوئي وتحليل الفاتورة بنجاح:
• اسم المطبوع: كارفور مصر (Carrefour)
• البنود: 4 منتجات تموينية
• الإجمالي النهائي: 680.50 ج.م
• التاريخ: 2026-09-21
تمت إضافة الفاتورة كمرفق وسنُسجل العملية تلقائياً.`,
        },
      ]);
      showToast('تم استخراج بيانات الفاتورة بنجاح');
    }, 1500);
  };

  // SMS Parser Handler
  const handleParseSMS = () => {
    const isExpense = smsText.includes('خصم') || smsText.includes('سحب') || smsText.includes('شراء');
    const amountMatch = smsText.match(/(\d+(\.\d+)?)\s*(ج\.م|EGP|\$)/i) || smsText.match(/مبلغ\s*(\d+(\.\d+)?)/);
    const parsedAmount = amountMatch ? parseFloat(amountMatch[1]) : 450;

    onAddTransaction({
      title: 'معاملة مستخرجة من البنك (SMS)',
      description: smsText,
      amount: parsedAmount,
      currency: 'EGP',
      type: isExpense ? 'expense' : 'income',
      category: 'فواتير واشتراكات',
      walletName: 'حساب إنستاباي (InstaPay)',
      date: new Date().toISOString().split('T')[0],
    });

    showToast('تم تحويل نص الرسالة إلى عملية مسجلة بالمحفظة!');
  };

  // Zakat Calculations
  const cashTotal = wallets.reduce((acc, w) => acc + w.balance, 0);
  const g24Grams = parseFloat(gold24Grams) || 0;
  const g21Grams = parseFloat(gold21Grams) || 0;
  const g24P = parseFloat(gold24Price) || 4200;
  const totalGoldValue = g24Grams * g24P + g21Grams * (21 / 24) * g24P;
  const totalSilverValue = (parseFloat(silverGrams) || 0) * (parseFloat(silverPrice) || 50);
  const debtsToDeduct = parseFloat(deductibleDebts) || 0;

  const totalWealth = cashTotal + totalGoldValue + totalSilverValue - debtsToDeduct;
  const nisabValue = 85 * g24P; // 85 grams of 24k gold
  const isNisabReached = totalWealth >= nisabValue;
  const zakatAmount = isNisabReached ? totalWealth * 0.025 : 0;

  // --------------------------------------------------------------------------
  // DYNAMIC RECHARTS DATA PREPARATION
  // --------------------------------------------------------------------------

  const filteredTransactions = useMemo(() => {
    if (timeframe === 'all') return transactions;

    const now = new Date();
    return transactions.filter((tx) => {
      if (!tx.date) return true;
      const txDate = new Date(tx.date);
      if (isNaN(txDate.getTime())) return true;

      if (timeframe === 'month') {
        return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
      }
      if (timeframe === 'week') {
        const diffDays = (now.getTime() - txDate.getTime()) / (1000 * 3600 * 24);
        return diffDays <= 7;
      }
      return true;
    });
  }, [transactions, timeframe]);

  // Total Income & Total Expenses
  const totalIncome = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [filteredTransactions]);

  const totalExpense = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [filteredTransactions]);

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 0;

  // 1. Expense Breakdown by Category for PieChart
  const expenseChartData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const cat = t.category || 'أخرى';
        map[cat] = (map[cat] || 0) + t.amount;
      });

    const items = Object.entries(map).map(([name, value]) => ({ name, value }));

    // Fallback data if no expenses match filter
    if (items.length === 0) {
      return [
        { name: 'طعام ومشروبات', value: 8500 },
        { name: 'فواتير واشتراكات', value: 5200 },
        { name: 'تكاليف تشغيل وتجهيزات', value: 8500 },
        { name: 'مواصلات وبنزين', value: 2400 },
        { name: 'تسوق وملابس', value: 3100 },
      ];
    }
    return items;
  }, [filteredTransactions]);

  const totalExpenseInChart = useMemo(() => {
    return expenseChartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [expenseChartData]);

  // 2. Income Breakdown by Category for PieChart
  const incomeChartData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredTransactions
      .filter((t) => t.type === 'income')
      .forEach((t) => {
        const cat = t.category || 'أخرى';
        map[cat] = (map[cat] || 0) + t.amount;
      });

    const items = Object.entries(map).map(([name, value]) => ({ name, value }));

    // Fallback data if no income match filter
    if (items.length === 0) {
      return [
        { name: 'إيرادات دورات تدريبية', value: 13500 },
        { name: 'تدريب مؤسسات', value: 14000 },
        { name: 'راتب واستشارات', value: 25000 },
        { name: 'تحويلات وأرباح', value: 8000 },
      ];
    }
    return items;
  }, [filteredTransactions]);

  const totalIncomeInChart = useMemo(() => {
    return incomeChartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [incomeChartData]);

  // 3. Daily / Cashflow Trend for AreaChart
  const cashflowTrendData = useMemo(() => {
    // Generate weekly or recent days timeline
    const daysMap: Record<string, { income: number; expense: number }> = {
      'السبت': { income: 3500, expense: 850 },
      'الأحد': { income: 14000, expense: 2100 },
      'الإثنين': { income: 2000, expense: 1450 },
      'الثلاثاء': { income: 8500, expense: 3200 },
      'الأربعاء': { income: 12000, expense: 1900 },
      'الخميس': { income: 4500, expense: 8500 },
      'الجمعة': { income: 1000, expense: 1200 },
    };

    // Calculate actual dates if present
    filteredTransactions.forEach((tx) => {
      const dayName = tx.date?.includes('سبت') ? 'السبت'
        : tx.date?.includes('أحد') ? 'الأحد'
        : tx.date?.includes('إثنين') ? 'الإثنين'
        : tx.date?.includes('ثلاثاء') ? 'الثلاثاء'
        : tx.date?.includes('أربعاء') ? 'الأربعاء'
        : tx.date?.includes('خميس') ? 'الخميس'
        : tx.date?.includes('جمعة') ? 'الجمعة' : null;

      if (dayName && daysMap[dayName]) {
        if (tx.type === 'income') daysMap[dayName].income += tx.amount;
        if (tx.type === 'expense') daysMap[dayName].expense += tx.amount;
      }
    });

    return Object.entries(daysMap).map(([day, data]) => ({
      day,
      income: data.income,
      expense: data.expense,
      net: data.income - data.expense,
    }));
  }, [filteredTransactions]);

  // 4. Wallet Balances Distribution for BarChart
  const walletDistributionData = useMemo(() => {
    if (!wallets || wallets.length === 0) {
      return [
        { name: 'الخزينة النقدية', balance: 14500 },
        { name: 'حساب CIB', balance: 42000 },
        { name: 'فودافون كاش', balance: 18500 },
        { name: 'إنستاباي', balance: 29000 },
      ];
    }
    return wallets.map((w) => ({
      name: w.name,
      balance: w.balance,
      limit: w.creditLimit || 0,
      type: w.typeLabel,
    }));
  }, [wallets]);

  // Handle Export Report summary
  const handleExportReport = () => {
    const reportText = `📊 **تقرير قرشنات المالي والتحليلات** 📊
• إجمالي الدخل الإجمالي: ${totalIncome.toLocaleString('ar-EG')} ج.م
• إجمالي المصروفات: ${totalExpense.toLocaleString('ar-EG')} ج.م
• صافي الوفر / الادخار: ${netSavings.toLocaleString('ar-EG')} ج.م
• معدل الادخار الإجمالي: ${savingsRate}%
• أعلى تصنيف مصروفات: ${expenseChartData[0]?.name || 'عام'}
تم توليد التقرير بواسطة تطبيق قرشنات (Qershnat).`;

    navigator.clipboard?.writeText(reportText);
    showToast('تم نسخ ملخص التقرير المالي إلى الحافظة بنجاح! 📋');
  };

  return (
    <div className="space-y-5 pb-16" dir="rtl">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-lg border border-purple-700/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.25),transparent_60%)] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-400/30">
                القائمة السادسة
              </span>
              <span className="text-xs text-purple-200">قرشنات • الذكاء الاصطناعي والتحليلات</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-['Cairo',sans-serif]">
              التقارير المالية والرسوم البيانية (Recharts Analytics)
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              رسوم بيانية تفاعلية بمكتبة Recharts لتوزيع الدخل والمصروفات، والتدفق النقدي، والأرصدة، بالإضافة للمساعد الذكي وحاسبة الزكاة.
            </p>
          </div>

          <button
            onClick={handleExportReport}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 border border-white/20 shadow-sm transition cursor-pointer self-start md:self-auto"
          >
            <Download className="w-4 h-4 text-purple-300" />
            <span>تصدير التقرير المالي</span>
          </button>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-purple-700 text-white shadow-md shadow-purple-700/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>التقارير والرسوم البيانية (Recharts)</span>
        </button>

        <button
          onClick={() => setActiveTab('assistant')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'assistant'
              ? 'bg-purple-700 text-white shadow-md shadow-purple-700/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>مساعد قرشنات الذكي 🤖</span>
        </button>

        <button
          onClick={() => setActiveTab('sms')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'sms'
              ? 'bg-purple-700 text-white shadow-md shadow-purple-700/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MessageSquareText className="w-4 h-4" />
          <span>مستكشف الرسائل (SMS Parser)</span>
        </button>

        <button
          onClick={() => setActiveTab('zakat')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'zakat'
              ? 'bg-purple-700 text-white shadow-md shadow-purple-700/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>حاسبة الزكاة الشرعية</span>
        </button>
      </div>

      {/* 1. RECHARTS FINANCIAL REPORTS & ANALYTICS VIEW */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Timeframe Filter Bar */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Filter className="w-4 h-4 text-purple-600" />
              <span>تصفية النطاق الزمني للتقارير:</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setTimeframe('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  timeframe === 'all'
                    ? 'bg-purple-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                جميع الفترات
              </button>
              <button
                onClick={() => setTimeframe('month')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  timeframe === 'month'
                    ? 'bg-purple-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                الشهر الحالي
              </button>
              <button
                onClick={() => setTimeframe('week')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  timeframe === 'week'
                    ? 'bg-purple-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                آخر 7 أيام
              </button>
            </div>
          </div>

          {/* Quick Metrics KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-3xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-950 flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-700 font-bold block mb-1">إجمالي الدخل الإيرادي</span>
                <span className="text-xl font-black font-['Cairo',sans-serif]">
                  {totalIncome.toLocaleString('ar-EG')} ج.م
                </span>
                <span className="text-[10px] text-emerald-600 block mt-1">
                  +{incomeChartData.length} تصنيفات دخل مسجلة
                </span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <ArrowDownLeft className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-rose-50/80 border border-rose-200/80 text-rose-950 flex items-center justify-between">
              <div>
                <span className="text-xs text-rose-700 font-bold block mb-1">إجمالي المصروفات والنفقات</span>
                <span className="text-xl font-black font-['Cairo',sans-serif]">
                  {totalExpense.toLocaleString('ar-EG')} ج.م
                </span>
                <span className="text-[10px] text-rose-600 block mt-1">
                  {expenseChartData.length} فئات استهلاك
                </span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-indigo-50/80 border border-indigo-200/80 text-indigo-950 flex items-center justify-between">
              <div>
                <span className="text-xs text-indigo-700 font-bold block mb-1">صافي الوفر / الفائض</span>
                <span className="text-xl font-black font-['Cairo',sans-serif]">
                  {netSavings.toLocaleString('ar-EG')} ج.م
                </span>
                <span className="text-[10px] text-indigo-600 block mt-1">
                  {netSavings >= 0 ? '✓ فائض إيجابي بحسابك' : '⚠ تنبيه: عجز مالي'}
                </span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                <Coins className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-purple-50/80 border border-purple-200/80 text-purple-950 flex items-center justify-between">
              <div>
                <span className="text-xs text-purple-700 font-bold block mb-1">معدل الادخار المالي</span>
                <span className="text-xl font-black font-['Cairo',sans-serif]">{savingsRate}%</span>
                <span className="text-[10px] text-purple-600 block mt-1">
                  من إجمالي الدخل الوارد
                </span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md">
                <Activity className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* RECHARTS SECTION 1: EXPENSE & INCOME DISTRIBUTION CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. EXPENSES DISTRIBUTION PIE CHART */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <PieIcon className="w-5 h-5 text-rose-600" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">توزيع المصروفات حسب التصنيف</h3>
                    <p className="text-[11px] text-slate-500">نسبة واستهلاك كل فئة نفقات من إجمالي المصروفات</p>
                  </div>
                </div>
                <span className="text-xs font-black text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 font-['Cairo',sans-serif]">
                  {totalExpenseInChart.toLocaleString('ar-EG')} ج.م
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={3}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {expenseChartData.map((entry, index) => (
                        <Cell key={`expense-cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Expense Legend List */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                {expenseChartData.map((item, idx) => {
                  const pct = totalExpenseInChart > 0 ? ((item.value / totalExpenseInChart) * 100).toFixed(1) : '0';
                  return (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-1.5 truncate">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: EXPENSE_COLORS[idx % EXPENSE_COLORS.length] }}
                        />
                        <span className="font-bold text-slate-800 truncate">{item.name}</span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 font-['Cairo',sans-serif]">
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. INCOME DISTRIBUTION PIE CHART */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <PieIcon className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">توزيع الدخل والإيرادات حسب الفئة</h3>
                    <p className="text-[11px] text-slate-500">مصادر المداخيل والتدفقات الماليّة الواردة</p>
                  </div>
                </div>
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-['Cairo',sans-serif]">
                  {totalIncomeInChart.toLocaleString('ar-EG')} ج.م
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incomeChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={3}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {incomeChartData.map((entry, index) => (
                        <Cell key={`income-cell-${index}`} fill={INCOME_COLORS[index % INCOME_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Income Legend List */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                {incomeChartData.map((item, idx) => {
                  const pct = totalIncomeInChart > 0 ? ((item.value / totalIncomeInChart) * 100).toFixed(1) : '0';
                  return (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-1.5 truncate">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: INCOME_COLORS[idx % INCOME_COLORS.length] }}
                        />
                        <span className="font-bold text-slate-800 truncate">{item.name}</span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 font-['Cairo',sans-serif]">
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RECHARTS SECTION 2: CASHFLOW TREND & WALLET BALANCES */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 3. CASHFLOW COMPARISON AREA CHART */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">تحليل التدفق النقدي (دخل vs مصروف)</h3>
                    <p className="text-[11px] text-slate-500">مقارنة حركة الإيرادات اليومية بالمصروفات الأسبوعية</p>
                  </div>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cashflowTrendData}>
                    <defs>
                      <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#dc2626" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="income"
                      name="الدخل الإجمالي"
                      stroke="#059669"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#incomeGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="expense"
                      name="المصروفات"
                      stroke="#dc2626"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#expenseGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 4. WALLET BALANCES BAR CHART */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <WalletIcon className="w-5 h-5 text-purple-600" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">توزيع السيولة والأرصدة حسب المحفظة</h3>
                    <p className="text-[11px] text-slate-500">مقارنة السيولة المتوفرة في جميع حساباتك</p>
                  </div>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={walletDistributionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" stroke="#64748b" fontSize={11} />
                    <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} width={100} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="balance" name="الرصيد المتاح" fill="#7c3aed" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SMART ASSISTANT CHAT & OCR */}
      {activeTab === 'assistant' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="text-base font-black text-slate-900">دردشة مساعد قرشنات الذكي</h3>
            </div>

            <button
              onClick={handleSimulateInvoiceOcr}
              disabled={isSimulatingOcr}
              className="px-3.5 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold flex items-center gap-1.5 hover:bg-purple-100 transition cursor-pointer"
            >
              <Scan className="w-4 h-4 text-purple-600" />
              <span>{isSimulatingOcr ? 'جاري قراءة الفاتورة...' : 'مسح ضوئي للفاتورة (OCR)'}</span>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="h-80 overflow-y-auto space-y-3 p-3 bg-slate-50/70 rounded-2xl border border-slate-200">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2 text-xs ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-md font-sans whitespace-pre-wrap leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-purple-600 text-white rounded-br-none shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="أكتب مصروفاً أو استفساراً..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              onClick={() => showToast('المساعد يستمع لإدخالك الصوتي...')}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              title="إدخال صوتي"
            >
              <Mic className="w-4 h-4" />
            </button>

            <button
              onClick={handleSendMessage}
              className="p-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white transition shadow-md shadow-purple-600/20 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. SMS PARSER HELPER */}
      {activeTab === 'sms' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div>
            <h3 className="text-base font-black text-slate-900">مستكشف الرسائل النصية للبنوك (SMS Parser)</h3>
            <p className="text-xs text-slate-500">
              انسخ إشعار البنك أو المحفظة الإلكترونية (فودافون كاش، إنستاباي، البنك الأهلي، CIB) لتحويلها بضغطة زر إلى عملية مسجلة.
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">نص الرسالة النصية (SMS)</label>
            <textarea
              rows={4}
              value={smsText}
              onChange={(e) => setSmsText(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleParseSMS}
              className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>استخراج وتحويل العملية تلقائياً</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. ISLAMIC ZAKAT CALCULATOR */}
      {activeTab === 'zakat' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900">حاسبة الزكاة الشرعية (Zakat Calculator)</h3>
            <p className="text-xs text-slate-500">
              حساب الزكاة المستحقة (2.5%) بناءً على السيولة بالمحافظ، الذهب عيار 24 و 21 والفضة، ومقارنتها بالنصاب الشرعي.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-purple-900">أولاً: مدخلات الأصول والذهب</h4>

              <div>
                <label className="text-xs text-slate-600 block mb-1">السيولة بالمحافظ النقدية والبنكية</label>
                <input
                  type="number"
                  disabled
                  value={cashTotal}
                  className="w-full p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-600 block mb-1">جرامات ذهب عيار 24</label>
                  <input
                    type="number"
                    value={gold24Grams}
                    onChange={(e) => setGold24Grams(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 block mb-1">جرامات ذهب عيار 21</label>
                  <input
                    type="number"
                    value={gold21Grams}
                    onChange={(e) => setGold21Grams(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-600 block mb-1">سعر جرام ذهب 24 (ج.م)</label>
                  <input
                    type="number"
                    value={gold24Price}
                    onChange={(e) => setGold24Price(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 block mb-1">ديون مستحقة السداد (تُخصم)</label>
                  <input
                    type="number"
                    value={deductibleDebts}
                    onChange={(e) => setDeductibleDebts(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="p-5 rounded-3xl bg-slate-900 text-white flex flex-col justify-between space-y-4 font-['Cairo',sans-serif]">
              <div>
                <span className="text-xs text-purple-300 font-bold block mb-1">نتائج حساب الزكاة</span>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">صافي الثروة الخاضعة للزكاة:</span>
                    <span className="font-bold text-slate-100">{totalWealth.toLocaleString('ar-EG')} ج.م</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">النصاب الشرعي (85 جم ذهب 24):</span>
                    <span className="font-bold text-amber-400">{nisabValue.toLocaleString('ar-EG')} ج.م</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">حالة بلوغ النصاب والحول:</span>
                    <span className={`font-bold ${isNisabReached ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {isNisabReached ? '✓ بلغ النصاب الشرعي' : 'لم يبلغ النصاب بعد'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-950/80 p-4 rounded-2xl border border-emerald-500/30">
                <span className="text-xs text-emerald-300 block font-bold">مبلغ الزكاة الواجب إخراجها (2.5%)</span>
                <span className="text-2xl font-black text-emerald-400">
                  {zakatAmount.toLocaleString('ar-EG')} ج.م
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
