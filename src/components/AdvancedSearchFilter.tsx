import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Check,
  TrendingUp,
  TrendingDown,
  Clock,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import { Transaction, Invoice, Installment, TabType, BusinessSubTab } from '../types';

export interface AdvancedFilterState {
  keyword: string;
  type: 'all' | 'income' | 'expense';
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
  category: string;
  wallet: string;
  datePreset: 'all' | 'today' | 'this_month' | 'last_30_days' | 'custom';
}

interface AdvancedSearchProps {
  transactions: Transaction[];
  invoices?: Invoice[];
  installments?: Installment[];
  walletsList?: string[];
  categoriesList?: string[];
  onNavigateTab?: (tab: TabType, subTab?: BusinessSubTab) => void;
  className?: string;
  defaultExpanded?: boolean;
}

export default function AdvancedSearchFilter({
  transactions,
  invoices = [],
  installments = [],
  walletsList,
  categoriesList,
  onNavigateTab,
  className = '',
  defaultExpanded = false,
}: AdvancedSearchProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Filters state
  const [filters, setFilters] = useState<AdvancedFilterState>({
    keyword: '',
    type: 'all',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    category: 'all',
    wallet: 'all',
    datePreset: 'all',
  });

  // Extract available unique wallets and categories if not supplied
  const availableWallets = useMemo(() => {
    if (walletsList && walletsList.length > 0) return walletsList;
    const set = new Set<string>();
    transactions.forEach((t) => {
      if (t.walletName) set.add(t.walletName);
    });
    return Array.from(set);
  }, [transactions, walletsList]);

  const availableCategories = useMemo(() => {
    if (categoriesList && categoriesList.length > 0) return categoriesList;
    const set = new Set<string>();
    transactions.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set);
  }, [transactions, categoriesList]);

  // Handle Preset Date Ranges
  const handleDatePreset = (preset: AdvancedFilterState['datePreset']) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    if (preset === 'all') {
      setFilters((prev) => ({ ...prev, datePreset: 'all', startDate: '', endDate: '' }));
    } else if (preset === 'today') {
      setFilters((prev) => ({
        ...prev,
        datePreset: 'today',
        startDate: todayStr,
        endDate: todayStr,
      }));
    } else if (preset === 'this_month') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
        .toISOString()
        .split('T')[0];
      setFilters((prev) => ({
        ...prev,
        datePreset: 'this_month',
        startDate: firstDay,
        endDate: todayStr,
      }));
    } else if (preset === 'last_30_days') {
      const priorDate = new Date();
      priorDate.setDate(today.getDate() - 30);
      const priorDateStr = priorDate.toISOString().split('T')[0];
      setFilters((prev) => ({
        ...prev,
        datePreset: 'last_30_days',
        startDate: priorDateStr,
        endDate: todayStr,
      }));
    } else {
      setFilters((prev) => ({ ...prev, datePreset: 'custom' }));
    }
  };

  // Reset Filters
  const handleReset = () => {
    setFilters({
      keyword: '',
      type: 'all',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
      category: 'all',
      wallet: 'all',
      datePreset: 'all',
    });
  };

  // Active filters count for badge indicator
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.keyword.trim()) count++;
    if (filters.type !== 'all') count++;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    if (filters.minAmount) count++;
    if (filters.maxAmount) count++;
    if (filters.category !== 'all') count++;
    if (filters.wallet !== 'all') count++;
    return count;
  }, [filters]);

  // Main Filtering Engine
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // 1. Keyword search (title, category, wallet, id)
      if (filters.keyword.trim()) {
        const query = filters.keyword.trim().toLowerCase();
        const matchesTitle = tx.title.toLowerCase().includes(query);
        const matchesCategory = tx.category.toLowerCase().includes(query);
        const matchesWallet = tx.walletName.toLowerCase().includes(query);
        const matchesId = tx.id.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCategory && !matchesWallet && !matchesId) {
          return false;
        }
      }

      // 2. Type filter (income / expense)
      if (filters.type !== 'all' && tx.type !== filters.type) {
        return false;
      }

      // 3. Amount range filter
      if (filters.minAmount !== '') {
        const minVal = parseFloat(filters.minAmount);
        if (!isNaN(minVal) && tx.amount < minVal) {
          return false;
        }
      }
      if (filters.maxAmount !== '') {
        const maxVal = parseFloat(filters.maxAmount);
        if (!isNaN(maxVal) && tx.amount > maxVal) {
          return false;
        }
      }

      // 4. Date range filter (supports YYYY-MM-DD comparisons)
      if (filters.startDate) {
        if (tx.date < filters.startDate) {
          return false;
        }
      }
      if (filters.endDate) {
        if (tx.date > filters.endDate) {
          return false;
        }
      }

      // 5. Category filter
      if (filters.category !== 'all' && tx.category !== filters.category) {
        return false;
      }

      // 6. Wallet filter
      if (filters.wallet !== 'all' && tx.walletName !== filters.wallet) {
        return false;
      }

      return true;
    });
  }, [transactions, filters]);

  // Aggregate stats for the filtered dataset
  const stats = useMemo(() => {
    let incomeSum = 0;
    let expenseSum = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    filteredTransactions.forEach((tx) => {
      if (tx.type === 'income') {
        incomeSum += tx.amount;
        incomeCount++;
      } else if (tx.type === 'expense') {
        expenseSum += tx.amount;
        expenseCount++;
      }
    });

    return {
      totalCount: filteredTransactions.length,
      incomeSum,
      expenseSum,
      netSum: incomeSum - expenseSum,
      incomeCount,
      expenseCount,
    };
  }, [filteredTransactions]);

  return (
    <div
      id="advanced-search-section"
      className={`bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-all ${className}`}
      dir="rtl"
    >
      {/* Top Bar: Quick Search + Filters Toggle Button */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                البحث والتصفية المتقدمة في لوحة التحكم
              </h3>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black">
                  {activeFiltersCount} فلتر مفعّل
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              تصفية دقيقة بناءً على التاريخ، نطاق القيمة المالية، أو نوع الحركة (دخل / خرج).
            </p>
          </div>
        </div>

        {/* Quick Keyword Input + Toggle button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={filters.keyword}
              onChange={(e) => setFilters((prev) => ({ ...prev, keyword: e.target.value }))}
              placeholder="ابحث بالاسم، التصنيف، أو الخزينة..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl py-2 px-3 pl-8 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all"
            />
            {filters.keyword ? (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, keyword: '' }))}
                className="absolute left-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            )}
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              isExpanded || activeFiltersCount > 0
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>معايير التصفية</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>

          {activeFiltersCount > 0 && (
            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all cursor-pointer"
              title="إعادة ضبط الفلاتر"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded Filter Panel */}
      {isExpanded && (
        <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-100 space-y-4 animate-in fade-in duration-150">
          {/* 1. Primary Filter Criteria Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Criteria A: Movement Type (All / Income / Expense) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <span>نوع الحركة المالية</span>
              </label>
              <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setFilters((p) => ({ ...p, type: 'all' }))}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                    filters.type === 'all'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  الكل
                </button>
                <button
                  type="button"
                  onClick={() => setFilters((p) => ({ ...p, type: 'income' }))}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                    filters.type === 'income'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  <ArrowDownLeft className="w-3 h-3" />
                  <span>دخل (+)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFilters((p) => ({ ...p, type: 'expense' }))}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                    filters.type === 'expense'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-rose-700 hover:bg-rose-50'
                  }`}
                >
                  <ArrowUpRight className="w-3 h-3" />
                  <span>خرج (-)</span>
                </button>
              </div>
            </div>

            {/* Criteria B: Date Range Quick Presets & Start Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>من تاريخ (البداية)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">YYYY-MM-DD</span>
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, startDate: e.target.value, datePreset: 'custom' }))
                }
                className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl py-1.5 px-2.5 text-xs text-slate-800 focus:outline-none"
              />
            </div>

            {/* Criteria C: End Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>إلى تاريخ (النهاية)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">YYYY-MM-DD</span>
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, endDate: e.target.value, datePreset: 'custom' }))
                }
                className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl py-1.5 px-2.5 text-xs text-slate-800 focus:outline-none"
              />
            </div>

            {/* Criteria D: Amount Range (Min - Max) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                  <span>نطاق القيمة (ج.م)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">من - إلى</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <input
                  type="number"
                  placeholder="الحد الأدنى"
                  value={filters.minAmount}
                  onChange={(e) => setFilters((p) => ({ ...p, minAmount: e.target.value }))}
                  className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl py-1.5 px-2.5 text-xs text-slate-800 focus:outline-none text-left"
                  dir="ltr"
                />
                <input
                  type="number"
                  placeholder="الحد الأقصى"
                  value={filters.maxAmount}
                  onChange={(e) => setFilters((p) => ({ ...p, maxAmount: e.target.value }))}
                  className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl py-1.5 px-2.5 text-xs text-slate-800 focus:outline-none text-left"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* 2. Secondary Row: Presets + Categories + Wallets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 border-t border-slate-200/60">
            {/* Date Quick Presets */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>فترات زمنية جاهزة</span>
              </label>
              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'all' as const, label: 'الكل' },
                  { id: 'today' as const, label: 'اليوم' },
                  { id: 'this_month' as const, label: 'هذا الشهر' },
                  { id: 'last_30_days' as const, label: 'آخر 30 يوم' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleDatePreset(item.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                      filters.datePreset === item.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Dropdown Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">التصنيف المحاسبي</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}
                className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl py-1.5 px-2.5 text-xs text-slate-800 focus:outline-none"
              >
                <option value="all">جميع التصنيفات</option>
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Wallet Dropdown Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">الخزينة أو المحفظة</label>
              <select
                value={filters.wallet}
                onChange={(e) => setFilters((p) => ({ ...p, wallet: e.target.value }))}
                className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl py-1.5 px-2.5 text-xs text-slate-800 focus:outline-none"
              >
                <option value="all">جميع الخزائن والمحافظ</option>
                {availableWallets.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 3. Live Filter Results Summary Banner */}
      <div className="bg-slate-50/80 px-4 sm:px-6 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <span>النتائج المطابقة:</span>
            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-black">
              {stats.totalCount} حركة
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>المقبوضات (دخل):</span>
            <span className="font-black">+{stats.incomeSum.toLocaleString('ar-EG')} ج.م</span>
            <span className="text-[10px] text-slate-400">({stats.incomeCount})</span>
          </div>

          <div className="flex items-center gap-1.5 text-rose-700 font-bold">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>المصروفات (خرج):</span>
            <span className="font-black">-{stats.expenseSum.toLocaleString('ar-EG')} ج.م</span>
            <span className="text-[10px] text-slate-400">({stats.expenseCount})</span>
          </div>

          <div className="flex items-center gap-1.5 font-bold">
            <span>صافي الحركة:</span>
            <span
              className={`font-black ${
                stats.netSum >= 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {stats.netSum >= 0 ? '+' : ''}
              {stats.netSum.toLocaleString('ar-EG')} ج.م
            </span>
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <button
            onClick={handleReset}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>إلغاء وتصفية الكل</span>
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* 4. Filtered Data Results Table / Feed */}
      <div className="overflow-x-auto max-h-96 overflow-y-auto divide-y divide-slate-100">
        {filteredTransactions.length === 0 ? (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <Search className="w-8 h-8 mx-auto text-slate-300 opacity-60" />
            <p className="text-xs font-bold text-slate-600">لا توجد حركات تطابق معايير البحث المحددة</p>
            <p className="text-[11px] text-slate-400">
              جرّب توسيع نطاق التاريخ، أو تقليل قيود القيمة المالية، أو اختيار خيار "الكل".
            </p>
            <button
              onClick={handleReset}
              className="mt-2 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 border border-blue-200 cursor-pointer"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        ) : (
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold sticky top-0 z-10 border-b border-slate-100">
              <tr>
                <th className="p-3">البيان / المعاملة</th>
                <th className="p-3">النوع</th>
                <th className="p-3">التاريخ</th>
                <th className="p-3">التصنيف</th>
                <th className="p-3">الخزينة</th>
                <th className="p-3 text-left">القيمة المالية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-blue-50/40 transition-colors group"
                  >
                    <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isIncome
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50'
                            : 'bg-rose-50 text-rose-600 border border-rose-200/50'
                        }`}
                      >
                        {isIncome ? (
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div>
                        <span>{tx.title}</span>
                        <span className="text-[10px] text-slate-400 block font-normal">
                          كود: {tx.id}
                        </span>
                      </div>
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          isIncome
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isIncome ? 'دخل (إيراد)' : 'خرج (مصروف)'}
                      </span>
                    </td>

                    <td className="p-3 text-slate-600 font-mono text-[11px]">{tx.date}</td>

                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {tx.category}
                      </span>
                    </td>

                    <td className="p-3 text-slate-600 text-[11px]">{tx.walletName}</td>

                    <td
                      className={`p-3 text-left font-black text-sm ${
                        isIncome ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {tx.amount.toLocaleString('ar-EG')} ج.م
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* 5. Footer Details with Quick Jump to Related Dashboards */}
      {onNavigateTab && (
        <div className="p-3 bg-slate-50/90 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-500">
            تحديث فوري متزامن مع كافة سجلات الخزائن والأقساط
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('cashflow')}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-300 font-bold text-[11px] transition-all cursor-pointer"
            >
              ميزان الداخل والخارج
            </button>
            <button
              onClick={() => onNavigateTab('expenses')}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-300 font-bold text-[11px] transition-all cursor-pointer"
            >
              داشبورد المصروفات
            </button>
            <button
              onClick={() => onNavigateTab('installments')}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-300 font-bold text-[11px] transition-all cursor-pointer"
            >
              جدول الأقساط
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
