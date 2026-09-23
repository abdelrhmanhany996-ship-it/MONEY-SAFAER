import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Phone,
  Calendar,
  DollarSign,
  UserCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Installment } from '../types';

interface InstallmentsDashboardProps {
  installments: Installment[];
  onPayInstallment: (id: string) => void;
  onAddInstallment: (inst: Installment) => void;
  showToast: (msg: string) => void;
}

export default function InstallmentsDashboard({
  installments,
  onPayInstallment,
  onAddInstallment,
  showToast,
}: InstallmentsDashboardProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'overdue' | 'paid'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [courseTitle, setCourseTitle] = useState('دبلومة تطوير تطبيقات الويب المتكاملة');
  const [totalAmount, setTotalAmount] = useState('4500');
  const [installmentAmount, setInstallmentAmount] = useState('1500');
  const [dueDate, setDueDate] = useState('2026-10-01');

  // Stats calculation
  const totalReceivables = installments.reduce((acc, curr) => acc + curr.remainingAmount, 0);
  const collectedAmount = installments.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const overdueCount = installments.filter((i) => i.status === 'overdue').length;
  const overdueAmount = installments
    .filter((i) => i.status === 'overdue')
    .reduce((acc, curr) => acc + curr.installmentAmount, 0);

  // Filtered installments
  const filtered = installments.filter((i) => {
    const matchesFilter = filterStatus === 'all' || i.status === filterStatus;
    const matchesSearch =
      i.clientName.includes(searchQuery) ||
      i.phone.includes(searchQuery) ||
      i.courseTitle.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  // Chart data: Due upcoming
  const installmentsChartData = [
    { name: '10 سبتمبر', amount: 1500, paid: 1500 },
    { name: '15 سبتمبر', amount: 1400, paid: 0 },
    { name: '25 سبتمبر', amount: 1500, paid: 0 },
    { name: '28 سبتمبر', amount: 1600, paid: 0 },
    { name: '01 أكتوبر', amount: 1900, paid: 0 },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !phone || !totalAmount) {
      showToast('يرجى استكمال بيانات القسط');
      return;
    }

    const total = parseFloat(totalAmount);
    const inst = parseFloat(installmentAmount);

    const newInst: Installment = {
      id: `inst_${Date.now()}`,
      clientName,
      phone,
      courseTitle,
      totalAmount: total,
      paidAmount: total - inst,
      remainingAmount: inst,
      installmentNumber: 2,
      totalInstallments: Math.ceil(total / inst),
      installmentAmount: inst,
      dueDate,
      status: 'pending',
    };

    onAddInstallment(newInst);
    setClientName('');
    setPhone('');
    setIsModalOpen(false);
    showToast('تم تسجيل خطة القسط للمتدرب بنجاح ✓');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-amber-600 via-amber-500 to-yellow-500 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black">
                داشبورد الأقساط والتحصيل
              </span>
              <span className="text-xs text-amber-100">إدارة جداول السداد ومستحقات المتدربين</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">متابعة أقساط الدورات والتحصيلات</h1>
            <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-xl">
              نظام ذكي لجدولة سداد دورات الأكاديمية مع تنبيهات فورية للأقساط المتأخرة والمستحقة.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="self-start md:self-auto flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-amber-700 font-black text-xs sm:text-sm shadow-md hover:bg-amber-50 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>تسجيل خطة قسط جديدة</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">إجمالي الأقساط المتبقية</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {totalReceivables.toLocaleString()} <span className="text-xs font-medium text-slate-500">ج.م</span>
          </div>
          <span className="text-[11px] text-amber-600 font-bold mt-2 block">
            مستحقة التحصيل خلال 30 يوماً
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">المحصل فعلياً من الأقساط</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {collectedAmount.toLocaleString()} <span className="text-xs font-medium text-slate-500">ج.م</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-bold mt-2 block">نسبة الالتزام 78%</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">أقساط متأخرة السداد</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600">
            {overdueAmount.toLocaleString()} <span className="text-xs font-medium text-slate-500">ج.م</span>
          </div>
          <span className="text-[11px] text-rose-600 font-bold mt-2 block">
            عدد {overdueCount} طلاب متأخرين
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">إجمالي المشتركين بالتقسيط</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {installments.length} <span className="text-xs font-medium text-slate-500">متدرب</span>
          </div>
          <span className="text-[11px] text-blue-600 font-bold mt-2 block">متاح نظام الدفع بفائدة 0%</span>
        </div>
      </div>

      {/* Chart: Installments Due Schedule */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-sm font-black text-slate-800 mb-1">
          الجدول الزمني لاستحقاق الأقساط القادمة
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          توقعات التدفقات النقدية الواردة من أقساط المتدربين
        </p>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={installmentsChartData}>
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
              <Bar dataKey="amount" name="القسط المستحق (ج.م)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Installments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-fit">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'pending', label: 'مستحق قريباً' },
              { id: 'overdue', label: 'متأخر' },
              { id: 'paid', label: 'مسدد بالكامل' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setFilterStatus(t.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === t.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 ml-2" />
            <input
              type="text"
              placeholder="بحث بالاسم أو الهاتف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none w-full"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="p-3.5">المتدرب</th>
                <th className="p-3.5">الدورة التدريبية</th>
                <th className="p-3.5">القسط الحالي</th>
                <th className="p-3.5">قيمة القسط</th>
                <th className="p-3.5">المتبقي الإجمالي</th>
                <th className="p-3.5">تاريخ الاستحقاق</th>
                <th className="p-3.5">الحالة</th>
                <th className="p-3.5 text-left">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((inst) => (
                <tr key={inst.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-slate-800">{inst.clientName}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Phone className="w-2.5 h-2.5" />
                      <span>{inst.phone}</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-700 font-medium">{inst.courseTitle}</td>
                  <td className="p-3.5">
                    <span className="font-bold text-slate-700">
                      القسط {inst.installmentNumber} من {inst.totalInstallments}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-amber-700">
                    {inst.installmentAmount.toLocaleString()} ج.م
                  </td>
                  <td className="p-3.5 font-bold text-slate-800">
                    {inst.remainingAmount.toLocaleString()} ج.م
                  </td>
                  <td className="p-3.5 text-slate-500">{inst.dueDate}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                        inst.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-700'
                          : inst.status === 'overdue'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {inst.status === 'paid'
                        ? 'مسدد ✓'
                        : inst.status === 'overdue'
                        ? 'متأخر ⚠️'
                        : 'مستحق السداد'}
                    </span>
                  </td>
                  <td className="p-3.5 text-left">
                    {inst.status !== 'paid' ? (
                      <button
                        onClick={() => onPayInstallment(inst.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-all cursor-pointer shadow-xs"
                      >
                        تحصيل الآن
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold text-emerald-600">مكتمل</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Installment Plan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-black text-slate-900 text-base">تسجيل خطة قسط جديدة</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم المتدرب</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: أحمد محمود"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف</label>
                <input
                  type="tel"
                  required
                  placeholder="010XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الدورة التدريبية</label>
                <input
                  type="text"
                  required
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">إجمالي الدورة (ج.م)</label>
                  <input
                    type="number"
                    required
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">قيمة القسط (ج.م)</label>
                  <input
                    type="number"
                    required
                    value={installmentAmount}
                    onChange={(e) => setInstallmentAmount(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">تاريخ الاستحقاق</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                />
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
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  تأكيد خطة القسط
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
