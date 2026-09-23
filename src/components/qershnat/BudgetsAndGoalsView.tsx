import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PieChart,
  Target,
  Plus,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Calendar,
  Wallet,
  X,
  Award,
} from 'lucide-react';
import { BudgetItem, GoalItem } from '../../types';

interface BudgetsAndGoalsViewProps {
  budgets: BudgetItem[];
  goals: GoalItem[];
  onAddBudget: (budget: Partial<BudgetItem>) => void;
  onAddGoal: (goal: Partial<GoalItem>) => void;
  onContributeGoal: (goalId: string, amount: number) => void;
  showToast: (msg: string) => void;
}

export default function BudgetsAndGoalsView({
  budgets,
  goals,
  onAddBudget,
  onAddGoal,
  onContributeGoal,
  showToast,
}: BudgetsAndGoalsViewProps) {
  const [activeTab, setActiveTab] = useState<'budgets' | 'goals'>('budgets');

  // New Budget Form Modal
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [budName, setBudName] = useState('');
  const [budCategory, setBudCategory] = useState('طعام ومشروبات');
  const [budLimit, setBudLimit] = useState('');
  const [budPeriod, setBudPeriod] = useState<'monthly' | 'weekly' | 'yearly'>('monthly');

  // New Goal Form Modal
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalCurrent, setGoalCurrent] = useState('0');
  const [goalDate, setGoalDate] = useState('');

  // Contribution Modal State
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [contribAmount, setContribAmount] = useState('');

  const handleCreateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!budName || !budLimit) {
      showToast('يرجى كتابة اسم الميزانية والحد الأقصى للإنفاق');
      return;
    }
    onAddBudget({
      name: budName,
      category: budCategory,
      maxLimit: parseFloat(budLimit),
      spentAmount: 0,
      currency: 'EGP',
      period: budPeriod,
    });
    setIsBudgetModalOpen(false);
    setBudName('');
    setBudLimit('');
    showToast('تمت إضافة الميزانية المحددة بنجاح');
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle || !goalTarget) {
      showToast('يرجى تحديد اسم الهدف والمبلغ المستهدف');
      return;
    }
    const target = parseFloat(goalTarget);
    const curr = parseFloat(goalCurrent) || 0;
    const progressPercent = target > 0 ? Math.min(100, Math.round((curr / target) * 100)) : 0;

    onAddGoal({
      title: goalTitle,
      targetAmount: target,
      currentAmount: curr,
      currency: 'EGP',
      progressPercent,
      targetDate: goalDate || '2026-12-31',
      category: 'ادخار واستثمار',
    });
    setIsGoalModalOpen(false);
    setGoalTitle('');
    setGoalTarget('');
    showToast('تم إضافة الهدف المالي الجديد بنجاح');
  };

  const handleContributeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalId || !contribAmount) return;
    onContributeGoal(selectedGoalId, parseFloat(contribAmount));
    setSelectedGoalId(null);
    setContribAmount('');
    showToast('تم تسجيل الادخار لصالح الهدف بنجاح');
  };

  return (
    <div className="space-y-5 pb-16" dir="rtl">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-800 via-indigo-900 to-slate-900 text-white shadow-lg border border-indigo-700/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.25),transparent_60%)] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                القائمة الثالثة
              </span>
              <span className="text-xs text-indigo-200">قرشنات • التخطيط والادخار</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-['Cairo',sans-serif]">
              الميزانيات والأهداف المالية (Budgets & Goals)
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              تحديد الحدود القصوى للإنفاق ومقارنة الفعلي بالمتبقي، بالإضافة إلى وضع الأهداف المستقبلية (شراء سيارة، منزل، سفر) وتتبع ونسبة الإنجاز.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBudgetModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition border border-white/20 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-indigo-300" />
              <span>ميزانية جديدة</span>
            </button>
            <button
              onClick={() => setIsGoalModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-black flex items-center gap-1.5 transition shadow-lg shadow-indigo-500/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>هدف مالـي جديد</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('budgets')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'budgets'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>ميزانيات الإنفاق القصوى ({budgets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('goals')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'goals'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>الأهداف المالية والادخارية ({goals.length})</span>
        </button>
      </div>

      {/* 1. BUDGETS SECTION */}
      {activeTab === 'budgets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((b) => {
            const spentPercent = Math.min(100, Math.round((b.spentAmount / b.maxLimit) * 100));
            const remaining = b.maxLimit - b.spentAmount;
            const isNearLimit = spentPercent >= 80;

            return (
              <div
                key={b.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
                    {b.period === 'monthly' ? 'ميزانية شهرية' : 'ميزانية أسبوعية'}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{b.category}</span>
                </div>

                <h3 className="text-base font-black text-slate-900">{b.name}</h3>

                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-600">
                      الإنفاق الفعلي: {b.spentAmount.toLocaleString('ar-EG')} ج.م
                    </span>
                    <span className="font-bold text-slate-900">الحد: {b.maxLimit.toLocaleString('ar-EG')} ج.م</span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        spentPercent >= 100
                          ? 'bg-rose-600'
                          : isNearLimit
                          ? 'bg-amber-500'
                          : 'bg-indigo-600'
                      }`}
                      style={{ width: `${spentPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] mt-2 font-['Cairo',sans-serif]">
                    <span className="text-slate-500">تم استهلاك {spentPercent}% من الميزانية</span>
                    <span className={remaining >= 0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                      {remaining >= 0 ? `متبقي: ${remaining.toLocaleString('ar-EG')} ج.م` : `تجاوزت بـ ${Math.abs(remaining).toLocaleString('ar-EG')} ج.م`}
                    </span>
                  </div>
                </div>

                {isNearLimit && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>تنبيه: أنت قريب جداً من استهلاك الحد الأقصى للميزانية!</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 2. GOALS SECTION */}
      {activeTab === 'goals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((g) => {
            const percent = g.progressPercent;
            return (
              <div
                key={g.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                      هدف ادخاري
                    </span>
                    <span className="text-xs text-slate-400">التاريخ المستهدف: {g.targetDate}</span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 mb-2 flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-600" />
                    {g.title}
                  </h3>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between my-3">
                    <div>
                      <span className="text-[11px] text-slate-400 block">المحتجز حالياً</span>
                      <span className="text-lg font-black text-emerald-600 font-['Cairo',sans-serif]">
                        {g.currentAmount.toLocaleString('ar-EG')} {g.currency}
                      </span>
                    </div>

                    <div className="text-left">
                      <span className="text-[11px] text-slate-400 block">المبلغ المستهدف</span>
                      <span className="text-sm font-bold text-slate-800 font-['Cairo',sans-serif]">
                        {g.targetAmount.toLocaleString('ar-EG')} {g.currency}
                      </span>
                    </div>
                  </div>

                  {/* Progress gauge */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1">
                      <span>نسبة التقدم</span>
                      <span className="text-indigo-600">{percent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-600 to-emerald-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">الفئة: {g.category}</span>
                  <button
                    onClick={() => setSelectedGoalId(g.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    + إضافة ادخار
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE BUDGET MODAL */}
      <AnimatePresence>
        {isBudgetModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200"
              dir="rtl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900">إنشاء ميزانية إنفاق محددة</h3>
                <button
                  onClick={() => setIsBudgetModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateBudget} className="space-y-4 mt-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">اسم الميزانية *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: ميزانية الطعام والشهريات"
                    value={budName}
                    onChange={(e) => setBudName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الحد الأقصى للإنفاق (ج.م) *</label>
                  <input
                    type="number"
                    required
                    placeholder="مثال: 15000"
                    value={budLimit}
                    onChange={(e) => setBudLimit(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">التصنيف</label>
                    <select
                      value={budCategory}
                      onChange={(e) => setBudCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                    >
                      <option value="طعام ومشروبات">طعام ومشروبات</option>
                      <option value="مواصلات وبنزين">مواصلات وبنزين</option>
                      <option value="فواتير واشتراكات">فواتير واشتراكات</option>
                      <option value="ترفيه وسفر">ترفيه وسفر</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">الفترة الزمنية</label>
                    <select
                      value={budPeriod}
                      onChange={(e) => setBudPeriod(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                    >
                      <option value="monthly">شهرياً</option>
                      <option value="weekly">أسبوعياً</option>
                      <option value="yearly">سنوياً</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm shadow-lg cursor-pointer"
                  >
                    إنشاء الميزانية
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE GOAL MODAL */}
      <AnimatePresence>
        {isGoalModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200"
              dir="rtl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900">إضافة هدف مالي جديد</h3>
                <button
                  onClick={() => setIsGoalModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateGoal} className="space-y-4 mt-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">اسم الهدف *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: شراء سيارة جديدة / مقدم شقة"
                    value={goalTitle}
                    onChange={(e) => setGoalTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">المبلغ المستهدف (ج.م) *</label>
                    <input
                      type="number"
                      required
                      placeholder="0.00"
                      value={goalTarget}
                      onChange={(e) => setGoalTarget(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">الموفر حالياً</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={goalCurrent}
                      onChange={(e) => setGoalCurrent(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">التاريخ المستهدف للتحقيق</label>
                  <input
                    type="date"
                    value={goalDate}
                    onChange={(e) => setGoalDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm shadow-lg cursor-pointer"
                  >
                    تثبيت الهدف المالي
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONTRIBUTE GOAL MODAL */}
      <AnimatePresence>
        {selectedGoalId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-200"
              dir="rtl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900">إضافة مبلغ للادخار</h3>
                <button
                  onClick={() => setSelectedGoalId(null)}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleContributeSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">المبلغ المضاف (ج.م) *</label>
                  <input
                    type="number"
                    required
                    placeholder="مثال: 5000"
                    value={contribAmount}
                    onChange={(e) => setContribAmount(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-bold"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg cursor-pointer"
                  >
                    تأكيد الإيداع لصالح الهدف
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
