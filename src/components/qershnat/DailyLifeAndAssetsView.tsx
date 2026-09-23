import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckSquare,
  BookOpen,
  Gift,
  FileText,
  Car,
  Plus,
  Clock,
  Printer,
  Download,
  Calendar,
  Tag,
  CheckCircle2,
  Trash2,
  X,
  Paperclip,
  Wrench,
  AlertCircle,
} from 'lucide-react';
import { Task, NotebookEntry, OccasionGift, AssetDocument } from '../../types';

interface DailyLifeAndAssetsViewProps {
  tasks: Task[];
  notebook: NotebookEntry[];
  occasions: OccasionGift[];
  assets: AssetDocument[];
  onAddTask: (task: Partial<Task>) => void;
  onAddNote: (note: Partial<NotebookEntry>) => void;
  onAddOccasion: (occ: Partial<OccasionGift>) => void;
  onAddAsset: (asset: Partial<AssetDocument>) => void;
  showToast: (msg: string) => void;
}

export default function DailyLifeAndAssetsView({
  tasks,
  notebook,
  occasions,
  assets,
  onAddTask,
  onAddNote,
  onAddOccasion,
  onAddAsset,
  showToast,
}: DailyLifeAndAssetsViewProps) {
  const [activeTab, setActiveTab] = useState<'tasks' | 'notebook' | 'occasions' | 'assets'>('tasks');

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isOccasionModalOpen, setIsOccasionModalOpen] = useState(false);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);

  // Forms inputs
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [taskDueDate, setTaskDueDate] = useState('');

  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  const [occName, setOccName] = useState('');
  const [occPerson, setOccPerson] = useState('');
  const [occType, setOccType] = useState<'given' | 'received'>('given');
  const [occAmount, setOccAmount] = useState('');

  const [assetTitle, setAssetTitle] = useState('');
  const [assetType, setAssetType] = useState<'vehicle' | 'property' | 'official_paper' | 'appliance'>('vehicle');
  const [assetCost, setAssetCost] = useState('');
  const [carMileage, setCarMileage] = useState('');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;
    onAddTask({
      title: taskTitle,
      priority: taskPriority,
      column: 'todo',
      assignee: 'أنت',
      courseOrProject: 'تنظيم الحياة',
      dueDate: taskDueDate || new Date().toISOString().split('T')[0],
    });
    setIsTaskModalOpen(false);
    setTaskTitle('');
    showToast('تمت إضافة المهمة بنجاح');
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle) return;
    onAddNote({
      title: noteTitle,
      content: noteContent,
      category: 'عام',
      tags: ['ملاحظات'],
      updatedAt: new Date().toISOString().split('T')[0],
    });
    setIsNoteModalOpen(false);
    setNoteTitle('');
    setNoteContent('');
    showToast('تم حفظ الملاحظة بالمفكرة');
  };

  const handleCreateOccasion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!occName || !occAmount) return;
    onAddOccasion({
      eventName: occName,
      personName: occPerson,
      type: occType,
      amount: parseFloat(occAmount),
      currency: 'EGP',
      date: new Date().toISOString().split('T')[0],
      linkedWalletName: 'المحفظة النقدية',
    });
    setIsOccasionModalOpen(false);
    setOccName('');
    setOccAmount('');
    showToast('تم توثيق مناسبة النقوط بنجاح');
  };

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetTitle) return;
    onAddAsset({
      title: assetTitle,
      assetType,
      category: 'maintenance',
      cost: assetCost ? parseFloat(assetCost) : 0,
      carMileage: carMileage ? parseInt(carMileage) : undefined,
      date: new Date().toISOString().split('T')[0],
    });
    setIsAssetModalOpen(false);
    setAssetTitle('');
    setAssetCost('');
    showToast('تم حفظ سجل صيانة/مستند المركبة بنجاح');
  };

  // PDF Vehicle Maintenance Report Generator
  const handleExportVehiclePdf = () => {
    const vehicleAssets = assets.filter((a) => a.assetType === 'vehicle');
    const totalCost = vehicleAssets.reduce((acc, a) => acc + (a.cost || 0), 0);

    const win = window.open('', '_blank');
    if (!win) return;

    win.document.write(`
      <html dir="rtl" lang="ar">
        <head>
          <title>تقرير سجل صيانة واستبدال قطع الغيار للمركبة</title>

          <style>
            body { font-family: 'Cairo', sans-serif; padding: 30px; color: #1e293b; background: #fff; }
            .header { text-align: center; border-bottom: 2px solid #059669; padding-bottom: 15px; margin-bottom: 20px; }
            .logo { font-size: 26px; font-weight: 900; color: #059669; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: right; font-size: 13px; }
            th { background-color: #f1f5f9; font-weight: 800; }
            .total { font-size: 16px; font-weight: 900; color: #059669; text-align: left; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">تطبيق قرشنات - Qershnat</div>
            <h2>تقرير سجل صيانة وإصلاحات المركبات والممتلكات</h2>
            <p>التاريخ: ${new Date().toLocaleDateString('ar-EG')}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>اسم عملية الصيانة / القطعة</th>
                <th>قراءة عداد السيارة (كم)</th>
                <th>التاريخ</th>
                <th>التكلفة (ج.م)</th>
              </tr>
            </thead>
            <tbody>
              ${vehicleAssets
                .map(
                  (v) => `
                <tr>
                  <td>${v.title}</td>
                  <td>${v.carMileage || 'غير مسجل'} كم</td>
                  <td>${v.date}</td>
                  <td>${(v.cost || 0).toLocaleString('ar-EG')} ج.م</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>

          <div class="total">
            إجمالي مصروفات الصيانة: ${totalCost.toLocaleString('ar-EG')} ج.م
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className="space-y-5 pb-16" dir="rtl">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 text-white shadow-lg border border-teal-700/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.25),transparent_60%)] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-500/20 text-teal-300 border border-teal-400/30">
                القائمة الخامسة
              </span>
              <span className="text-xs text-teal-200">قرشنات • حياتك اليومية والمستندات</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-['Cairo',sans-serif]">
              الحياة اليومية، التذكيرات والمستندات (Daily Life & Tasks)
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              قوائم المهام، المفكرة الحرة، توثيق هدايا المناسبات والنقوط، وأرشفة أوراقك وسجل صيانة السيارة وتصديرها PDF.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition shadow-lg shadow-teal-500/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة مهمة جديدة</span>
            </button>
            <button
              onClick={handleExportVehiclePdf}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition border border-white/20 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-teal-300" />
              <span>تصدير سجل صيانة السيارة (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'tasks'
              ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>قوائم المهام والتذكيرات ({tasks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notebook')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'notebook'
              ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>المفكرة والدفاتر الحرة ({notebook.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('occasions')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'occasions'
              ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>المناسبات والنقوط ({occasions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('assets')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'assets'
              ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>المستندات وصيانة السيارات ({assets.length})</span>
        </button>
      </div>

      {/* 1. TASKS SECTION */}
      {activeTab === 'tasks' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900">قائمة المهام والتذكيرات</h3>
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="text-xs font-bold text-teal-700 hover:underline cursor-pointer"
            >
              + إضافة مهمة
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {tasks.map((t) => (
              <div key={t.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={t.column === 'done'}
                    onChange={() => showToast('تم تحديث حالة المهمة')}
                    className="w-4 h-4 rounded text-teal-600 cursor-pointer"
                  />
                  <div>
                    <h4
                      className={`text-sm font-bold ${
                        t.column === 'done' ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {t.title}
                    </h4>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> التذكير: {t.dueDate}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    t.priority === 'high'
                      ? 'bg-rose-100 text-rose-800'
                      : t.priority === 'medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  أولوية {t.priority === 'high' ? 'عالية' : t.priority === 'medium' ? 'متوسطة' : 'عادية'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. NOTEBOOK SECTION */}
      {activeTab === 'notebook' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-700">الملاحظات المدونة والمفكرة</h3>
            <button
              onClick={() => setIsNoteModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-teal-600 text-white font-bold text-xs shadow cursor-pointer"
            >
              + ملاحظة جديدة
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notebook.map((n) => (
              <div key={n.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">
                    {n.category}
                  </span>
                  <span className="text-[10px] text-slate-400">{n.updatedAt}</span>
                </div>

                <h4 className="text-base font-black text-slate-900">{n.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{n.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. OCCASIONS & GIFTS (نقوط) */}
      {activeTab === 'occasions' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-700">توثيق الهدايا المتبادلة والنقوط</h3>
            <button
              onClick={() => setIsOccasionModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-teal-600 text-white font-bold text-xs shadow cursor-pointer"
            >
              + توثيق مناسبة / نقوط
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {occasions.map((o) => (
              <div key={o.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                      o.type === 'given' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {o.type === 'given' ? 'نقوط مدفوع (خصم من المحفظة)' : 'نقوط مقبول (إيداع)'}
                  </span>
                  <span className="text-xs text-slate-400">{o.date}</span>
                </div>

                <div>
                  <h4 className="text-base font-black text-slate-900">{o.eventName}</h4>
                  <p className="text-xs text-slate-500">الشخص / الجهة: {o.personName}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between font-['Cairo',sans-serif]">
                  <span className="text-xs text-slate-500">قيمة النقوط / الهدايا:</span>
                  <span className="text-lg font-black text-teal-700">
                    {o.amount.toLocaleString('ar-EG')} {o.currency}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. ASSETS & VEHICLE MAINTENANCE LOG */}
      {activeTab === 'assets' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">سجل صيانة المركبات والممتلكات</h3>
              <p className="text-xs text-slate-500">
                حفظ الفواتير وقراءات العدادات، مع إمكانية طباعة أو تصدير التقرير PDF بضغطة زر.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAssetModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs shadow cursor-pointer"
              >
                + تسجيل صيانة جديدة
              </button>
              <button
                onClick={handleExportVehiclePdf}
                className="px-3.5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                <span>تصدير PDF</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {assets.map((a) => (
                <div key={a.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{a.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        {a.carMileage && <span>عداد: {a.carMileage.toLocaleString('ar-EG')} كم</span>}
                        <span>• التاريخ: {a.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left font-['Cairo',sans-serif]">
                    <span className="text-base font-black text-slate-900">
                      {(a.cost || 0).toLocaleString('ar-EG')} ج.م
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CREATE TASK MODAL */}
      <AnimatePresence>
        {isTaskModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200"
              dir="rtl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900">إضافة مهمة وتذكير جديد</h3>
                <button
                  onClick={() => setIsTaskModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4 mt-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">اسم المهمة والتذكير *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: التذكير بسداد فاتورة الكهرباء والإنترنت"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">الأولوية</label>
                    <select
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                    >
                      <option value="high">عالية جداً</option>
                      <option value="medium">متوسطة</option>
                      <option value="low">عادية</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">تاريخ التذكير</label>
                    <input
                      type="date"
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-sm shadow-lg cursor-pointer"
                  >
                    حفظ المهمة والتذكير
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE NOTE MODAL */}
      <AnimatePresence>
        {isNoteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200"
              dir="rtl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900">إضافة ملاحظة جديدة بالمفكرة</h3>
                <button
                  onClick={() => setIsNoteModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateNote} className="space-y-4 mt-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">العنوان *</label>
                  <input
                    type="text"
                    required
                    placeholder="عنوان الملاحظة..."
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">المحتوى والنص الحُر</label>
                  <textarea
                    rows={4}
                    placeholder="اكتب ملاحظتك تفصيلياً..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-sm shadow-lg cursor-pointer"
                  >
                    حفظ الملاحظة
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE OCCASION MODAL */}
      <AnimatePresence>
        {isOccasionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200"
              dir="rtl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900">توثيق مناسبة أو نقوط</h3>
                <button
                  onClick={() => setIsOccasionModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateOccasion} className="space-y-4 mt-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">اسم المناسبة *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: حفل زفاف / مولود جديد / نجاح"
                    value={occName}
                    onChange={(e) => setOccName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">اسم الشخص</label>
                  <input
                    type="text"
                    placeholder="مثال: المهندس محمد"
                    value={occPerson}
                    onChange={(e) => setOccPerson(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">نوع الحركة</label>
                    <select
                      value={occType}
                      onChange={(e) => setOccType(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                    >
                      <option value="given">نقوط مدفوع (-)</option>
                      <option value="received">نقوط مقبول (+)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">المبلغ (ج.م) *</label>
                    <input
                      type="number"
                      required
                      placeholder="0.00"
                      value={occAmount}
                      onChange={(e) => setOccAmount(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-bold"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-sm shadow-lg cursor-pointer"
                  >
                    حفظ وربط مع المحفظة
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE ASSET MODAL */}
      <AnimatePresence>
        {isAssetModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200"
              dir="rtl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900">تسجيل صيانة أو فاتورة مركبة</h3>
                <button
                  onClick={() => setIsAssetModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAsset} className="space-y-4 mt-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">وصف الصيانة / الفاتورة *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: تغيير زيت ومواصفات المحرك / تيل فرامل"
                    value={assetTitle}
                    onChange={(e) => setAssetTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">التكلفة (ج.م)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={assetCost}
                      onChange={(e) => setAssetCost(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">قراءة العداد (كم)</label>
                    <input
                      type="number"
                      placeholder="مثال: 85000"
                      value={carMileage}
                      onChange={(e) => setCarMileage(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-bold"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-sm shadow-lg cursor-pointer"
                  >
                    حفظ التوريد والسجل
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
