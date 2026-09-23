import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  GraduationCap,
  Users,
  CheckSquare,
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  Mail,
  Phone,
  ArrowRight,
  Filter,
  X,
  Printer,
  Sparkles,
  ArrowUpRight,
  BookOpen,
  Award,
  Calendar,
  TrendingUp,
  BarChart3,
  DollarSign,
  Activity,
  Layers,
  ArrowDownRight,
  Percent,
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import TaskCalendarView from './TaskCalendarView';
import {
  Course,
  ClientOrStudent,
  Task,
  Invoice,
  BusinessSubTab,
} from '../types';

// Performance Monitor Data: Monthly Correlation between Student Growth and Financial Revenue
const MONITOR_PERFORMANCE_DATA = [
  { month: 'يناير', students: 180, newStudents: 45, revenue: 145000, revenueK: 145 },
  { month: 'فبراير', students: 260, newStudents: 80, revenue: 220000, revenueK: 220 },
  { month: 'مارس', students: 390, newStudents: 130, revenue: 340000, revenueK: 340 },
  { month: 'أبريل', students: 540, newStudents: 150, revenue: 470000, revenueK: 470 },
  { month: 'مايو', students: 720, newStudents: 180, revenue: 610000, revenueK: 610 },
  { month: 'يونيو', students: 910, newStudents: 190, revenue: 780000, revenueK: 780 },
  { month: 'يوليو', students: 1120, newStudents: 210, revenue: 950000, revenueK: 950 },
  { month: 'أغسطس', students: 1310, newStudents: 190, revenue: 1120000, revenueK: 1120 },
  { month: 'سبتمبر', students: 1450, newStudents: 140, revenue: 1260000, revenueK: 1260 },
];

const TRACK_REVENUE_CONTRIBUTIONS = [
  { track: 'برمجة وتطوير ويب', students: 580, revenue: 2450000, share: 41.5, color: '#2563EB' },
  { track: 'ذكاء اصطناعي ونظم', students: 360, revenue: 1620000, share: 27.5, color: '#0284C7' },
  { track: 'تسويق رقمي ومبيعات', students: 280, revenue: 1180000, share: 20.0, color: '#10B981' },
  { track: 'تصميم ومونتاج إبداعي', students: 230, revenue: 645000, share: 11.0, color: '#6366F1' },
];

interface AcademyBusinessViewProps {
  initialSubTab?: BusinessSubTab;
  courses: Course[];
  clients: ClientOrStudent[];
  tasks: Task[];
  invoices: Invoice[];
  searchQuery: string;
  onOpenAddModal: () => void;
  onUpdateTaskColumn: (taskId: string, column: Task['column']) => void;
  showToast: (msg: string) => void;
}

