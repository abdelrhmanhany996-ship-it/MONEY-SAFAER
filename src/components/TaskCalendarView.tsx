import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar as CalendarIcon,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Plus,
  Filter,
  CheckCheck,
  Briefcase,
  ArrowRight,
  Eye,
  Layers,
  X,
} from 'lucide-react';
import { Task } from '../types';

interface TaskCalendarViewProps {
  tasks: Task[];
  searchQuery?: string;
  onUpdateTaskColumn: (taskId: string, column: Task['column']) => void;
  onOpenAddModal: () => void;
  showToast: (msg: string) => void;
  isModal?: boolean;
  onCloseModal?: () => void;
}

const MONTH_NAMES_AR = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

const WEEKDAYS_AR = [
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
];

export default function TaskCalendarView({
  tasks,
  searchQuery = '',
  onUpdateTaskColumn,
  onOpenAddModal,
  showToast,
  isModal = false,
  onCloseModal,
}: TaskCalendarViewProps) {
  // Current active date in context: 2026-09-21
  const todayStr = '2026-09-21';
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(8); // 8 is September (0-indexed)
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-21');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'in_progress' | 'done'>('all');
  const [viewStyle, setViewStyle] = useState<'grid' | 'agenda'>('grid');

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleGoToToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(8);
    setSelectedDate('2026-09-21');
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        searchQuery === '' ||
        t.title.includes(searchQuery) ||
        t.assignee.includes(searchQuery) ||
        t.courseOrProject.includes(searchQuery);

      const matchesStatus = statusFilter === 'all' || t.column === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchQuery, statusFilter]);

  // Group tasks by scheduledDate (fallback to dueDate or default)
  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    filteredTasks.forEach((t) => {
      // Normalize task date into YYYY-MM-DD
      let dateKey = t.scheduledDate;
      if (!dateKey) {
        // synthesize consistent September 2026 date based on task ID if needed
        const num = Math.abs(t.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % 28 + 1;
        const dayFormatted = num < 10 ? `0${num}` : `${num}`;
        dateKey = `2026-09-${dayFormatted}`;
      }
      if (!map[dateKey]) {
        map[dateKey] = [];
      }
      map[dateKey].push(t);
    });
    return map;
  }, [filteredTasks]);

  // Calendar Grid Calculation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevM = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevY = currentMonth === 0 ? currentYear - 1 : currentYear;
      const mStr = prevM + 1 < 10 ? `0${prevM + 1}` : `${prevM + 1}`;
      const dStr = d < 10 ? `0${d}` : `${d}`;
      days.push({
        dayNumber: d,
        dateStr: `${prevY}-${mStr}-${dStr}`,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const mStr = currentMonth + 1 < 10 ? `0${currentMonth + 1}` : `${currentMonth + 1}`;
      const dStr = i < 10 ? `0${i}` : `${i}`;
      days.push({
        dayNumber: i,
        dateStr: `${currentYear}-${mStr}-${dStr}`,
        isCurrentMonth: true,
      });
    }

    // Next month filler days to complete grid (up to 35 or 42 cells)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const nextM = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextY = currentMonth === 11 ? currentYear + 1 : currentYear;
      const mStr = nextM + 1 < 10 ? `0${nextM + 1}` : `${nextM + 1}`;
      const dStr = i < 10 ? `0${i}` : `${i}`;
      days.push({
        dayNumber: i,
        dateStr: `${nextY}-${mStr}-${dStr}`,
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Tasks for the selected date
  const selectedDayTasks = tasksByDate[selectedDate] || [];

  // Format selected date in Arabic for title
  const formattedSelectedDate = useMemo(() => {
    if (!selectedDate) return '';
    const parts = selectedDate.split('-');
    const m = parseInt(parts[1]) - 1;
    return `${parts[2]} ${MONTH_NAMES_AR[m]} ${parts[0]}`;
  }, [selectedDate]);

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                تقويم مهام ومواعيد الأكاديمية (Calendar View)
              </h3>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200/60">
                {filteredTasks.length} مهمة مجدولة
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              استعراض ومتابعة استحقاق المهام التدريبية والتنفيذية حسب الأيام والتواريخ المحددة
            </p>
          </div>
        </div>

        {/* Navigation & Actions */}
        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-between md:justify-end">
          {/* Month Stepper */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={handlePrevMonth}
              title="الشهر السابق"
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <span className="text-xs font-black text-slate-900 px-2.5 min-w-[110px] text-center font-['Plus_Jakarta_Sans',sans-serif]">
              {MONTH_NAMES_AR[currentMonth]} {currentYear}
            </span>

            <button
              onClick={handleNextMonth}
              title="الشهر التالي"
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Today Button */}
          <button
            onClick={handleGoToToday}
            className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-all cursor-pointer"
          >
            اليوم (21 سبتمبر)
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setViewStyle('grid')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                viewStyle === 'grid'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              عرض شهري
            </button>
            <button
              onClick={() => setViewStyle('agenda')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                viewStyle === 'agenda'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              جدول زمني
            </button>
          </div>

          {/* Add task button */}
          <button
            onClick={onOpenAddModal}
            className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>جدولة مهمة</span>
          </button>

          {isModal && onCloseModal && (
            <button
              onClick={onCloseModal}
              className="p-1.5 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-slate-500 text-xs flex items-center gap-1 ml-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>الحالة:</span>
          </span>

          {[
            { id: 'all', label: 'كل المهام' },
            { id: 'todo', label: 'مخطط له (To Do)' },
            { id: 'in_progress', label: 'قيد التنفيذ (In Progress)' },
            { id: 'done', label: 'مكتملة (Done)' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === st.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-blue-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>أولوية قصوى</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>متوسطة</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>مكتملة</span>
          </span>
        </div>
      </div>

      {/* Main View: Grid or Agenda */}
      {viewStyle === 'grid' ? (
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          {/* Weekday Header */}
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {WEEKDAYS_AR.map((weekday, i) => (
              <div
                key={i}
                className="py-2 text-[11px] font-black text-slate-700 bg-slate-100 rounded-xl border border-slate-200/80"
              >
                {weekday}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((cell, idx) => {
              const isToday = cell.dateStr === todayStr;
              const isSelected = cell.dateStr === selectedDate;
              const dayTasks = tasksByDate[cell.dateStr] || [];
              const hasTasks = dayTasks.length > 0;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDate(cell.dateStr)}
                  className={`min-h-[105px] p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500/25 shadow-sm'
                      : isToday
                      ? 'bg-blue-50/40 border-blue-400'
                      : cell.isCurrentMonth
                      ? 'bg-white border-slate-200/80 hover:border-blue-300 hover:bg-slate-50/60'
                      : 'bg-slate-50/60 border-slate-100 opacity-50 hover:opacity-80'
                  }`}
                >
                  {/* Top Bar: Day Number & Today indicator */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold rounded-lg px-1.5 py-0.5 ${
                        isToday
                          ? 'bg-blue-600 text-white font-black'
                          : isSelected
                          ? 'bg-blue-100 text-blue-700 font-black'
                          : 'text-slate-700 group-hover:text-blue-600'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    {isToday && (
                      <span className="text-[9px] font-black text-white bg-blue-600 px-1.5 py-0.2 rounded-full">
                        اليوم
                      </span>
                    )}

                    {hasTasks && !isToday && (
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded-md border border-slate-200">
                        {dayTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Tasks List / Pills inside Day Cell */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {dayTasks.slice(0, 2).map((task) => (
                      <div
                        key={task.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTask(task);
                          setSelectedDate(cell.dateStr);
                        }}
                        className={`text-[10px] px-1.5 py-1 rounded-lg truncate border font-medium transition-all ${
                          task.column === 'done'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 line-through opacity-80'
                            : task.priority === 'high'
                            ? 'bg-rose-50 text-rose-700 border-rose-200 hover:border-rose-400'
                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-400'
                        }`}
                        title={`${task.title} (${task.assignee})`}
                      >
                        <span className="font-bold ml-1">
                          {task.time ? task.time.split(' ')[0] : '•'}
                        </span>
                        <span>{task.title}</span>
                      </div>
                    ))}

                    {dayTasks.length > 2 && (
                      <span className="text-[9px] text-slate-500 block text-center font-bold">
                        +{dayTasks.length - 2} مهام أخرى
                      </span>
                    )}
                  </div>

                  {/* Bottom indicator dots if no room */}
                  <div className="flex items-center gap-1 mt-1">
                    {dayTasks.map((t, i) => (
                      <span
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${
                          t.column === 'done'
                            ? 'bg-emerald-500'
                            : t.priority === 'high'
                            ? 'bg-rose-500'
                            : 'bg-amber-500'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Agenda / Timeline View */
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-slate-700 pb-2 border-b border-slate-100">
            الجدول الزمني التتابعي للمهام المستحقة
          </h4>

          <div className="space-y-2.5">
            {Object.keys(tasksByDate).sort().length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                لا توجد مهام تطابق الفلتر الحالي
              </div>
            ) : (
              Object.keys(tasksByDate)
                .sort()
                .map((dateStr) => {
                  const dayTasks = tasksByDate[dateStr];
                  const parts = dateStr.split('-');
                  const mIndex = parseInt(parts[1]) - 1;
                  const dNum = parseInt(parts[2]);
                  const isToday = dateStr === todayStr;

                  return (
                    <div
                      key={dateStr}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2"
                    >
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900">
                            {dNum} {MONTH_NAMES_AR[mIndex]} {parts[0]}
                          </span>
                          {isToday && (
                            <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-0.2 rounded-full">
                              اليوم
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {dayTasks.length} مهام
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {dayTasks.map((task) => (
                          <div
                            key={task.id}
                            onClick={() => setSelectedTask(task)}
                            className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-all cursor-pointer flex items-start justify-between gap-2 shadow-xs"
                          >
                            <div className="space-y-1">
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                  task.column === 'done'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : task.priority === 'high'
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {task.column === 'done'
                                  ? 'مكتملة'
                                  : task.priority === 'high'
                                  ? 'أولوية قصوى'
                                  : 'متوسطة'}
                              </span>
                              <h5 className="text-xs font-bold text-slate-900 leading-snug">
                                {task.title}
                              </h5>
                              <p className="text-[10px] text-slate-500 flex items-center gap-2">
                                <span>{task.courseOrProject}</span>
                                <span>•</span>
                                <span>{task.assignee}</span>
                              </p>
                            </div>

                            <div className="text-left shrink-0">
                              <span className="text-[10px] font-mono text-slate-500 block">
                                {task.time || task.dueDate}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      )}

      {/* Selected Day Inspector Panel */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">
                مهام اليوم المحدد: {formattedSelectedDate}
              </h4>
              <span className="text-[10px] text-slate-500">
                {selectedDayTasks.length === 0
                  ? 'لا توجد مهام مجدولة لهذا اليوم'
                  : `يوجد ${selectedDayTasks.length} مهام تنفيذية مسندة لفريق العمل`}
              </span>
            </div>
          </div>

          <button
            onClick={onOpenAddModal}
            className="py-1 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>جدولة مهمة بهذا اليوم</span>
          </button>
        </div>

        {/* Selected Day Task Items */}
        {selectedDayTasks.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-600 font-semibold">
              لا توجد التزامات أو مواعيد استحقاق في هذا اليوم
            </p>
            <p className="text-[11px] text-slate-400">
              يمكنك استغلال الوقت في التخطيط أو إضافة مهمة جديدة مباشرة
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedDayTasks.map((task) => (
              <div
                key={task.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        task.column === 'done'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : task.priority === 'high'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {task.priority === 'high' ? 'أولوية قصوى' : 'متوسطة'}
                    </span>

                    <span className="text-[9px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      {task.column === 'done'
                        ? 'مكتملة'
                        : task.column === 'in_progress'
                        ? 'قيد التنفيذ'
                        : 'مخطط له'}
                    </span>
                  </div>

                  {/* Move column quick buttons */}
                  <div className="flex items-center gap-1">
                    {task.column !== 'done' && (
                      <button
                        onClick={() =>
                          onUpdateTaskColumn(
                            task.id,
                            task.column === 'todo' ? 'in_progress' : 'done'
                          )
                        }
                        className="text-[10px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <CheckCheck className="w-3 h-3" />
                        <span>{task.column === 'todo' ? 'بدء التنفيذ' : 'إنجاز المهمة'}</span>
                      </button>
                    )}
                  </div>
                </div>

                <h5 className="text-xs font-bold text-slate-900 leading-snug">
                  {task.title}
                </h5>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3 h-3 text-blue-600" />
                    <span>المسؤول: {task.assignee}</span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-700 font-mono">
                    <Clock className="w-3 h-3 text-amber-500" />
                    <span>{task.time || task.dueDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task Details Dialog Modal */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedTask(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-5 shadow-2xl space-y-4 text-right"
              dir="rtl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedTask.priority === 'high'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {selectedTask.priority === 'high' ? 'أولوية قصوى' : 'أولوية متوسطة'}
                  </span>
                  <span className="text-xs text-slate-500">تفاصيل المهمة بالتقويم</span>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  {selectedTask.title}
                </h4>
                <p className="text-xs text-slate-500">
                  المشروع / الدورة: <span className="text-slate-800 font-semibold">{selectedTask.courseOrProject}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[10px] mb-0.5">المسؤول:</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    {selectedTask.assignee}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] mb-0.5">موعد الاستحقاق:</span>
                  <span className="font-bold text-amber-600 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    {selectedTask.time || selectedTask.dueDate}
                  </span>
                </div>
              </div>

              {/* Status Update Buttons */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-700 block font-bold">
                  تغيير حالة المهمة:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      onUpdateTaskColumn(selectedTask.id, 'todo');
                      setSelectedTask(null);
                    }}
                    className={`py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      selectedTask.column === 'todo'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    مخطط له
                  </button>
                  <button
                    onClick={() => {
                      onUpdateTaskColumn(selectedTask.id, 'in_progress');
                      setSelectedTask(null);
                    }}
                    className={`py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      selectedTask.column === 'in_progress'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    قيد التنفيذ
                  </button>
                  <button
                    onClick={() => {
                      onUpdateTaskColumn(selectedTask.id, 'done');
                      setSelectedTask(null);
                    }}
                    className={`py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      selectedTask.column === 'done'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    مكتملة ✓
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
