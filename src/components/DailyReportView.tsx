import {
  Printer,
  FileText,
  Calendar,
  Building2,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Download,
  Share2,
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import {
  Course,
  ClientOrStudent,
  Task,
  Invoice,
  Wallet,
  Transaction,
  Installment,
} from '../types';

interface DailyReportViewProps {
  courses: Course[];
  clients: ClientOrStudent[];
  tasks: Task[];
  invoices: Invoice[];
  wallets: Wallet[];
  transactions: Transaction[];
  installments: Installment[];
}

export default function DailyReportView({
  courses,
  clients,
  tasks,
  invoices,
  wallets,
  transactions,
  installments,
}: DailyReportViewProps) {
  const currentDate = 'الأربعاء، 11 سبتمبر 2026';
  const reportNumber = `REP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-01`;

  // Financial aggregates
  const totalBalance = wallets.reduce((acc, curr) => acc + curr.balance, 0);
  const incomeTxs = transactions.filter((t) => t.type === 'income');
  const expenseTxs = transactions.filter((t) => t.type === 'expense');

  const totalIncome = incomeTxs.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = expenseTxs.reduce((acc, curr) => acc + curr.amount, 0);
  const netDaily = totalIncome - totalExpense;

  const totalInstallmentsRemaining = installments.reduce(
    (acc, curr) => acc + curr.remainingAmount,
    0
  );
  const pendingInvoices = invoices.filter((i) => i.status === 'pending');
  const completedTasks = tasks.filter((t) => t.column === 'done');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Bar (Hidden in Print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            التقرير المالي والإداري اليومي الشامل
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            تقرير رسمي جاهز للطباعة وتصدير PDF يتضمن كافة إحصائيات وخزائن وعمليات اليوم.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة التقرير اليومي (Print / PDF)</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet (Standard A4 formatting ready) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-12 print:border-none print:shadow-none print:p-0 max-w-5xl mx-auto text-right">
        {/* Official Header */}
        <div className="border-b-2 border-slate-900 pb-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo size="md" showSubtitle={true} />
            <div className="border-r-2 border-slate-300 pr-3 mr-1">
              <h2 className="text-base font-black text-slate-900">
                أكاديمية ومؤسسة صابر جروب
              </h2>
              <span className="text-xs text-slate-500 font-bold block">
                قسم الإدارة المالية والشؤون الأكاديمية
              </span>
            </div>
          </div>

          <div className="text-left sm:text-left text-xs space-y-1">
            <div className="font-black text-slate-900">رقم التقرير: {reportNumber}</div>
            <div className="text-slate-500 font-medium">تاريخ الإصدار: {currentDate}</div>
            <div className="text-slate-500 font-medium">وقت الاستخراج: 11:30 صباحاً</div>
          </div>
        </div>

        {/* Executive Summary Boxes */}
        <div className="mb-8">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
            أولاً: ملخص حركة الأموال والسيولة اليومية
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-[11px] font-bold text-slate-500 block mb-1">
                إجمالي الإيرادات اليوم
              </span>
              <span className="text-lg font-black text-emerald-600">
                +{totalIncome.toLocaleString()} ج.م
              </span>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-[11px] font-bold text-slate-500 block mb-1">
                إجمالي المصروفات اليوم
              </span>
              <span className="text-lg font-black text-rose-600">
                -{totalExpense.toLocaleString()} ج.م
              </span>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-[11px] font-bold text-slate-500 block mb-1">
                صافي التدفق اليومي
              </span>
              <span className="text-lg font-black text-blue-700">
                {netDaily.toLocaleString()} ج.م
              </span>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-[11px] font-bold text-slate-500 block mb-1">
                الرصيد الكلي بالخزائن
              </span>
              <span className="text-lg font-black text-slate-900">
                {totalBalance.toLocaleString()} ج.م
              </span>
            </div>
          </div>
        </div>

        {/* Wallets Breakdown */}
        <div className="mb-8">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
            ثانياً: بيان أرصدة الحسابات البنكية والمحافظ
          </h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-slate-100 text-slate-700 font-black">
                <tr>
                  <th className="p-3 text-right">اسم الحساب / المحفظة</th>
                  <th className="p-3 text-right">النوع والتصنيف</th>
                  <th className="p-3 text-left">الرصيد الفعلي الحالي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {wallets.map((w) => (
                  <tr key={w.id}>
                    <td className="p-3 font-bold text-slate-800">{w.name}</td>
                    <td className="p-3 text-slate-600">{w.typeLabel}</td>
                    <td className="p-3 text-left font-black text-slate-900">
                      {w.balance.toLocaleString()} {w.currency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Today's Transactions Table */}
        <div className="mb-8">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
            ثالثاً: سجل حركات المقبوضات والمدفوعات
          </h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-slate-100 text-slate-700 font-black">
                <tr>
                  <th className="p-3 text-right">البيان</th>
                  <th className="p-3 text-right">النوع</th>
                  <th className="p-3 text-right">التصنيف</th>
                  <th className="p-3 text-right">الحساب</th>
                  <th className="p-3 text-left">المبلغ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="p-3 font-bold text-slate-800">{tx.title}</td>
                    <td className="p-3">
                      <span
                        className={`font-black ${
                          tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {tx.type === 'income' ? 'داخل (+)' : 'خارج (-)'}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{tx.category}</td>
                    <td className="p-3 text-slate-600">{tx.walletName}</td>
                    <td
                      className={`p-3 text-left font-black ${
                        tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {tx.amount.toLocaleString()} ج.م
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Installments & Operations Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
              رابعاً: موقف الأقساط والتحصيلات
            </h3>
            <div className="border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">إجمالي الأقساط غير المحصلة:</span>
                <span className="font-bold text-amber-700">
                  {totalInstallmentsRemaining.toLocaleString()} ج.م
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">عدد الأقساط المتأخرة السداد:</span>
                <span className="font-bold text-rose-600">
                  {installments.filter((i) => i.status === 'overdue').length} أقساط
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">الفواتير المعلقة:</span>
                <span className="font-bold text-slate-800">
                  {pendingInvoices.length} فواتير
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
              خامساً: مؤشرات الأكاديمية والتدريب
            </h3>
            <div className="border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">إجمالي الدورات التدريبية النشطة:</span>
                <span className="font-bold text-blue-600">{courses.length} دورات</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">إجمالي الطلاب والعملاء المسجلين:</span>
                <span className="font-bold text-blue-600">{clients.length} متدرب</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">المهام الإدارية المكتملة اليوم:</span>
                <span className="font-bold text-emerald-600">
                  {completedTasks.length} من {tasks.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Signatures & Approvals */}
        <div className="pt-8 border-t-2 border-slate-900 mt-12 grid grid-cols-1 md:grid-cols-2 text-center text-xs gap-6">
          <div>
            <div className="font-bold text-slate-500 mb-6">إعداد وتدقيق صاحب الحساب الشخصي:</div>
            <div className="font-black text-slate-900 border-t border-dashed border-slate-300 pt-2 w-48 mx-auto">
              عبد الرحمن هاني
            </div>
          </div>
          <div>
            <div className="font-bold text-slate-500 mb-6">حساب Google / Gmail الموثق:</div>
            <div className="font-black text-emerald-700 border-t border-dashed border-slate-300 pt-2 w-56 mx-auto dir-ltr">
              abdelrhmanhany996@gmail.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
