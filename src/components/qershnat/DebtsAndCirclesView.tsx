import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CreditCard,
  Users,
  Calculator,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Phone,
  DollarSign,
  Calendar,
  FileCheck,
  Upload,
  User,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  PieChart,
} from 'lucide-react';
import { DebtItem, MoneyCircle, Installment } from '../../types';

interface DebtsAndCirclesViewProps {
  debts: DebtItem[];
  installments: Installment[];
  circles: MoneyCircle[];
  onAddDebt: (debt: Partial<DebtItem>) => void;
  onAddCircle: (circle: Partial<MoneyCircle>) => void;
  onPayInstallment: (id: string) => void;
  showToast: (msg: string) => void;
}

export default function DebtsAndCirclesView({
  debts,
  installments,
  circles,
  onAddDebt,
  onAddCircle,
  onPayInstallment,
  showToast,
}: DebtsAndCirclesViewProps) {
  const [activeTab, setActiveTab] = useState<'debts' | 'installments' | 'circles'>('debts');

  // New Debt Form
  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);
  const [debtPerson, setDebtPerson] = useState('');
  const [debtPhone, setDebtPhone] = useState('');
  const [debtAmount, setDebtAmount] = useState('');
  const [debtDirection, setDebtDirection] = useState<'receivable' | 'payable'>('receivable');
  const [debtDueDate, setDebtDueDate] = useState('');

  // New Money Circle Form
  const [isCircleModalOpen, setIsCircleModalOpen] = useState(false);
  const [circleName, setCircleName] = useState('');
  const [circleMonthlyAmount, setCircleMonthlyAmount] = useState('');
  const [circleTotalShares, setCircleTotalShares] = useState('10');
  const [circleMyTurn, setCircleMyTurn] = useState('الشهر الثالث');

  // Installment Calculator Sandbox
  const [calcTotalLoan, setCalcTotalLoan] = useState('120000');
  const [calcMonths, setCalcMonths] = useState('12');
  const [calcInterestRate, setCalcInterestRate] = useState('10');

  const calcMonthlyInstallment = () => {
    const principal = parseFloat(calcTotalLoan) || 0;
    const months = parseInt(calcMonths) || 1;
    const interest = parseFloat(calcInterestRate) || 0;
    const totalWithInterest = principal * (1 + interest / 100);
    return Math.round(totalWithInterest / months);
  };

  const handleCreateDebt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debtPerson || !debtAmount) {
      showToast('يرجى إدخال اسم الشخص والمبلغ');
      return;
    }
    onAddDebt({
      personName: debtPerson,
      phone: debtPhone,
      totalAmount: parseFloat(debtAmount),
      paidAmount: 0,
      currency: 'EGP',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: debtDueDate || '2026-12-31',
      direction: debtDirection,
      status: 'pending',
    });
    setIsDebtModalOpen(false);
    setDebtPerson('');
    setDebtAmount('');
    showToast('تم إضافة سجل الدين بنجاح');
  };

  const handleCreateCircle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!circleName || !circleMonthlyAmount) {
      showToast('يرجى كتابة اسم الجمعية والمبلغ الشهري');
      return;
    }
    const monthlyNum = parseFloat(circleMonthlyAmount);
    const sharesNum = parseInt(circleTotalShares) || 10;
    const totalPayout = monthlyNum * sharesNum;

    onAddCircle({
      name: circleName,
      monthlyAmount: monthlyNum,
      totalPayout,
      totalShares: sharesNum,
      currency: 'EGP',
      startDate: new Date().toISOString().split('T')[0],
      myTurnMonth: circleMyTurn,
      status: 'active',
      members: [
        { id: 'm1', name: 'أحمد محمود', turnNumber: 1, payoutMonth: 'الشهر 1', isPaidCurrentMonth: true },
        { id: 'm2', name: 'محمد علي', turnNumber: 2, payoutMonth: 'الشهر 2', isPaidCurrentMonth: true },
        { id: 'm3', name: 'أنت (مقبوض)', turnNumber: 3, payoutMonth: circleMyTurn, isPaidCurrentMonth: false },
        { id: 'm4', name: 'سامح حسن', turnNumber: 4, payoutMonth: 'الشهر 4', isPaidCurrentMonth: false },
      ],
    });
    setIsCircleModalOpen(false);
    setCircleName('');
    setCircleMonthlyAmount('');
    showToast('تمت إضافة الجمعية بنجاح');
  };

  const totalReceivables = debts
    .filter((d) => d.direction === 'receivable')
    .reduce((acc, d) => acc + (d.totalAmount - d.paidAmount), 0);

  const totalPayables = debts
    .filter((d) => d.direction === 'payable')
    .reduce((acc, d) => acc + (d.totalAmount - d.paidAmount), 0);

  return (
    <div className="space-y-5 pb-16" dir="rtl">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 text-white shadow-lg border border-amber-600/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.25),transparent_60%)] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-400/30">
                القائمة الثانية
              </span>
              <span className="text-xs text-amber-200">قرشنات • الالتزامات والأقساط</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-['Cairo',sans-serif]">
              الديون، الأقساط، والجمعيات (Debts & Installments)
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              إدارة مستحقاتك لدى الآخرين، التزاماتك المالية، حاسبة ومخطط الأقساط الممتدة حتى 1200 قسط، وتنظيم الجمعيات الشهرية بأدوار القبض.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDebtModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition shadow-lg shadow-amber-500/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل دين/قرض</span>
            </button>
            <button
              onClick={() => setIsCircleModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition border border-white/20 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>إنشاء جمعية جديدة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500">أموال مستحقة لك (لي)</span>
            <div className="text-xl font-black text-emerald-600 font-['Cairo',sans-serif] mt-1">
              {totalReceivables.toLocaleString('ar-EG')} ج.م
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500">ديون عليك للغير (علي)</span>
            <div className="text-xl font-black text-rose-600 font-['Cairo',sans-serif] mt-1">
              {totalPayables.toLocaleString('ar-EG')} ج.م
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500">جمعيات نشطة</span>
            <div className="text-xl font-black text-indigo-600 font-['Cairo',sans-serif] mt-1">
              {circles.length} جمعيات
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs selector */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('debts')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'debts'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>حسابات الديون والديون المتبادلة ({debts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('installments')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'installments'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>حاسبة ومخطط الأقساط (حتى 1,200 قسط)</span>
        </button>

        <button
          onClick={() => setActiveTab('circles')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'circles'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>الجمعيات الشهرية (Money Circles) ({circles.length})</span>
        </button>
      </div>

      {/* 1. DEBTS SECTION */}
      {activeTab === 'debts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {debts.map((d) => {
            const isReceivable = d.direction === 'receivable';
            const remaining = d.totalAmount - d.paidAmount;

            return (
              <div
                key={d.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                        isReceivable
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isReceivable ? 'مستحق لي (قرض للغير)' : 'دين عليّ (التزام للغير)'}
                    </span>
                    <span className="text-xs text-slate-400">تاريخ الاستحقاق: {d.dueDate}</span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 mb-1 flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    {d.personName}
                  </h3>
                  {d.phone && (
                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                      <Phone className="w-3 h-3" /> {d.phone}
                    </p>
                  )}

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between my-3">
                    <div>
                      <span className="text-[11px] text-slate-400 block">المبلغ الإجمالي</span>
                      <span className="text-sm font-bold text-slate-800 font-['Cairo',sans-serif]">
                        {d.totalAmount.toLocaleString('ar-EG')} {d.currency}
                      </span>
                    </div>

                    <div className="text-left">
                      <span className="text-[11px] text-slate-400 block">المتبقي للسداد</span>
                      <span className="text-base font-black text-amber-600 font-['Cairo',sans-serif]">
                        {remaining.toLocaleString('ar-EG')} {d.currency}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">الحالة: {d.status === 'paid' ? 'تم السداد بالكامل' : 'قيد السداد'}</span>
                  <button
                    onClick={() => showToast(`تم تسجيل دفعة للـ ${d.personName}`)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition cursor-pointer"
                  >
                    + تسجيل دفعة
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. INSTALLMENTS & CALCULATOR SECTION */}
      {activeTab === 'installments' && (
        <div className="space-y-6">
          {/* Calculator Sandbox */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <h3 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-600" />
              حاسبة ومخطط الأقساط (Installment Calculator)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">المبلغ الإجمالي (ج.م)</label>
                <input
                  type="number"
                  value={calcTotalLoan}
                  onChange={(e) => setCalcTotalLoan(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">عدد الأقساط (شهرياً - حتى 1200 قسط)</label>
                <input
                  type="number"
                  max="1200"
                  value={calcMonths}
                  onChange={(e) => setCalcMonths(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">نسبة الربح/الفائدة (%)</label>
                <input
                  type="number"
                  value={calcInterestRate}
                  onChange={(e) => setCalcInterestRate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-900 block">قيمة القسط الشهري المتوقع</span>
                <span className="text-2xl font-black text-amber-700 font-['Cairo',sans-serif]">
                  {calcMonthlyInstallment().toLocaleString('ar-EG')} ج.م / شهرياً
                </span>
              </div>
              <button
                onClick={() => showToast('تم إنشاء مخطط الأقساط وبث التنبيهات')}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                حفظ كجدول أقساط
              </button>
            </div>
          </div>

          {/* Existing Installments Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800">سجل الأقساط النشطة ومواعيد الاستحقاق</h4>
              <span className="text-xs text-slate-500">إجمالي الأقساط: {installments.length}</span>
            </div>

            <div className="divide-y divide-slate-100">
              {installments.map((inst) => (
                <div key={inst.id} className="p-4 hover:bg-slate-50 transition flex items-center justify-between gap-3">
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">{inst.clientName}</h5>
                    <p className="text-xs text-slate-500">
                      {inst.courseTitle} • قسط رقم {inst.installmentNumber} من {inst.totalInstallments}
                    </p>
                    <span className="text-[11px] text-amber-700 font-bold block mt-1">
                      تاريخ الاستحقاق: {inst.dueDate}
                    </span>
                  </div>

                  <div className="text-left font-['Cairo',sans-serif]">
                    <span className="text-base font-black text-slate-900 block">
                      {inst.installmentAmount.toLocaleString('ar-EG')} ج.م
                    </span>
                    <button
                      onClick={() => onPayInstallment(inst.id)}
                      className="mt-1 text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
                    >
                      {inst.status === 'paid' ? '✓ تم السداد' : 'تسديد القسط'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. MONEY CIRCLES SECTION (الجمعيات) */}
      {activeTab === 'circles' && (
        <div className="space-y-4">
          {circles.map((circle) => (
            <div
              key={circle.id}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
                    جمعية شهرية
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-1">{circle.name}</h3>
                </div>

                <div className="flex items-center gap-4 text-xs font-['Cairo',sans-serif]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">القسط الشهري</span>
                    <span className="font-bold text-slate-800 text-sm">
                      {circle.monthlyAmount.toLocaleString('ar-EG')} ج.م
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">المبلغ الإجمالي للقبض</span>
                    <span className="font-black text-emerald-600 text-sm">
                      {circle.totalPayout.toLocaleString('ar-EG')} ج.م
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">دورك المعتمد</span>
                    <span className="font-bold text-indigo-600 text-xs">{circle.myTurnMonth}</span>
                  </div>
                </div>
              </div>

              {/* Members turns list */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1">
                  <Users className="w-4 h-4 text-indigo-600" />
                  جدول أعضاء الجمعية وأدوار القبض:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {circle.members.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">
                          الدور #{m.turnNumber} ({m.payoutMonth})
                        </span>
                        <span className="text-xs font-bold text-slate-800">{m.name}</span>
                      </div>

                      <button
                        onClick={() => showToast(`تمت مراجعة إثبات دفع ${m.name}`)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                          m.isPaidCurrentMonth
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800 hover:underline'
                        }`}
                      >
                        {m.isPaidCurrentMonth ? '✓ مدفوع' : 'تأكيد الدفع'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE DEBT MODAL */}
      <AnimatePresence>
        {isDebtModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200"
              dir="rtl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900">تسجيل دين / قرض جديد</h3>
                <button
                  onClick={() => setIsDebtModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateDebt} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDebtDirection('receivable')}
                    className={`py-2 rounded-2xl text-xs font-bold border transition cursor-pointer ${
                      debtDirection === 'receivable'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    لي مستحق (قرض للغير)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDebtDirection('payable')}
                    className={`py-2 rounded-2xl text-xs font-bold border transition cursor-pointer ${
                      debtDirection === 'payable'
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    دين عليّ (التزام للغير)
                  </button>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">اسم الشخص أو الجهة *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: المهندس أحمد / شركة التوريدات"
                    value={debtPerson}
                    onChange={(e) => setDebtPerson(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">المبلغ الإجمالي (ج.م) *</label>
                  <input
                    type="number"
                    required
                    placeholder="0.00"
                    value={debtAmount}
                    onChange={(e) => setDebtAmount(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">رقم الهاتف (اختياري)</label>
                  <input
                    type="text"
                    placeholder="01xxxxxxxxx"
                    value={debtPhone}
                    onChange={(e) => setDebtPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">تاريخ الوفاء المأمول</label>
                  <input
                    type="date"
                    value={debtDueDate}
                    onChange={(e) => setDebtDueDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-black text-sm shadow-lg shadow-amber-600/20 cursor-pointer"
                  >
                    حفظ سجل الدين
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE MONEY CIRCLE MODAL */}
      <AnimatePresence>
        {isCircleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200"
              dir="rtl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900">إنشاء جمعية شهرية جديدة</h3>
                <button
                  onClick={() => setIsCircleModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCircle} className="space-y-4 mt-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">اسم الجمعية *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: جمعية الأصدقاء 2026"
                    value={circleName}
                    onChange={(e) => setCircleName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">القسط الشهري (ج.م) *</label>
                    <input
                      type="number"
                      required
                      placeholder="مثال: 5000"
                      value={circleMonthlyAmount}
                      onChange={(e) => setCircleMonthlyAmount(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">عدد الأدوار (الأشهر)</label>
                    <input
                      type="number"
                      value={circleTotalShares}
                      onChange={(e) => setCircleTotalShares(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">دورك المخطط لاستلام الجمعية</label>
                  <input
                    type="text"
                    placeholder="مثال: الشهر الثالث / شهر أكتوبر"
                    value={circleMyTurn}
                    onChange={(e) => setCircleMyTurn(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-black text-sm shadow-lg shadow-amber-600/20 cursor-pointer"
                  >
                    إنشاء وربط الجمعية
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