export default function AcademyBusinessView({
  initialSubTab = 'courses',
  courses,
  clients,
  tasks,
  invoices,
  searchQuery,
  onOpenAddModal,
  onUpdateTaskColumn,
  showToast,
}: AcademyBusinessViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<BusinessSubTab>(initialSubTab);
  const [courseCategoryFilter, setCourseCategoryFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [monitorMetric, setMonitorMetric] = useState<'combined' | 'students' | 'revenue'>('combined');
  const [monitorTimeframe, setMonitorTimeframe] = useState<'9m' | '6m' | '3m'>('9m');
  const [taskViewMode, setTaskViewMode] = useState<'kanban' | 'calendar'>('kanban');
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  const subTabs = [
    { id: 'courses' as BusinessSubTab, label: 'الدورات التدريبية', icon: GraduationCap, count: courses.length },
    { id: 'clients' as BusinessSubTab, label: 'المتدربون والشركات', icon: Users, count: clients.length },
    { id: 'tasks' as BusinessSubTab, label: 'إدارة المهام', icon: CheckSquare, count: tasks.length },
    { id: 'calendar' as BusinessSubTab, label: 'تقويم المهام والمواعيد', icon: Calendar, count: tasks.length },
    { id: 'invoices' as BusinessSubTab, label: 'الفواتير والتحصيل', icon: FileText, count: invoices.length },
    { id: 'monitor' as BusinessSubTab, label: 'المونيتور ومؤشرات النمو', icon: TrendingUp, count: 1450 },
  ];

  // Filters
  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.includes(searchQuery) ||
      c.subtitle.includes(searchQuery) ||
      c.instructor.includes(searchQuery);
    const matchesCat = courseCategoryFilter === 'all' || c.category.includes(courseCategoryFilter);
    return matchesSearch && matchesCat;
  });

  const filteredClients = clients.filter(
    (cl) =>
      cl.name.includes(searchQuery) ||
      cl.email.includes(searchQuery) ||
      cl.phone.includes(searchQuery)
  );

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.includes(searchQuery) ||
      t.assignee.includes(searchQuery) ||
      t.courseOrProject.includes(searchQuery)
  );

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceNumber.includes(searchQuery) ||
      inv.clientName.includes(searchQuery) ||
      inv.courseOrService.includes(searchQuery)
  );

  return (
    <div className="space-y-4 pb-20">
      {/* Quick Monitor Snapshot Teaser (Visible across other subtabs) */}
      {activeSubTab !== 'monitor' && (
        <div
          onClick={() => setActiveSubTab('monitor')}
          className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 hover:border-blue-400 transition-all cursor-pointer flex items-center justify-between gap-3 group shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">مونيتور الأكاديمية: نمو الطلاب والإيرادات المالية</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
                  +18.4% نمو شهري
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                1,450 متدرب نشط • 5,895,000 ج.م إيرادات محصلة • انقر لفتح التحليل البياني الشامل (Recharts)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-[-4px] transition-transform shrink-0">
            <span>فتح المونيتور</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </div>
        </div>
      )}

      {/* Distinctive Segmented Menu Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200/80 rounded-2xl overflow-x-auto scrollbar-none shadow-xs">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 1. COURSES TAB */}
      {activeSubTab === 'courses' && (
        <div className="space-y-3">
          {/* Header with Category Filter and Add Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
              <span className="text-slate-500 text-xs flex items-center gap-1 shrink-0 ml-1">
                <Filter className="w-3 h-3 text-blue-600" />
                <span>تصنيف:</span>
              </span>
              {[
                { id: 'all', label: 'الكل' },
                { id: 'برمجة وتطوير', label: 'برمجة' },
                { id: 'تسويق رقمي', label: 'تسويق' },
                { id: 'تصميم ومونتاج', label: 'تصميم' },
                { id: 'ذكاء اصطناعي', label: 'AI' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCourseCategoryFilter(cat.id)}
                  className={`text-[11px] font-bold px-3 py-1 rounded-xl border transition-all duration-150 shrink-0 cursor-pointer ${
                    courseCategoryFilter === cat.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
              onClick={onOpenAddModal}
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm shadow-blue-500/20 shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>دورة جديدة</span>
            </motion.button>
          </div>

          {/* Courses Distinctive List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredCourses.map((course) => (
              <motion.div
                key={course.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCourse(course)}
                className="relative overflow-hidden rounded-2xl p-4 bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-md hover:-translate-y-1 transition-all duration-200 shadow-xs group cursor-pointer"
              >
                <div>
                  {/* Status and Category */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                        {course.category}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {course.level}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-all ${
                        course.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {course.status === 'active' ? 'جارية ومباشرة' : 'قيد التسجيل'}
                    </span>
                  </div>

                  {/* Course Title & Details */}
                  <h4 className="text-sm font-bold text-slate-900 mb-1 leading-snug group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h4>
                  <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">
                    {course.subtitle}
                  </p>

                  {/* Progress bar */}
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">الإنجاز التدريبي:</span>
                      <span className="font-bold text-blue-600">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-sky-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Meta details */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                      <span className="text-slate-700 font-medium">
                        المدرب: {course.instructor}
                      </span>
                      <span>•</span>
                      <span>
                        {course.studentsCount}/{course.maxStudents} طالب
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-black text-blue-600 text-sm">
                        {course.price.toLocaleString('ar-EG')} ج.م
                      </span>
                      <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <ArrowUpRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 2. CLIENTS & STUDENTS TAB */}
      {activeSubTab === 'clients' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700">
              قائمة المتدربين والعملاء المسجلين
            </h3>
            <button
              onClick={onOpenAddModal}
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm shadow-blue-500/20 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة متدرب</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar Initials Badge */}
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 border border-blue-200 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-blue-500/20 shrink-0">
                    {client.initials}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">
                        {client.name}
                      </h4>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                        {client.typeLabel}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 text-slate-700">
                        <Phone className="w-3 h-3 text-blue-600" />
                        <span dir="ltr">{client.phone}</span>
                      </span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{client.email}</span>
                      </span>
                    </div>

                    {/* Enrolled Courses */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {client.coursesEnrolled.map((courseName, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md"
                        >
                          {courseName}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <span className="text-[11px] text-slate-500">المدفوعات:</span>
                  <span className="text-sm font-black text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                    {client.totalPaid.toLocaleString('ar-EG')} ج.م
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. TASKS & KANBAN / CALENDAR TAB */}
      {activeSubTab === 'tasks' && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div>
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>المهام الإدارية والتنفيذية</span>
                <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                  {tasks.length} مهمة
                </span>
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">
                إدارة ومتابعة سير تنفيذ المهام ومواعيد استحقاقها المجدولة
              </p>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
              {/* View Switcher: Kanban vs Calendar */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setTaskViewMode('kanban')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                    taskViewMode === 'kanban'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>عرض كانبان</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTaskViewMode('calendar')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                    taskViewMode === 'calendar'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>عرض التقويم</span>
                </button>
              </div>

              {/* Open Calendar Window Button */}
              <button
                type="button"
                onClick={() => setIsCalendarModalOpen(true)}
                className="py-1.5 px-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                title="فتح نافذة التقويم المكبرة"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">نافذة التقويم</span>
              </button>

              <button
                type="button"
                onClick={onOpenAddModal}
                className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm shadow-blue-500/20 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>مهمة جديدة</span>
              </button>
            </div>
          </div>

          {taskViewMode === 'calendar' ? (
            <TaskCalendarView
              tasks={tasks}
              searchQuery={searchQuery}
              onUpdateTaskColumn={onUpdateTaskColumn}
              onOpenAddModal={onOpenAddModal}
              showToast={showToast}
            />
          ) : (

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Column 1: TODO */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700">
                  مخطط له (To Do)
                </span>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                  {tasks.filter((t) => t.column === 'todo').length}
                </span>
              </div>

              <div className="space-y-2">
                {tasks
                  .filter((t) => t.column === 'todo')
                  .map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:bg-white transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            task.priority === 'high'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {task.priority === 'high' ? 'أولوية قصوى' : 'متوسطة'}
                        </span>
                        <button
                          onClick={() => onUpdateTaskColumn(task.id, 'in_progress')}
                          className="text-[10px] text-blue-600 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                        >
                          <span>بدء التنفيذ</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      <h5 className="text-xs font-bold text-slate-900 leading-snug">
                        {task.title}
                      </h5>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200/70">
                        <span>المسؤول: {task.assignee}</span>
                        <span className="text-slate-400">{task.dueDate}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Column 2: IN PROGRESS */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-amber-700">
                  قيد التنفيذ (In Progress)
                </span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {tasks.filter((t) => t.column === 'in_progress').length}
                </span>
              </div>

              <div className="space-y-2">
                {tasks
                  .filter((t) => t.column === 'in_progress')
                  .map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-xl bg-amber-50/40 border border-amber-200/70 hover:border-amber-400 hover:bg-white transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                          جاري العمل
                        </span>
                        <button
                          onClick={() => onUpdateTaskColumn(task.id, 'done')}
                          className="text-[10px] text-emerald-600 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                        >
                          <span>اكتمال</span>
                          <CheckCircle2 className="w-3 h-3" />
                        </button>
                      </div>

                      <h5 className="text-xs font-bold text-slate-900 leading-snug">
                        {task.title}
                      </h5>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-amber-100">
                        <span>المسؤول: {task.assignee}</span>
                        <span className="text-slate-400">{task.dueDate}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Column 3: DONE */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-emerald-700">
                  مكتمل (Done)
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {tasks.filter((t) => t.column === 'done').length}
                </span>
              </div>

              <div className="space-y-2">
                {tasks
                  .filter((t) => t.column === 'done')
                  .map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-xl bg-emerald-50/30 border border-emerald-200/60 opacity-80 space-y-1.5"
                    >
                      <div className="flex items-center gap-1.5 text-emerald-700 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold">تم إنجازها</span>
                      </div>
                      <h5 className="text-xs font-medium text-slate-600 line-through leading-snug">
                        {task.title}
                      </h5>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          )}
        </div>
      )}

      {/* 3.5 DEDICATED CALENDAR SUBTAB */}
      {activeSubTab === 'calendar' && (
        <TaskCalendarView
          tasks={tasks}
          searchQuery={searchQuery}
          onUpdateTaskColumn={onUpdateTaskColumn}
          onOpenAddModal={onOpenAddModal}
          showToast={showToast}
        />
      )}

      {/* 4. INVOICES TAB */}
      {activeSubTab === 'invoices' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700">
              الفواتير والمطالبات المالية الصادرة
            </h3>
            <button
              onClick={onOpenAddModal}
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm shadow-blue-500/20 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إصدار فاتورة</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {filteredInvoices.map((inv) => (
              <motion.div
                key={inv.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedInvoice(inv)}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black text-slate-900 tracking-wide">
                      {inv.invoiceNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        inv.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : inv.status === 'pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {inv.status === 'paid'
                        ? 'مدفوعة'
                        : inv.status === 'pending'
                        ? 'قيد التحصيل'
                        : 'متأخرة'}
                    </span>
                  </div>

                  <h5 className="text-xs font-bold text-slate-800 group-hover:text-blue-600">
                    العميل: {inv.clientName}
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    {inv.courseOrService} • {inv.date}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <span className="text-[11px] text-slate-500">المبلغ الإجمالي:</span>
                  <span className="text-sm font-black text-blue-600 font-['Plus_Jakarta_Sans',sans-serif]">
                    {inv.amount.toLocaleString('ar-EG')} ج.م
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 5. MONITOR & GROWTH TAB (شاشة المونيتور: نمو الطلاب والإيرادات المالية) */}
      {activeSubTab === 'monitor' && (
        <div className="space-y-4">
          {/* Header & Controls Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>مونيتور نمو الأكاديمية والتدفق المالي</span>
                    <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200/60">
                      مباشر • محدث لحظياً
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    تحليل ارتباط نمو أعداد المتدربين المسجلين بالسيولة والإيرادات المالية المحصلة
                  </p>
                </div>
              </div>
            </div>

            {/* Timeframe Filter */}
            <div className="flex items-center gap-1.5 self-stretch sm:self-auto justify-end">
              <span className="text-slate-500 text-xs hidden sm:inline ml-1">النطاق:</span>
              {[
                { id: '3m', label: 'آخر 3 شهور' },
                { id: '6m', label: 'آخر 6 شهور' },
                { id: '9m', label: 'العام بالكامل (9 شهور)' },
              ].map((tf) => (
                <button
                  key={tf.id}
                  onClick={() => setMonitorTimeframe(tf.id as any)}
                  className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    monitorTimeframe === tf.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-blue-600'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4 Core KPI Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative overflow-hidden group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-slate-500">إجمالي المتدربين</span>
                <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  1,450
                </span>
                <span className="text-xs font-bold text-slate-400">طالب</span>
              </div>
              <div className="mt-1.5 flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                <TrendingUp className="w-3 h-3" />
                <span>+18.4% نمو إجمالي هذا الربع</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative overflow-hidden group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-slate-500">الإيرادات التراكمية</span>
                <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-blue-600 font-['Plus_Jakarta_Sans',sans-serif]">
                  5,895,000
                </span>
                <span className="text-xs font-bold text-blue-600">ج.م</span>
              </div>
              <div className="mt-1.5 flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                <TrendingUp className="w-3 h-3" />
                <span>+22.1% فوق المستهدف المالي</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative overflow-hidden group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-slate-500">متوسط الإيراد لكل طالب</span>
                <div className="w-6 h-6 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Percent className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  4,065
                </span>
                <span className="text-xs font-bold text-slate-400">ج.م/متدرب</span>
              </div>
              <div className="mt-1.5 flex items-center gap-1 text-[10px] text-sky-600 font-semibold">
                <Activity className="w-3 h-3" />
                <span>+350 ج.م مقارنة بالعام الماضي</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs relative overflow-hidden group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-slate-500">المتسجلون الجدد (سبتمبر)</span>
                <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  140
                </span>
                <span className="text-xs font-bold text-emerald-600">متدرب جديد</span>
              </div>
              <div className="mt-1.5 flex items-center gap-1 text-[10px] text-amber-600 font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                <span>94% نسبة إشغال المقاعد</span>
              </div>
            </div>
          </div>

          {/* Interactive Recharts Graph Panel */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    مخطط المسار الزمني: نمو عدد الطلاب ومطابقة الإيرادات المالية
                  </h4>
                  <span className="text-[10px] text-slate-500">
                    مقارنة شهرية مباشرة توضح وتيرة التوسع المالي والأكاديمي لمجموعة صابر
                  </span>
                </div>
              </div>

              {/* View Metric Mode Buttons */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
                {[
                  { id: 'combined', label: 'مخطط مدمج (طلاب + مال)' },
                  { id: 'students', label: 'نمو الطلاب' },
                  { id: 'revenue', label: 'الإيرادات (ج.م)' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setMonitorMetric(mode.id as any)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      monitorMetric === mode.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts Render Area */}
            <div className="w-full h-80 pt-2" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={
                    monitorTimeframe === '3m'
                      ? MONITOR_PERFORMANCE_DATA.slice(-3)
                      : monitorTimeframe === '6m'
                      ? MONITOR_PERFORMANCE_DATA.slice(-6)
                      : MONITOR_PERFORMANCE_DATA
                  }
                  margin={{ top: 15, right: 15, left: 15, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="monitorStudentsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="monitorRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284C7" stopOpacity={0.85} />
                      <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.25} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />

                  {/* Left Y-Axis for Students */}
                  {(monitorMetric === 'combined' || monitorMetric === 'students') && (
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      stroke="#2563EB"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickFormatter={(val) => `${val}`}
                    />
                  )}

                  {/* Right Y-Axis for Revenue */}
                  {(monitorMetric === 'combined' || monitorMetric === 'revenue') && (
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#0284C7"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickFormatter={(val) => `${val}K`}
                    />
                  )}

                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const dataItem = payload[0].payload;
                        return (
                          <div className="bg-white/95 border border-slate-200 backdrop-blur-md p-3 rounded-2xl shadow-xl text-right min-w-[190px]" dir="rtl">
                            <p className="text-xs font-black text-slate-900 mb-2 pb-1 border-b border-slate-100">
                              شهر {label}
                            </p>
                            <div className="space-y-1.5 text-[11px]">
                              <div className="flex items-center justify-between text-slate-600">
                                <span className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                                  <span>الطلاب الإجمالي:</span>
                                </span>
                                <span className="font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                                  {dataItem.students.toLocaleString('ar-EG')} طالب
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-slate-600">
                                <span className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                                  <span>تسجيل جديد بالشهر:</span>
                                </span>
                                <span className="font-bold text-amber-500 font-['Plus_Jakarta_Sans',sans-serif]">
                                  +{dataItem.newStudents} متدرب
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-100">
                                <span className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                                  <span>الإيرادات المحصلة:</span>
                                </span>
                                <span className="font-black text-blue-600 font-['Plus_Jakarta_Sans',sans-serif]">
                                  {dataItem.revenue.toLocaleString('ar-EG')} ج.م
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  <Legend
                    verticalAlign="top"
                    height={36}
                    formatter={(value) => {
                      if (value === 'students') return <span className="text-slate-600 text-xs font-semibold mr-1 ml-3">إجمالي المتدربين (طالب)</span>;
                      if (value === 'revenueK') return <span className="text-slate-600 text-xs font-semibold mr-1 ml-3">الإيرادات (آلاف ج.م)</span>;
                      if (value === 'newStudents') return <span className="text-slate-600 text-xs font-semibold mr-1 ml-3">متدربون جدد شهرياً</span>;
                      return value;
                    }}
                  />

                  {/* Revenue Bar */}
                  {(monitorMetric === 'combined' || monitorMetric === 'revenue') && (
                    <Bar
                      yAxisId={monitorMetric === 'combined' ? 'right' : 'right'}
                      dataKey="revenueK"
                      name="revenueK"
                      fill="url(#monitorRevenueGrad)"
                      radius={[6, 6, 0, 0]}
                      barSize={24}
                    />
                  )}

                  {/* Students Area / Line */}
                  {(monitorMetric === 'combined' || monitorMetric === 'students') && (
                    <Area
                      yAxisId={monitorMetric === 'combined' ? 'left' : 'left'}
                      type="monotone"
                      dataKey="students"
                      name="students"
                      stroke="#2563EB"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#monitorStudentsGrad)"
                      activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2, fill: '#1D4ED8' }}
                    />
                  )}

                  {/* Monthly new enrollments line */}
                  {monitorMetric === 'students' && (
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="newStudents"
                      name="newStudents"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#F59E0B' }}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Track Revenue Contribution Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">
                    توزيع الإيرادات وأعداد الطلاب حسب التخصص
                  </h4>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">4 مسارات رئيسية</span>
              </div>

              <div className="space-y-2.5 pt-1">
                {TRACK_REVENUE_CONTRIBUTIONS.map((track, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: track.color }} />
                        <span className="font-bold text-slate-900">{track.track}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500">{track.students} طالب</span>
                        <span className="text-xs font-black text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                          {track.revenue.toLocaleString('ar-EG')} ج.م
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${track.share}%`, backgroundColor: track.color }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>الحصة من إجمالي الإيراد الأكاديمي</span>
                      <span className="font-bold text-slate-700">{track.share}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Performance Insights */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">
                    تقرير المونيتور والذكاء التحليلي للنمو
                  </h4>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <span className="font-bold text-emerald-600 block mb-1">
                      ✓ أعلى مسار نمواً وإيراداً:
                    </span>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      مسار <strong className="text-slate-900">برمجة وتطوير الويب</strong> يمثل 41.5% من عوائد الأكاديمية بإجمالي 2,450,000 ج.م وبمتوسط 4,220 ج.م لكل طالب مسجل.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <span className="font-bold text-blue-600 block mb-1">
                      ⚡ مؤشر التسارع الأكاديمي:
                    </span>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      سجل شهر يوليو وأغسطس أعلى وتيرة إقبال (+400 طالب جديد مجمّع)، تزامن مع إطلاق دبلومة الذكاء الاصطناعي التوليدي والشهادات المعتمدة.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">كفاءة الاستيعاب التدريبي:</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                  96.8% رضا المتدربين
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Branded Invoice Modal */}
      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              onClick={() => setSelectedInvoice(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl z-10 text-right"
            >
              {/* Official Academy Header with Logo */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-100 mb-3">
                <BrandLogo size="xs" variant="horizontal" showSubtitle={true} />
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Invoice Badge & Details */}
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 mb-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block">رقم الفاتورة الضريبية</span>
                    <span className="text-sm font-mono font-bold text-slate-900">
                      {selectedInvoice.invoiceNumber}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                      selectedInvoice.status === 'paid'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : selectedInvoice.status === 'pending'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {selectedInvoice.status === 'paid' ? 'مدفوعة بالكامل ✓' : 'قيد التحصيل'}
                  </span>
                </div>

                <div className="pt-2 border-t border-blue-100 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">المرسل إليه (المتدرب):</span>
                    <span className="font-bold text-slate-900">{selectedInvoice.clientName}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">المسار التدريبي:</span>
                    <span className="font-medium text-blue-600">{selectedInvoice.courseOrService}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">تاريخ الإصدار:</span>
                    <span className="font-medium text-slate-700">{selectedInvoice.date}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-blue-200 flex justify-between items-baseline">
                  <span className="text-xs font-bold text-slate-700">المبلغ المستحق:</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                      {selectedInvoice.amount.toLocaleString('ar-EG')}
                    </span>
                    <span className="text-xs font-bold text-blue-600">ج.م</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    showToast(`تم نسخ وطباعة الفاتورة ${selectedInvoice.invoiceNumber} بنجاح`);
                    setSelectedInvoice(null);
                  }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-sky-600 text-white text-xs font-bold rounded-xl hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-blue-500/20"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة الفاتورة المعتمدة</span>
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Official Branded Course Detail Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              onClick={() => setSelectedCourse(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl z-10 text-right max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">تفاصيل المسار التدريبي</h3>
                    <span className="text-[10px] text-slate-500">أكاديمية صابر جروب للتدريب</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Course Identity Card */}
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 mb-4 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-md">
                      {selectedCourse.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {selectedCourse.level}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                      selectedCourse.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {selectedCourse.status === 'active' ? 'جارية ومباشرة ✓' : 'قيد التسجيل'}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-900 leading-snug">
                    {selectedCourse.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {selectedCourse.subtitle}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2 border-t border-blue-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">نسبة الإنجاز في المنهج:</span>
                    <span className="font-bold text-blue-600">{selectedCourse.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden p-0.5">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-sky-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${selectedCourse.progress}%` }}
                    />
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-100 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-blue-100 shadow-xs">
                    <span className="text-[10px] text-slate-500 block">المدرب المعتمد</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{selectedCourse.instructor}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-blue-100 shadow-xs">
                    <span className="text-[10px] text-slate-500 block">المتدربون المسجلون</span>
                    <span className="font-bold text-emerald-600 mt-0.5 block">
                      {selectedCourse.studentsCount} / {selectedCourse.maxStudents} طالب
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-blue-200">
                  <span className="text-xs font-bold text-slate-700">رسوم التسجيل للمتدرب:</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                      {selectedCourse.price.toLocaleString('ar-EG')}
                    </span>
                    <span className="text-xs font-bold text-blue-600">ج.م</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    showToast(`تم إرسال إشعار لكافة متدربي مسار "${selectedCourse.title}" بنجاح`);
                    setSelectedCourse(null);
                  }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-sky-600 text-white text-xs font-bold rounded-xl hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-blue-500/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>إرسال تنبيه للمتدربين</span>
                </button>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </div>
        )}
        {/* CALENDAR MODAL / POPUP WINDOW */}
        {isCalendarModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="w-full max-w-5xl bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-2xl my-auto max-h-[92vh] overflow-y-auto"
              dir="rtl"
            >
              <TaskCalendarView
                tasks={tasks}
                searchQuery={searchQuery}
                onUpdateTaskColumn={onUpdateTaskColumn}
                onOpenAddModal={onOpenAddModal}
                showToast={showToast}
                isModal={true}
                onCloseModal={() => setIsCalendarModalOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
