import React, { useState } from 'react';
import {
  Users2,
  DollarSign,
  Plus,
  CheckCircle2,
  Clock,
  Printer,
  Search,
  Building,
  Calendar,
  Briefcase,
  FileText,
  CreditCard,
  ChevronDown,
} from 'lucide-react';
import { EmployeePayroll } from '../../types';

interface PayrollHRViewProps {
  onAddTransaction?: (tx: any) => void;
  showToast: (msg: string) => void;
  currency?: string;
  userRole?: 'admin' | 'employee';
}

const INITIAL_EMPLOYEES: EmployeePayroll[] = [
  {
    id: 'emp_1',
    employeeCode: 'EMP-101',
    name: 'م. أحمد فتحي',
    position: 'مدير المحاسبة والمالية',
    department: 'قسم المحاسبة والتدقيق',
    phone: '01011223344',
    email: 'ahmed.fathy@sabergroup.com',
    hireDate: '2024-01-15',
    basicSalary: 18000,
    allowances: 3000,
    deductions: 500,
    netSalary: 20500,
    paymentStatus: 'paid',
    lastPaidDate: '2026-09-01',
    bankAccountOrWallet: 'CIB - 100049281',
  },
  {
    id: 'emp_2',
    employeeCode: 'EMP-102',
    name: 'أ. منى السيد',
    position: 'محاضر وسفير الكورسات',
    department: 'قطاع الأكاديمية والتدريب',
    phone: '01122334455',
    email: 'mona.elsayed@sabergroup.com',
    hireDate: '2024-06-01',
    basicSalary: 12000,
    allowances: 2000,
    deductions: 0,
    netSalary: 14000,
    paymentStatus: 'pending',
    bankAccountOrWallet: 'فودافون كاش - 01122334455',
  },
  {
    id: 'emp_3',
    employeeCode: 'EMP-103',
    name: 'م. حسام علي',
    position: 'مهندس مطور برمجيات ERP',
    department: 'قسم البرمجيات وتكنولوجيا المعلومات',
    phone: '01233445566',
    email: 'hossam.ali@sabergroup.com',
    hireDate: '2025-02-10',
    basicSalary: 15000,
    allowances: 2500,
    deductions: 300,
    netSalary: 17200,
    paymentStatus: 'pending',
    bankAccountOrWallet: 'انستا باي - hossam@instapay',
  },
  {
    id: 'emp_4',
    employeeCode: 'EMP-104',
    name: 'أ. سارة مصطفى',
    position: 'مسؤولة خدمة العملاء والتسجيل',
    department: 'المبيعات وخدمة العملاء',
    phone: '01544556677',
    email: 'sara.mostafa@sabergroup.com',
    hireDate: '2025-09-01',
    basicSalary: 8000,
    allowances: 1000,
    deductions: 200,
    netSalary: 8800,
    paymentStatus: 'paid',
    lastPaidDate: '2026-09-01',
    bankAccountOrWallet: 'خزينة الفرع الرئيسي',
  },
];

