import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  Users,
  CreditCard,
  Building2,
  FileText,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  DollarSign,
  TrendingUp,
  UserCheck,
  Calendar,
  Layers,
  Send,
  Phone,
  Mail,
  X,
  Filter,
  BarChart3,
  CheckSquare,
  BookOpen,
  PieChart,
} from 'lucide-react';
import { Course, ClientOrStudent, Installment, Invoice, Task, CostCenter } from '../../types';

interface CompanyAcademyViewProps {
  courses: Course[];
  clients: ClientOrStudent[];
  installments: Installment[];
  invoices: Invoice[];
  tasks: Task[];
  onAddCourse: (course: Partial<Course>) => void;
  onAddClient: (client: Partial<ClientOrStudent>) => void;
  onAddInvoice: (invoice: Partial<Invoice>) => void;
  onAddTask: (task: Partial<Task>) => void;
  onUpdateInstallment: (id: string, paid: number, remaining: number, status: 'paid' | 'pending' | 'overdue') => void;
  onAddTransaction?: (tx: any) => void;
  showToast: (msg: string) => void;
  currency?: string;
  userRole?: 'admin' | 'employee';
}

export default function CompanyAcademyView({
  courses,
  clients,
  installments,
  invoices,
  tasks,
  onAddCourse,
  onAddClient,
  onAddInvoice,
  onAddTask,
  onUpdateInstallment,
  onAddTransaction,
  showToast,
  currency = 'EGP',
  userRole = 'admin',
}: CompanyAcademyViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<
    'courses' | 'students' | 'installments' | 'invoices' | 'cost_centers' | 'team_tasks'
  >('courses');

  const [searchQuery, setSearchQuery] = useState('');

  // Form Modal States
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddInvoiceOpen, setIsAddInvoiceOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<Course | null>(null);

  // New Course Form State
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCategory, setCourseCategory] = useState<Course['category']>('برمجة وتطوير');
  const [courseInstructor, setCourseInstructor] = useState('');
  const [coursePrice, setCoursePrice] = useState('');
  const [courseDuration, setCourseDuration] = useState('8 أسابيع');
  const [courseMaxStudents, setCourseMaxStudents] = useState('30');

  // New Student Form State
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentType, setStudentType] = useState<'student' | 'company' | 'vip'>('student');
  const [studentCourse, setStudentCourse] = useState('');

  // New Invoice Form State
  const [invClientName, setInvClientName] = useState('');
  const [invService, setInvService] = useState('');
  const [invAmount, setInvAmount] = useState('');

  // Cost Centers Data (Mock & Interactive)
  const [costCenters, setCostCenters] = useState<CostCenter[]>([
    {
      id: 'cc1',
      code: 'CC-01',
      name: 'فرع القاهرة - المقر الرئيسي',
      manager: 'م. أحمد جودة',
      totalRevenue: 185000,
      totalExpense: 62000,
      netProfit: 123000,
      status: 'active',
    },
    {
      id: 'cc2',
      code: 'CC-02',
      name: 'قطاع التدريب الأونلاين والمنصة',
      manager: 'م. صابر عبد الرحمن',
      totalRevenue: 240000,
      totalExpense: 45000,
      netProfit: 195000,
      status: 'active',
    },
    {
      id: 'cc3',
      code: 'CC-03',
      name: 'فرع الإسكندرية',
      manager: 'أ. مريم السيد',
      totalRevenue: 95000,
      totalExpense: 38000,
      netProfit: 57000,
      status: 'active',
    },
    {
      id: 'cc4',
      code: 'CC-04',
      name: 'قسم الاستشارات والحلول المؤسسية للشركات',
      manager: 'د. خالد إبراهيم',
      totalRevenue: 310000,
      totalExpense: 85000,
      netProfit: 225000,
      status: 'active',
    },
  ]);

  // Total KPIs Calculation
  const totalAcademyRevenue = invoices.reduce((acc, inv) => acc + inv.amount, 0) + 530000;
  const totalActiveStudents = clients.length + 84;
  const totalActiveCourses = courses.length;
  const pendingInstallmentsTotal = installments
    .filter((i) => i.status !== 'paid')
    .reduce((acc, i) => acc + i.remainingAmount, 0);

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle || !courseInstructor || !coursePrice) {
      showToast('يرجى ملء جميع الخانات الأساسية للكورس');
      return;
    }

    onAddCourse({
      id: 'c_' + Date.now(),
      title: courseTitle,
      subtitle: 'دورة تدريبية متقدمة مع مشاريع حية',
      category: courseCategory,
      instructor: courseInstructor,
      price: parseFloat(coursePrice) || 0,
      duration: courseDuration,
      maxStudents: parseInt(courseMaxStudents) || 30,
      studentsCount: 1,
      progress: 0,
      status: 'active',
      level: 'متوسط',
    });

    setIsAddCourseOpen(false);
    setCourseTitle('');
    setCourseInstructor('');
    setCoursePrice('');
    showToast('تمت إضافة الدورة التدريبية بنجاح إلى الأكاديمية ✓');
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !studentPhone) {
      showToast('يرجى كتابة اسم الطالب ورقم الهاتف');
      return;
    }

    onAddClient({
      id: 'st_' + Date.now(),
      name: studentName,
      email: studentEmail || 'student@academy.com',
      phone: studentPhone,
      type: studentType,
      typeLabel: studentType === 'company' ? 'تدريب مؤسسي' : studentType === 'vip' ? 'عميل خاص VIP' : 'متدرب',
      coursesEnrolled: [studentCourse || 'دبلومة عامة'],
      totalPaid: 0,
      initials: studentName.slice(0, 2),
    });

    setIsAddStudentOpen(false);
    setStudentName('');
    setStudentEmail('');
    setStudentPhone('');
    showToast('تم تسجيل الطالب/العميل بنجاح ✓');
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invClientName || !invAmount) {
      showToast('يرجى تحديد اسم العميل/الطالب والمبلغ');
      return;
    }

    const invAmountVal = parseFloat(invAmount) || 0;
    const invoiceNum = 'INV-' + Math.floor(1000 + Math.random() * 9000);

    onAddInvoice({
      id: 'inv_' + Date.now(),
      invoiceNumber: invoiceNum,
      clientName: invClientName,
      courseOrService: invService || 'خدمة تدريب واستشارات',
      date: new Date().toISOString().split('T')[0],
      amount: invAmountVal,
      status: 'paid',
    });

    // Auto-Interconnect: Automatically log an Income Transaction in the primary Company Wallet
    if (onAddTransaction) {
      onAddTransaction({
        id: 'tx_inv_' + Date.now(),
        type: 'income',
        amount: invAmountVal,
        currency: currency,
        walletName: 'الحساب البنكي للشركة (CIB)',
        category: 'مبيعات الكورسات والحلول',
        date: new Date().toISOString().split('T')[0],
        notes: `تحصيل إيراد فاتورة إلكترونية ${invoiceNum} - العميل: ${invClientName}`,
      });
    }

    setIsAddInvoiceOpen(false);
    setInvClientName('');
    setInvService('');
    setInvAmount('');
    showToast('تم إصدار الفاتورة الإلكترونية وتسجيل الإيراد تلقائياً في حساب الشركة البنكي ✓');
  };

  return (
    <div className="space-y-6 dir-rtl">
      {/* Active Role Notice Banner */}
      <div
        className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-bold transition-all ${
          userRole === 'admin'
            ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200'
            : 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-2xs">
            {userRole === 'admin' ? '🛡️' : '👤'}
          </span>
          <div>
            <span className="font-black block text-sm">
              {userRole === 'admin'
                ? 'Saber Group - واجهة مدير النظام (كامل الصلاحيات والإدارة)'
                : 'Saber Group - واجهة الموظف التشغيلي (تسجيل العمليات والفواتير)'}
            </span>
            <span className="text-[11px] font-normal opacity-90 block mt-0.5">
              {userRole === 'admin'
                ? 'متاح تحليلات الأرباح، مراكز التكلفة، التحكم في صلاحيات الموظفين، وحذف القيود المحاسبية.'
                : 'متاح للعمليات اليومية: إصدار فواتير المبيعات، تحصيل الأقساط، تسجيل الطلاب، وإنجاز المهام.'}
            </span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 font-extrabold text-[11px] shadow-2xs">
          {userRole === 'admin' ? 'صلاحية مدير' : 'صلاحية موظف'}
        </span>
      </div>

      {/* Top Banner & Company/Academy Title */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>نظام إدارة الشركات والأكاديميات والمراكز التدريبية</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black leading-tight text-white">
              منظومة الأكاديمية والمؤسسة المالية الشاملة
            </h2>
            <p className="text-xs text-blue-200/90 max-w-2xl leading-relaxed">
              إدارة كاملة للكورسات والدبلومات، الطلاب والعملاء، أقساط الدورات، الفواتير الإلكترونية، ومراكز التكلفة للأكاديمية والشركة في مكان واحد.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsAddCourseOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg cursor-pointer"
            >
              <GraduationCap className="w-4 h-4" />
              <span>إضافة كورس جديد</span>
            </button>
            <button
              onClick={() => setIsAddStudentOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs flex items-center gap-2 transition-all border border-white/20 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>تسجيل طالب/عميل</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick KPI Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              إجمالي إيرادات الأكاديمية والشركة
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-slate-900 dark:text-white">
                {totalAcademyRevenue.toLocaleString()}
              </span>
              <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">{currency}</span>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3 inline" /> +18.5% مقارنة بالشهر السابق
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Active Students & Corporate Clients */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              المتدربين والعملاء المؤسسيين
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-slate-900 dark:text-white">
                {totalActiveStudents}
              </span>
              <span className="text-xs font-extrabold text-slate-500">متدرب/عميل</span>
            </div>
            <span className="text-[10px] text-slate-500 font-bold">12 عقد تدريب شركات</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Active Training Programs */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              الدورات والدبلومات النشطة
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-slate-900 dark:text-white">
                {totalActiveCourses}
              </span>
              <span className="text-xs font-extrabold text-indigo-600">برنامج تدريبي</span>
            </div>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">معدل الإنجاز 82%</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Pending Installments */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              أقساط الطلاب المستحقة
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-amber-600 dark:text-amber-400">
                {pendingInstallmentsTotal.toLocaleString()}
              </span>
              <span className="text-xs font-extrabold text-amber-600">{currency}</span>
            </div>
            <span className="text-[10px] text-amber-600 font-bold">تستحق هذا الشهر</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs for Company & Academy System */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('courses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'courses'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>1. الكورسات والدبلومات التدريبية ({courses.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('students')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'students'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>2. الطلاب والعملاء ({clients.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('installments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'installments'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>3. أقساط الكورسات ({installments.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('invoices')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'invoices'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>4. الفواتير والمبيعات ({invoices.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('cost_centers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'cost_centers'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>5. مراكز التكلفة والفروع ({costCenters.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('team_tasks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'team_tasks'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>6. مهام فريق الأكاديمية ({tasks.length})</span>
        </button>
      </div>

      {/* Search Bar & Actions */}
      <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-3 py-2 rounded-xl flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في الكورسات، الطلاب، الفواتير أو المحاضرين..."
            className="bg-transparent border-none text-xs text-slate-800 dark:text-slate-100 focus:outline-none w-full"
          />
        </div>

        {activeSubTab === 'courses' && (
          <button
            onClick={() => setIsAddCourseOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>كورس جديد</span>
          </button>
        )}

        {activeSubTab === 'students' && (
          <button
            onClick={() => setIsAddStudentOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل طالب/عميل</span>
          </button>
        )}

        {activeSubTab === 'invoices' && (
          <button
            onClick={() => setIsAddInvoiceOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إصدار فاتورة جديدة</span>
          </button>
        )}
      </div>

      {/* SUB-TAB 1: COURSES & TRAINING PROGRAMS */}
      {activeSubTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {courses
            .filter((c) => c.title.includes(searchQuery) || c.instructor.includes(searchQuery))
            .map((course) => (
              <div
                key={course.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 text-[11px] font-extrabold border border-blue-200 dark:border-blue-800">
                      {course.category}
                    </span>
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {course.price.toLocaleString()} {currency}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {course.subtitle}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 font-bold">
                    <span>المدرب المعتمد:</span>
                    <span className="text-blue-600 dark:text-blue-400 font-extrabold">{course.instructor}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>عدد المتدربين:</span>
                    <span className="font-extrabold">
                      {course.studentsCount} / {course.maxStudents} طالب
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-extrabold">
                      <span className="text-slate-500">نسبة انجاز البرنامج:</span>
                      <span className="text-blue-600">{course.progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-500 font-medium">{course.duration}</span>
                    <button
                      onClick={() => setSelectedCourseDetail(course)}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                    >
                      عرض سِجل الطلاب والأقساط
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* SUB-TAB 2: STUDENTS & CLIENTS */}
      {activeSubTab === 'students' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-black text-sm text-slate-900 dark:text-white flex items-center justify-between">
            <span>سجل الطلاب والعملاء المسجلين بالأكاديمية</span>
            <span className="text-xs text-slate-500 font-normal">إجمالي: {clients.length} سجل</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-extrabold border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">الاسم والبيانات</th>
                  <th className="p-3.5">نوع العميل/البرنامج</th>
                  <th className="p-3.5">الكورسات المسجل بها</th>
                  <th className="p-3.5">إجمالي المبالغ المدفوعة</th>
                  <th className="p-3.5">التواصل والإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                          {client.initials}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">{client.name}</span>
                          <span className="text-[11px] text-slate-500 dir-ltr block">{client.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-[11px]">
                        {client.typeLabel}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1">
                        {client.coursesEnrolled.map((c, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5 font-black text-emerald-600 dark:text-emerald-400">
                      {client.totalPaid.toLocaleString()} {currency}
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${client.phone}`}
                          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-blue-600 transition-colors"
                          title="اتصال"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => showToast(`فتح سجل الطالب: ${client.name}`)}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          تفاصيل الطالب
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: STUDENT INSTALLMENTS */}
      {activeSubTab === 'installments' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {installments.map((inst) => (
              <div
                key={inst.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white text-sm">{inst.clientName}</h4>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-bold">{inst.courseTitle}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black ${
                      inst.status === 'paid'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    {inst.status === 'paid' ? 'مكتمل السداد ✓' : 'قسط مستحق'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-center text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">إجمالي الكورس</span>
                    <span className="font-black text-slate-800 dark:text-slate-100">{inst.totalAmount} {currency}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">المدفوع</span>
                    <span className="font-black text-emerald-600">{inst.paidAmount} {currency}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">المتبقي</span>
                    <span className="font-black text-amber-600">{inst.remainingAmount} {currency}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-500 font-medium">تاريخ الاستحقاق: {inst.dueDate}</span>
                  {inst.status !== 'paid' && (
                    <button
                      onClick={() => {
                        onUpdateInstallment(inst.id, inst.totalAmount, 0, 'paid');
                        showToast(`تم سداد قسط الطالب ${inst.clientName} بنجاح ✓`);
                      }}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-xs transition-all cursor-pointer"
                    >
                      تسجيل دفعة قسط
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: INVOICES & SALES */}
      {activeSubTab === 'invoices' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-black text-sm text-slate-900 dark:text-white flex items-center justify-between">
            <span>سجل الفواتير والمبيعات الإلكترونية</span>
            <button
              onClick={() => setIsAddInvoiceOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
            >
              + إصدار فاتورة
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-extrabold border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">رقم الفاتورة</th>
                  <th className="p-3.5">العميل / الطالب</th>
                  <th className="p-3.5">الخدمة أو الكورس</th>
                  <th className="p-3.5">التاريخ</th>
                  <th className="p-3.5">المبلغ</th>
                  <th className="p-3.5">حالة الدفع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-blue-600">{inv.invoiceNumber}</td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">{inv.clientName}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300">{inv.courseOrService}</td>
                    <td className="p-3.5 text-slate-500">{inv.date}</td>
                    <td className="p-3.5 font-black text-slate-900 dark:text-white">
                      {inv.amount.toLocaleString()} {currency}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                        مدفوعة بالكامل ✓
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: COST CENTERS & BRANCHES */}
      {activeSubTab === 'cost_centers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {costCenters.map((cc) => (
            <div
              key={cc.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-mono font-bold">
                    {cc.code}
                  </span>
                  <h4 className="font-black text-slate-900 dark:text-white text-base mt-1">{cc.name}</h4>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                  نشط
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-center text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">الإيرادات</span>
                  <span className="font-black text-emerald-600">{cc.totalRevenue.toLocaleString()} {currency}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">المصروفات</span>
                  <span className="font-black text-rose-500">{cc.totalExpense.toLocaleString()} {currency}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">صافي الربح</span>
                  <span className="font-black text-blue-600">{cc.netProfit.toLocaleString()} {currency}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>المشرف المسئول: <strong className="text-slate-800 dark:text-slate-200">{cc.manager}</strong></span>
                <button
                  onClick={() => showToast(`تقرير مركز التكلفة: ${cc.name}`)}
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                >
                  استعراض التقرير المالي
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-TAB 6: TEAM TASKS */}
      {activeSubTab === 'team_tasks' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Todo Column */}
          <div className="space-y-3 p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between font-black text-xs text-slate-700 dark:text-slate-200">
              <span>مهام مطلوبة (To-Do)</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100">
                {tasks.filter((t) => t.column === 'todo').length}
              </span>
            </div>

            {tasks
              .filter((t) => t.column === 'todo')
              .map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
                >
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white">{task.title}</h5>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{task.assignee}</span>
                    <span className="text-blue-600 font-bold">{task.dueDate}</span>
                  </div>
                </div>
              ))}
          </div>

          {/* In Progress Column */}
          <div className="space-y-3 p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between font-black text-xs text-amber-700 dark:text-amber-400">
              <span>جاري التنفيذ (In Progress)</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200">
                {tasks.filter((t) => t.column === 'in_progress').length}
              </span>
            </div>

            {tasks
              .filter((t) => t.column === 'in_progress')
              .map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 border-r-4 border-r-amber-500"
                >
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white">{task.title}</h5>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{task.assignee}</span>
                    <span className="text-amber-600 font-bold">{task.dueDate}</span>
                  </div>
                </div>
              ))}
          </div>

          {/* Done Column */}
          <div className="space-y-3 p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between font-black text-xs text-emerald-700 dark:text-emerald-400">
              <span>مكتملة (Done)</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200">
                {tasks.filter((t) => t.column === 'done').length}
              </span>
            </div>

            {tasks
              .filter((t) => t.column === 'done')
              .map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 border-r-4 border-r-emerald-500 opacity-80"
                >
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white line-through">{task.title}</h5>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{task.assignee}</span>
                    <span className="text-emerald-600 font-bold">مكتمل ✓</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD NEW COURSE */}
      {isAddCourseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 dir-rtl">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-slate-900 dark:text-white text-base">إضافة كورس / دبلومة جديدة</h3>
              <button onClick={() => setIsAddCourseOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">اسم الدورة / الدبلومة</label>
                <input
                  type="text"
                  required
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="مثال: دبلومة البرمجة والذكاء الاصطناعي"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">التصنيف</label>
                  <select
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="برمجة وتطوير">برمجة وتطوير</option>
                    <option value="تسويق رقمي">تسويق رقمي</option>
                    <option value="إدارة أعمال">إدارة أعمال</option>
                    <option value="تصميم ومونتاج">تصميم ومونتاج</option>
                    <option value="ذكاء اصطناعي">ذكاء اصطناعي</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">المدرب المعتمد</label>
                  <input
                    type="text"
                    required
                    value={courseInstructor}
                    onChange={(e) => setCourseInstructor(e.target.value)}
                    placeholder="اسم المحاضر"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">السعر ({currency})</label>
                  <input
                    type="number"
                    required
                    value={coursePrice}
                    onChange={(e) => setCoursePrice(e.target.value)}
                    placeholder="4500"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">المدة الزمانية</label>
                  <input
                    type="text"
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                    placeholder="12 أسبوع"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCourseOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold">
                  حفظ الدورة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD STUDENT */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 dir-rtl">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-slate-900 dark:text-white text-base">تسجيل طالب / عميل جديد</h3>
              <button onClick={() => setIsAddStudentOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">اسم الطالب / الشركة</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="الاسم الثلاثي"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">رقم الهاتف</label>
                  <input
                    type="tel"
                    required
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    placeholder="01012345678"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="student@gmail.com"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الكورس المسجل به</label>
                <input
                  type="text"
                  value={studentCourse}
                  onChange={(e) => setStudentCourse(e.target.value)}
                  placeholder="دبلومة الويب المتكاملة"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold">
                  تأكيد التسجيل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD INVOICE */}
      {isAddInvoiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 dir-rtl">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-slate-900 dark:text-white text-base">إصدار فاتورة مبيعات جديدة</h3>
              <button onClick={() => setIsAddInvoiceOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">اسم العميل / الطالب</label>
                <input
                  type="text"
                  required
                  value={invClientName}
                  onChange={(e) => setInvClientName(e.target.value)}
                  placeholder="اسم العميل أو اسم الشركة"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الخدمة أو الكورس</label>
                <input
                  type="text"
                  value={invService}
                  onChange={(e) => setInvService(e.target.value)}
                  placeholder="رسوم دبلومة التدريب الشاملة"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">المبلغ الإجمالي ({currency})</label>
                <input
                  type="number"
                  required
                  value={invAmount}
                  onChange={(e) => setInvAmount(e.target.value)}
                  placeholder="4500"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddInvoiceOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold">
                  إصدار الفاتورة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: COURSE ROSTER & STUDENT PAYMENTS DETAIL */}
      {selectedCourseDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 dir-rtl">
          <div className="w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 text-xs font-black">
                  {selectedCourseDetail.category} - {selectedCourseDetail.level}
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  سجل طلاب كورس: {selectedCourseDetail.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  المدرب: {selectedCourseDetail.instructor} | سعر الكورس: {selectedCourseDetail.price.toLocaleString()} {currency}
                </p>
              </div>
              <button
                onClick={() => setSelectedCourseDetail(null)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Course Summary Banner */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50">
              <div>
                <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300 block">إجمالي المقيدين</span>
                <span className="text-base font-black text-blue-900 dark:text-blue-100">
                  {selectedCourseDetail.studentsCount} طالب / متدرب
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300 block">سعر الاشتراك</span>
                <span className="text-base font-black text-blue-900 dark:text-blue-100">
                  {selectedCourseDetail.price.toLocaleString()} {currency}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300 block">إجمالي الدخل المتوقع</span>
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                  {(selectedCourseDetail.studentsCount * selectedCourseDetail.price).toLocaleString()} {currency}
                </span>
              </div>
            </div>

            {/* Enrolled Students Table */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  قائمة الطلاب المسجلين بهذا الكورس وحساباتهم المالية
                </h4>
                <button
                  onClick={() => {
                    setStudentCourse(selectedCourseDetail.title);
                    setIsAddStudentOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة طالب لهذا الكورس</span>
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/80 font-black text-slate-500 border-b border-slate-200 dark:border-slate-800">
                      <th className="p-3">اسم الطالب / المتدرب</th>
                      <th className="p-3">رقم الهاتف</th>
                      <th className="p-3">إجمالي الرسوم</th>
                      <th className="p-3">المبلغ المدفوع</th>
                      <th className="p-3">المبلغ المتبقي</th>
                      <th className="p-3">حالة السداد</th>
                      <th className="p-3 text-center">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {installments
                      .filter(
                        (i) =>
                          i.courseTitle === selectedCourseDetail.title ||
                          selectedCourseDetail.title.includes(i.courseTitle)
                      )
                      .concat(
                        clients
                          .filter((cl) => cl.coursesEnrolled.includes(selectedCourseDetail.title))
                          .map((cl, idx) => ({
                            id: `cl_inst_${idx}`,
                            clientName: cl.name,
                            phone: cl.phone,
                            courseTitle: selectedCourseDetail.title,
                            totalAmount: selectedCourseDetail.price,
                            paidAmount: cl.totalPaid || selectedCourseDetail.price,
                            remainingAmount: Math.max(0, selectedCourseDetail.price - (cl.totalPaid || selectedCourseDetail.price)),
                            installmentNumber: 1,
                            totalInstallments: 1,
                            installmentAmount: selectedCourseDetail.price,
                            dueDate: '2026-10-01',
                            status: (cl.totalPaid >= selectedCourseDetail.price ? 'paid' : 'pending') as 'paid' | 'pending' | 'overdue',
                          }))
                      )
                      .filter((value, index, self) => index === self.findIndex((t) => t.clientName === value.clientName))
                      .map((inst) => (
                        <tr key={inst.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                          <td className="p-3 font-bold text-slate-900 dark:text-white">{inst.clientName}</td>
                          <td className="p-3 font-mono text-slate-500">{inst.phone}</td>
                          <td className="p-3 font-bold">{inst.totalAmount.toLocaleString()} {currency}</td>
                          <td className="p-3 font-bold text-emerald-600">{inst.paidAmount.toLocaleString()} {currency}</td>
                          <td className="p-3 font-bold text-rose-600">{inst.remainingAmount.toLocaleString()} {currency}</td>
                          <td className="p-3">
                            {inst.remainingAmount === 0 || inst.status === 'paid' ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                                مدفوع بالكامل ✓
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">
                                متبقي قسط
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            {inst.remainingAmount > 0 && (
                              <button
                                onClick={() => {
                                  onUpdateInstallment(inst.id, inst.totalAmount, 0, 'paid');
                                  showToast(`تم تحصيل بافي اشتراك الطالب ${inst.clientName} بنجاح ✓`);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] cursor-pointer"
                              >
                                تحصيل الباقي
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedCourseDetail(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
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
