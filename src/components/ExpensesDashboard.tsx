import React, { useState } from 'react';
import {
  TrendingDown,
  Plus,
  ArrowDownRight,
  Filter,
  Receipt,
  PieChart as PieChartIcon,
  Tag,
  Building2,
  Cpu,
  Megaphone,
  Coffee,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Transaction } from '../types';
import AdvancedSearchFilter from './AdvancedSearchFilter';

interface ExpensesDashboardProps {
  transactions: Transaction[];
  onAddExpense: (expense: Partial<Transaction>) => void;
  showToast: (msg: string) => void;
}

export default function ExpensesDashboard({
  transactions,
  onAddExpense,
  showToast,
}: ExpensesDashboardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New expense form state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('إيجار وتشغيل المقر');
  const [walletName, setWalletName] = useState('حساب بنكي CIB');

  // Filter only expenses
  const expenses = transactions.filter((t) => t.type === 'expense');

  // Categories and totals
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Categorized breakdown
  const categoryTotals: Record<string, number> = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#8b5cf6', '#ec4899'];

  // Monthly/Weekly Expense bar chart
  const barData = [
    { name: 'السبت', amount: 1200 },
    { name: 'الأحد', amount: 3500 },
    { name: 'الإثنين', amount: 800 },
    { name: 'الثلاثاء', amount: 4200 },
    { name: 'الأربعاء', amount: 2100 },
    { name: 'الخميس', amount: 6500 },
    { name: 'الجمعة', amount: 950 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) {
      showToast('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    onAddExpense({
      title,
      amount: parseFloat(amount),
      category,
      type: 'expense',
      walletName,
    });

    setTitle('');
    setAmount('');
    setIsModalOpen(false);
    showToast('تم تسجيل المصروف بنجاح ✓');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-rose-700 via-rose-600 to-red-500 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black">
                الداشبورد المالي للمصروفات
              </span>
              <span className="text-xs text-rose-100">تحليل النفقات والميزانيات التشغيلية</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">إدارة وتتبع المصروفات الشهرية</h1>
            <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-xl">
              مراقبة النفقات التشغيلية، إيجارات المقرات، عقود الاستضافة، وحملات التسويق بمرونة كاملة.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="self-start md:self-auto flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-rose-700 font-black text-xs sm:text-sm shadow-md hover:bg-rose-50 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>تسجيل مصروف جديد</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">إجمالي المصروفات</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {totalExpenses.toLocaleString()} <span className="text-xs font-medium text-slate-500">ج.م</span>
          </div>
          <span className="text-[11px] text-rose-600 font-bold mt-2 block">
            +12% مقارنة بالشهر السابق
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">نفقات التسويق والإعلانات</span>
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Megaphone className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {categoryTotals['تسويق وإعلانات ممولة']?.toLocaleString() || '18,500'}{' '}
            <span className="text-xs font-medium text-slate-500">ج.م</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">عائد الاستثمار التسويقي 4.2x</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">إيجار المقر والتجهيزات</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {categoryTotals['إيجار وتشغيل المقر']?.toLocaleString() || '8,500'}{' '}
            <span className="text-xs font-medium text-slate-500">ج.م</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-bold mt-2 block">مدفوع ومسدد بالكامل</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">السيرفرات والتقنية</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {categoryTotals['تكاليف تقنية وبرمجيات']?.toLocaleString() || '5,400'}{' '}
            <span className="text-xs font-medium text-slate-500">ج.م</span>
          </div>
          <span className="text-[11px] text-blue-600 font-bold mt-2 block">3 خدمات سحابية نشطة</span>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart: Daily Expenses */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h2 className="text-sm font-black text-slate-800 mb-1">
            معدل المصروفات خلال الأسبوع الجاري
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            توزيع النفقات اليومية على مدار الأيام الماضية
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
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
                <Bar dataKey="amount" name="المصروف (ج.م)" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Expenses by Category */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-800 mb-1">
              توزيع المصروفات حسب التصنيف
            </h2>
            <p className="text-xs text-slate-500 mb-4">النسبة المئوية لكل بند في ميزانية الأكاديمية</p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData.length > 0 ? pieData : [{ name: 'تشغيل', value: 8500 }, { name: 'تقنية', value: 3200 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {Object.entries(categoryTotals).slice(0, 3).map(([cat, val], idx) => (
              <div key={cat} className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  {cat}
                </span>
                <span className="font-bold text-slate-800">{val.toLocaleString()} ج.م</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expenses Ledger & History with Advanced Filtering */}
      <AdvancedSearchFilter
        transactions={expenses}
        categoriesList={Object.keys(categoryTotals)}
        defaultExpanded={true}
      />

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-black text-slate-900 text-base">تسجيل مصروف جديد</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  عنوان / وصف المصروف
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: فاتورة كهرباء المقر، شراء مستلزمات..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">المبلغ (ج.م)</label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">التصنيف</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  <option value="إيجار وتشغيل المقر">إيجار وتشغيل المقر</option>
                  <option value="تكاليف تقنية وبرمجيات">تكاليف تقنية وبرمجيات</option>
                  <option value="تسويق وإعلانات ممولة">تسويق وإعلانات ممولة</option>
                  <option value="مكافآت ومدربين">مكافآت ومدربين</option>
                  <option value="ضيافة ونثريات">ضيافة ونثريات</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">المحفظة المسحوب منها</label>
                <select
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  <option value="الحساب البنكي الرئيسي (CIB)">الحساب البنكي الرئيسي (CIB)</option>
                  <option value="محفظة فودافون كاش & إنستاباي">محفظة فودافون كاش & إنستاباي</option>
                  <option value="الخزينة النقدية (مقر الأكاديمية)">الخزينة النقدية (المقر)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  حفظ المصروف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
