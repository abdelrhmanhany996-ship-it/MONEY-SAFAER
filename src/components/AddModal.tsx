import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  GraduationCap,
  UserPlus,
  ArrowDownLeft,
  ArrowUpRight,
  CheckSquare,
  FileText,
  Sparkles,
} from 'lucide-react';
import { Course, ClientOrStudent, Task, Invoice, Transaction } from '../types';
import BrandLogo from './BrandLogo';

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCourse: (course: Partial<Course>) => void;
  onAddClient: (client: Partial<ClientOrStudent>) => void;
  onAddTransaction: (transaction: Partial<Transaction>) => void;
  onAddTask: (task: Partial<Task>) => void;
  onAddInvoice: (invoice: Partial<Invoice>) => void;
  showToast: (message: string) => void;
}

type ActionCategory =
  | 'overview'
  | 'course'
  | 'student'
  | 'income'
  | 'expense'
  | 'task'
  | 'invoice';

export default function AddModal({
  isOpen,
  onClose,
  onAddCourse,
  onAddClient,
  onAddTransaction,
  onAddTask,
  onAddInvoice,
  showToast,
}: AddModalProps) {
  const [activeForm, setActiveForm] = useState<ActionCategory>('overview');

  // Form states
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCategory, setCourseCategory] = useState<Course['category']>('برمجة وتطوير');
  const [coursePrice, setCoursePrice] = useState('3500');

  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentCourse, setStudentCourse] = useState('دبلومة الويب');

  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [wallet, setWallet] = useState('إنستاباي');

  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<Task['priority']>('high');
  const [taskScheduledDate, setTaskScheduledDate] = useState('2026-09-21');
  const [taskTime, setTaskTime] = useState('04:00 م');
  const [taskAssignee, setTaskAssignee] = useState('م. صابر');

  const [invoiceClient, setInvoiceClient] = useState('');
  const [invoiceAmount, setInvoiceAmount] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    setActiveForm('overview');
    onClose();
  };

  const submitCourse = (e: FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;
    onAddCourse({
      title: courseTitle,
      category: courseCategory,
      price: Number(coursePrice) || 3000,
      instructor: 'م. صابر عبد الرحمن',
      subtitle: 'مسار احترافي تطبيقي مكثف',
      progress: 0,
      studentsCount: 1,
      maxStudents: 30,
      duration: '8 أسابيع',
      status: 'planning',
      level: 'متوسط',
    });
    showToast(`تمت إضافة دورة "${courseTitle}" بنجاح ✓`);
    handleClose();
  };

  const submitStudent = (e: FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;
    onAddClient({
      name: studentName,
      phone: studentPhone || '01000000000',
      email: `${studentName.trim().replace(/\s+/g, '.')}@example.com`,
      type: 'student',
      typeLabel: 'متدرب جديد',
      coursesEnrolled: [studentCourse],
      totalPaid: 3500,
      initials: studentName.slice(0, 2),
    });
    showToast(`تم تسجيل المتدرب "${studentName}" بنجاح ✓`);
    handleClose();
  };

  const submitIncome = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;
    onAddTransaction({
      title,
      amount: Number(amount),
      type: 'income',
      category: 'إيرادات دورات تدريبية',
      date: 'الآن',
      walletName: wallet,
    });
    showToast(`تم تسجيل إيراد بقيمة ${amount} ج.م ✓`);
    handleClose();
  };

  const submitExpense = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;
    onAddTransaction({
      title,
      amount: Number(amount),
      type: 'expense',
      category: 'مصروفات تشغيل ومستلزمات',
      date: 'الآن',
      walletName: wallet,
    });
    showToast(`تم تسجيل مصروف بقيمة ${amount} ج.م ✓`);
    handleClose();
  };

  const submitTask = (e: FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    onAddTask({
      title: taskTitle,
      priority: taskPriority,
      column: 'todo',
      assignee: taskAssignee || 'م. صابر',
      courseOrProject: 'أكاديمية صابر',
      dueDate: `${taskScheduledDate.split('-')[2]} سبتمبر، ${taskTime}`,
      scheduledDate: taskScheduledDate || '2026-09-21',
      time: taskTime,
    });
    showToast(`تمت جدولة المهمة بتاريخ ${taskScheduledDate} بنجاح ✓`);
    handleClose();
  };

  const submitInvoice = (e: FormEvent) => {
    e.preventDefault();
    if (!invoiceClient.trim() || !invoiceAmount) return;
    onAddInvoice({
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientName: invoiceClient,
      courseOrService: 'رسوم تدريب واعتماد',
      date: '11 سبتمبر 2026',
      amount: Number(invoiceAmount),
      status: 'pending',
    });
    showToast(`تم إصدار الفاتورة للمتدرب/العميل بنجاح ✓`);
    handleClose();
  };

  const actionButtons = [
    {
      id: 'course' as ActionCategory,
      title: 'دورة تدريبية',
      desc: 'إطلاق مسار أو كورس جديد',
      icon: GraduationCap,
      color: 'from-blue-600 to-indigo-700',
      textColor: 'text-blue-600',
    },
    {
      id: 'student' as ActionCategory,
      title: 'متدرب / عميل',
      desc: 'تسجيل متدرب جديد بالقوائم',
      icon: UserPlus,
      color: 'from-sky-500 to-blue-600',
      textColor: 'text-sky-600',
    },
    {
      id: 'income' as ActionCategory,
      title: 'تسجيل دخل',
      desc: 'رسوم دورات أو عقود شركات',
      icon: ArrowDownLeft,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-600',
    },
    {
      id: 'expense' as ActionCategory,
      title: 'تسجيل مصروف',
      desc: 'إيجار، منصات، إعلانات، صيانة',
      icon: ArrowUpRight,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-600',
    },
    {
      id: 'task' as ActionCategory,
      title: 'مهمة عمل',
      desc: 'إضافة للمخطط الإداري',
      icon: CheckSquare,
      color: 'from-blue-600 to-sky-600',
      textColor: 'text-blue-600',
    },
    {
      id: 'invoice' as ActionCategory,
      title: 'فاتورة رسمية',
      desc: 'إنشاء مطالبة مالية للأكاديمية',
      icon: FileText,
      color: 'from-indigo-600 to-purple-700',
      textColor: 'text-indigo-600',
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Body */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative w-full max-w-lg bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 z-10 max-h-[85vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <BrandLogo size="xs" variant="horizontal" showSubtitle={false} />
              <div className="border-r border-slate-200 pr-2.5 mr-0.5">
                <h3 className="font-bold text-sm text-slate-900">
                  {activeForm === 'overview' && 'إضافة جديدة للمنظومة'}
                  {activeForm === 'course' && 'إضافة مسار تدريبي جديد'}
                  {activeForm === 'student' && 'تسجيل متدرب أو عميل جديد'}
                  {activeForm === 'income' && 'تسجيل إيراد دورات / تدريب'}
                  {activeForm === 'expense' && 'تسجيل مصروف تشغيلي'}
                  {activeForm === 'task' && 'إنشاء مهمة للأكاديمية'}
                  {activeForm === 'invoice' && 'إصدار فاتورة جديدة'}
                </h3>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="mt-4">
            {activeForm === 'overview' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {actionButtons.map((btn) => {
                  const Icon = btn.icon;
                  return (
                    <motion.button
                      key={btn.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                      onClick={() => setActiveForm(btn.id)}
                      className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all text-center group cursor-pointer shadow-xs"
                    >
                      <div
                        className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${btn.color} flex items-center justify-center text-white mb-2 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-900 mb-0.5 group-hover:text-blue-600 transition-colors">
                        {btn.title}
                      </span>
                      <span className="text-[10px] text-slate-500 line-clamp-1">
                        {btn.desc}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Course Form */}
            {activeForm === 'course' && (
              <form onSubmit={submitCourse} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 text-right">
                    عنوان الدورة / المسار التدريبي
                  </label>
                  <input
                    type="text"
                    required
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="مثال: دبلومة الأمن السيبراني واختبار الاختراق"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-900 text-right focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 text-right">
                      التصنيف
                    </label>
                    <select
                      value={courseCategory}
                      onChange={(e) =>
                        setCourseCategory(e.target.value as Course['category'])
                      }
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-2.5 py-2 text-xs text-slate-900 text-right focus:outline-none transition-colors"
                    >
                      <option value="برمجة وتطوير">برمجة وتطوير</option>
                      <option value="تسويق رقمي">تسويق رقمي</option>
                      <option value="تصميم ومونتاج">تصميم ومونتاج</option>
                      <option value="ذكاء اصطناعي">ذكاء اصطناعي</option>
                      <option value="إدارة أعمال">إدارة أعمال</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 text-right">
                      سعر الدورة (ج.م)
                    </label>
                    <input
                      type="number"
                      value={coursePrice}
                      onChange={(e) => setCoursePrice(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-900 text-right focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-sky-600 text-white text-xs font-bold rounded-xl hover:opacity-95 transition-opacity cursor-pointer shadow-sm shadow-blue-500/20"
                  >
                    حفظ الدورة التدريبية
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveForm('overview')}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    رجوع
                  </button>
                </div>
              </form>
            )}

            {/* Student Form */}
            {activeForm === 'student' && (
              <form onSubmit={submitStudent} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 text-right">
                    اسم المتدرب بالكامل
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="مثال: يوسف حسام الدين"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-900 text-right focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 text-right">
                      رقم الهاتف / واتساب
                    </label>
                    <input
                      type="tel"
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      placeholder="010XXXXXXXX"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-900 text-right focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 text-right">
                      المسار المسجل به
                    </label>
                    <input
                      type="text"
                      value={studentCourse}
                      onChange={(e) => setStudentCourse(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-900 text-right focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-sky-600 text-white text-xs font-bold rounded-xl hover:opacity-95 transition-opacity cursor-pointer shadow-sm shadow-blue-500/20"
                  >
                    تسجيل المتدرب
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveForm('overview')}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    رجوع
                  </button>
                </div>
              </form>
            )}

            {/* Income / Expense Form */}
            {(activeForm === 'income' || activeForm === 'expense') && (
              <form
                onSubmit={activeForm === 'income' ? submitIncome : submitExpense}
                className="space-y-3.5"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 text-right">
                    البيان / الوصف
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={
                      activeForm === 'income'
                        ? 'مثال: اشتراك متدرب في دبلومة البرمجة'
                        : 'مثال: شراء ملحقات أجهزة القاعة 1'
                    }
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-900 text-right focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 text-right">
                      المبلغ (ج.م)
                    </label>
                    <input
                      type="number"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-900 text-right focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 text-right">
                      المحفظة / الحساب
                    </label>
                    <select
                      value={wallet}
                      onChange={(e) => setWallet(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-2.5 py-2 text-xs text-slate-900 text-right focus:outline-none transition-colors"
                    >
                      <option value="إنستاباي وفودافون كاش">إنستاباي وفودافون كاش</option>
                      <option value="حساب بنكي CIB">حساب بنكي CIB</option>
                      <option value="الخزينة النقدية">الخزينة النقدية</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className={`flex-1 py-2.5 text-white text-xs font-bold rounded-xl hover:opacity-95 transition-opacity cursor-pointer shadow-sm ${
                      activeForm === 'income'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-500/20'
                        : 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-amber-500/20'
                    }`}
                  >
                    {activeForm === 'income' ? 'تسجيل الإيراد' : 'تسجيل المصروف'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveForm('overview')}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    رجوع
                  </button>
                </div>
              </form>
            )}

            {/* Task Form */}
            {activeForm === 'task' && (
              <form onSubmit={submitTask} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 text-right">
                    عنوان المهمة
                  </label>
                  <input
                    type="text"
                    required
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="مثال: تسجيل المحاضرة التوجيهية وتحديث الرابط"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-900 text-right focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 text-right">
                      المسؤول عن المهمة
                    </label>
                    <input
                      type="text"
                      value={taskAssignee}
                      onChange={(e) => setTaskAssignee(e.target.value)}
                      placeholder="م. صابر"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-900 text-right focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 text-right">
                      تاريخ الاستحقاق (التقويم)
                    </label>
                    <input
                      type="date"
                      value={taskScheduledDate}
                      onChange={(e) => setTaskScheduledDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-900 text-right focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 text-right">
                    درجة الأولوية
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['high', 'medium', 'low'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setTaskPriority(p)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          taskPriority === p
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {p === 'high' ? 'عالية' : p === 'medium' ? 'متوسطة' : 'عادية'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-sky-600 text-white text-xs font-bold rounded-xl hover:opacity-95 transition-opacity cursor-pointer shadow-sm shadow-blue-500/20"
                  >
                    إضافة المهمة
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveForm('overview')}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    رجوع
                  </button>
                </div>
              </form>
            )}

            {/* Invoice Form */}
            {activeForm === 'invoice' && (
              <form onSubmit={submitInvoice} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 text-right">
                    العميل أو الشركة
                  </label>
                  <input
                    type="text"
                    required
                    value={invoiceClient}
                    onChange={(e) => setInvoiceClient(e.target.value)}
                    placeholder="مثال: شركة التطوير الهندسي"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-900 text-right focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 text-right">
                    قيمة الفاتورة (ج.م)
                  </label>
                  <input
                    type="number"
                    required
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-900 text-right focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-bold rounded-xl hover:opacity-95 transition-opacity cursor-pointer shadow-sm shadow-indigo-500/20"
                  >
                    إصدار الفاتورة
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveForm('overview')}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    رجوع
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