export default function PayrollHRView({
  onAddTransaction,
  showToast,
  currency = 'EGP',
  userRole = 'admin',
}: PayrollHRViewProps) {
  const [employees, setEmployees] = useState<EmployeePayroll[]>(INITIAL_EMPLOYEES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<EmployeePayroll | null>(null);

  // Add Employee Form State
  const [code, setCode] = useState(`EMP-${100 + employees.length + 1}`);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('قسم المحاسبة والتدقيق');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [basicSalary, setBasicSalary] = useState('');
  const [allowances, setAllowances] = useState('');
  const [deductions, setDeductions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('حساب CIB للشركة');

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = filterDepartment === 'all' || emp.department === filterDepartment;
    return matchesSearch && matchesDept;
  });

  const totalMonthlyPayroll = employees.reduce((sum, emp) => sum + emp.netSalary, 0);
  const paidCount = employees.filter((emp) => emp.paymentStatus === 'paid').length;
  const pendingCount = employees.filter((emp) => emp.paymentStatus === 'pending').length;
  const pendingAmount = employees
    .filter((emp) => emp.paymentStatus === 'pending')
    .reduce((sum, emp) => sum + emp.netSalary, 0);

  const handlePaySalary = (empId: string) => {
    const emp = employees.find((e) => e.id === empId);
    if (!emp) return;

    setEmployees((prev) =>
      prev.map((e) =>
        e.id === empId
          ? { ...e, paymentStatus: 'paid', lastPaidDate: new Date().toISOString().split('T')[0] }
          : e
      )
    );

    if (onAddTransaction) {
      onAddTransaction({
        id: `tx_salary_${Date.now()}`,
        title: `صرف راتب شهر - ${emp.name}`,
        category: 'مرتبات وأجور الموظفين',
        amount: emp.netSalary,
        currency,
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
        walletName: 'الحساب البنكي للشركة (CIB)',
        notes: `صرف صافي الراتب لكود ${emp.employeeCode} - الوظيفة: ${emp.position}`,
      });
    }

    showToast(`تم صرف راتب الموظف (${emp.name}) بقيمة ${emp.netSalary.toLocaleString()} ${currency} وتسجيل القيد في الخزينة ✓`);
  };

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !position) {
      showToast('يرجى كتابة اسم الموظف والمسمى الوظيفي');
      return;
    }

    const basicVal = parseFloat(basicSalary) || 0;
    const allowVal = parseFloat(allowances) || 0;
    const dedVal = parseFloat(deductions) || 0;
    const netVal = basicVal + allowVal - dedVal;

    const newEmp: EmployeePayroll = {
      id: `emp_${Date.now()}`,
      employeeCode: code || `EMP-${Date.now().toString().slice(-3)}`,
      name,
      position,
      department,
      phone: phone || 'غير محدد',
      email: email || 'employee@sabergroup.com',
      hireDate: new Date().toISOString().split('T')[0],
      basicSalary: basicVal,
      allowances: allowVal,
      deductions: dedVal,
      netSalary: netVal,
      paymentStatus: 'pending',
      bankAccountOrWallet: paymentMethod,
    };

    setEmployees((prev) => [newEmp, ...prev]);
    setIsAddModalOpen(false);
    setName('');
    setPosition('');
    setBasicSalary('');
    setAllowances('');
    setDeductions('');
    showToast(`تمت إضافة الموظف الجديد (${name}) لسجل المرتبات بنجاح ✓`);
  };

  return (
    <div className="space-y-6 dir-rtl">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 text-xs font-black">
                Saber Group ERP - HR & Payroll
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 text-xs font-bold">
                7. المرتبات والموارد البشرية
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              نظام المرتبات وكشوف مسيرات الموظفين
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              إدارة مستحقات فريق عمل مجموعة صابر، الأجور الأساسية، البدلات، الخصومات، وإصدار مفردات المرتبات وصرف الرواتب بنقرة واحدة.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>إضافة موظف جديد لسيستم الشركة</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">إجمالي كتلة الرواتب الشهري</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">
            {totalMonthlyPayroll.toLocaleString()} {currency}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">لكافة الموظفين والمحاضرين المسجلين</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">إجمالي الموظفين المسجلين</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600">
              <Users2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">
            {employees.length} موظف ومحاضر
          </div>
          <div className="text-[11px] text-indigo-600 font-bold mt-1">Saber Group Team</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">الرواتب المتبقية للصرف</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-amber-600 dark:text-amber-400">
            {pendingAmount.toLocaleString()} {currency}
          </div>
          <div className="text-[11px] text-amber-600 font-bold mt-1">{pendingCount} موظف ينتظر الصرف</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">الرواتب المصروفة هذا الشهر</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-emerald-600 dark:text-emerald-400">
            {paidCount} من {employees.length} تم الصرف
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">مسيرة مرتبات منتظمة ✓</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالكود، الاسم، أو المسمى الوظيفي..."
            className="w-full pr-9 pl-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:border-rose-500 text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-500 shrink-0">تصفية حسب القسم:</span>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">جميع الأقسام</option>
            <option value="قسم المحاسبة والتدقيق">قسم المحاسبة والتدقيق</option>
            <option value="قطاع الأكاديمية والتدريب">قطاع الأكاديمية والتدريب</option>
            <option value="قسم البرمجيات وتكنولوجيا المعلومات">قسم البرمجيات وتكنولوجيا المعلومات</option>
            <option value="المبيعات وخدمة العملاء">المبيعات وخدمة العملاء</option>
          </select>
        </div>
      </div>

      {/* Employees Payroll Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              قائمة وسجل رواتب الموظفين (Saber Group HR)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              عرض المسيرات، البدلات، الاستقطاعات وصرف المستحقات مع التوثيق المالي.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
            {filteredEmployees.length} موظف
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-black text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800">
                <th className="p-4">كود الموظف والاسم</th>
                <th className="p-4">الوظيفة والقسم</th>
                <th className="p-4">الراتب الأساسي</th>
                <th className="p-4">البدلات / المكافآت</th>
                <th className="p-4">الاستقطاعات</th>
                <th className="p-4">صافي الراتب المستحق</th>
                <th className="p-4">حالة الصرف</th>
                <th className="p-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-black text-slate-900 dark:text-white block">{emp.name}</span>
                        <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">{emp.employeeCode}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">{emp.position}</span>
                    <span className="text-[10px] text-slate-400 block">{emp.department}</span>
                  </td>
                  <td className="p-4 font-bold text-slate-700 dark:text-slate-300">
                    {emp.basicSalary.toLocaleString()} {currency}
                  </td>
                  <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">
                    +{emp.allowances.toLocaleString()} {currency}
                  </td>
                  <td className="p-4 font-bold text-rose-600 dark:text-rose-400">
                    -{emp.deductions.toLocaleString()} {currency}
                  </td>
                  <td className="p-4 font-black text-slate-900 dark:text-white text-sm">
                    {emp.netSalary.toLocaleString()} {currency}
                  </td>
                  <td className="p-4">
                    {emp.paymentStatus === 'paid' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-black">
                        <CheckCircle2 className="w-3 h-3" /> تم الصرف {emp.lastPaidDate}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-[10px] font-black">
                        <Clock className="w-3 h-3" /> بانتظار الصرف
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      {emp.paymentStatus === 'pending' && (
                        <button
                          onClick={() => handlePaySalary(emp.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-all shadow-2xs active:scale-95 cursor-pointer"
                        >
                          صرف الراتب الآن
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedPayslip(emp)}
                        className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs transition-colors cursor-pointer"
                        title="عرض كشف مفردات المرتب"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 dir-rtl">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">
              إضافة موظف جديد لمجموعة صابر
            </h3>

            <form onSubmit={handleCreateEmployee} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    كود الموظف
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    اسم الموظف الثلاثي
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="مثال: د. طارق عبد الرحمن"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    المسمى الوظيفي
                  </label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    required
                    placeholder="مثال: محاسب قانوني"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    القسم
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-slate-100"
                  >
                    <option value="قسم المحاسبة والتدقيق">قسم المحاسبة والتدقيق</option>
                    <option value="قطاع الأكاديمية والتدريب">قطاع الأكاديمية والتدريب</option>
                    <option value="قسم البرمجيات وتكنولوجيا المعلومات">قسم البرمجيات وتكنولوجيا المعلومات</option>
                    <option value="المبيعات وخدمة العملاء">المبيعات وخدمة العملاء</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    الراتب الأساسي
                  </label>
                  <input
                    type="number"
                    value={basicSalary}
                    onChange={(e) => setBasicSalary(e.target.value)}
                    required
                    placeholder="10000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    البدلات / الحوافز
                  </label>
                  <input
                    type="number"
                    value={allowances}
                    onChange={(e) => setAllowances(e.target.value)}
                    placeholder="1500"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    الاستقطاعات
                  </label>
                  <input
                    type="number"
                    value={deductions}
                    onChange={(e) => setDeductions(e.target.value)}
                    placeholder="200"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  جهة الصرف أو الحساب البنكي
                </label>
                <input
                  type="text"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  placeholder="مثال: حساب CIB للشركة أو انستا باي"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all shadow-md cursor-pointer"
                >
                  حفظ الموظف وسجل الراتب
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payslip View Modal */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 dir-rtl">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
            <div className="text-center border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
              <span className="text-xs font-black text-rose-600 dark:text-rose-400 block">
                Saber Group for Accounting
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                كشف مفردات مرتب الموظف (Payslip)
              </h3>
              <span className="text-[11px] text-slate-400 block">
                كود: {selectedPayslip.employeeCode} - التاريخ: {new Date().toLocaleDateString('ar-EG')}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span className="text-slate-500 font-bold">اسم الموظف:</span>
                <span className="font-black text-slate-900 dark:text-white">{selectedPayslip.name}</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span className="text-slate-500 font-bold">الوظيفة والقسم:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedPayslip.position}</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span className="text-slate-500 font-bold">الراتب الأساسي:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedPayslip.basicSalary.toLocaleString()} {currency}</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span className="text-emerald-600 font-bold">البدلات والمكافآت:</span>
                <span className="font-bold text-emerald-600">+{selectedPayslip.allowances.toLocaleString()} {currency}</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span className="text-rose-600 font-bold">الاستقطاعات والخصومات:</span>
                <span className="font-bold text-rose-600">-{selectedPayslip.deductions.toLocaleString()} {currency}</span>
              </div>

              <div className="flex justify-between p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl mt-2">
                <span className="font-black text-rose-900 dark:text-rose-200">صافي المستحق:</span>
                <span className="font-black text-lg text-rose-700 dark:text-rose-300">{selectedPayslip.netSalary.toLocaleString()} {currency}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-5">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة البيان</span>
              </button>
              <button
                onClick={() => setSelectedPayslip(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
