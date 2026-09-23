import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  Share2,
  Plus,
  KeyRound,
  Eye,
  EyeOff,
  UserCheck,
  Users,
  AlertTriangle,
  X,
  FileLock,
  History,
  CheckCircle2,
} from 'lucide-react';
import { TrustItem, GuardianRecord, SharedAccess } from '../../types';

interface TrustsAndGuardianViewProps {
  trusts: TrustItem[];
  guardians: GuardianRecord[];
  sharedList: SharedAccess[];
  onAddTrust: (trust: Partial<TrustItem>) => void;
  onAddGuardian: (record: Partial<GuardianRecord>) => void;
  onAddSharedAccess: (access: Partial<SharedAccess>) => void;
  showToast: (msg: string) => void;
}

export default function TrustsAndGuardianView({
  trusts,
  guardians,
  sharedList,
  onAddTrust,
  onAddGuardian,
  onAddSharedAccess,
  showToast,
}: TrustsAndGuardianViewProps) {
  const [activeTab, setActiveTab] = useState<'ahd' | 'guardian' | 'share'>('ahd');

  // New Trust (Ahd) Form Modal
  const [isAhdModalOpen, setIsAhdModalOpen] = useState(false);
  const [ownerName, setOwnerName] = useState('');
  const [trustTitle, setTrustTitle] = useState('');
  const [trustAmount, setTrustAmount] = useState('');

  // New Guardian Record Form Modal
  const [isGuardianModalOpen, setIsGuardianModalOpen] = useState(false);
  const [guardianTitle, setGuardianTitle] = useState('');
  const [confidentialText, setConfidentialText] = useState('');
  const [guardianPerson, setGuardianPerson] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');

  // Unlock secret record view
  const [unlockedRecordId, setUnlockedRecordId] = useState<string | null>(null);

  const handleCreateAhd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName || !trustAmount) {
      showToast('يرجى إدخال اسم صاحب الأمانة والمبلغ');
      return;
    }
    onAddTrust({
      ownerName,
      title: trustTitle || 'أمانة مالية متروكة للطرف الثاني',
      amount: parseFloat(trustAmount),
      currency: 'EGP',
      receivedDate: new Date().toISOString().split('T')[0],
      status: 'held',
      notes: 'مفصولة تماماً عن تقارير الدخل والمصروفات الشخصية',
    });
    setIsAhdModalOpen(false);
    setOwnerName('');
    setTrustAmount('');
    showToast('تم تسجيل حساب الأمانة (قرشنات عهد) بنجاح');
  };

  const handleCreateGuardian = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guardianTitle || !confidentialText) {
      showToast('يرجى إدخال العنوان والملاحظة السرية');
      return;
    }
    onAddGuardian({
      title: guardianTitle,
      category: 'bank_vault',
      confidentialData: confidentialText,
      guardianName: guardianPerson,
      guardianPhone,
      emergencyOnly: true,
      isUnlocked: false,
      updatedAt: new Date().toISOString().split('T')[0],
    });
    setIsGuardianModalOpen(false);
    setGuardianTitle('');
    setConfidentialText('');
    showToast('تم التشفير والحفظ بخزنة الوصي (قرشنات وصي)');
  };

  const totalTrustsAmount = trusts.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-5 pb-16" dir="rtl">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white shadow-lg border border-emerald-700/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.2),transparent_60%)] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                القائمة الرابعة
              </span>
              <span className="text-xs text-emerald-200">قرشنات • الأمانات والوصايا والخصوصية</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-['Cairo',sans-serif]">
              الأمانات والوصايا والخصوصية (Qershnat Ahd & Guardian)
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              حسابات الأمانات المتروكة لديك (عهد) منفصلة تماماً عن تقاريرك الخاصة، خزنة الوصي المشفرة للطوارئ، وصلاحيات مشاركة العائلة.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAhdModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل أمانة جديدة (عهد)</span>
            </button>
            <button
              onClick={() => setIsGuardianModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition border border-white/20 cursor-pointer"
            >
              <Lock className="w-4 h-4 text-emerald-300" />
              <span>إضافة سجل خزنة الوصي</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('ahd')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'ahd'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>حسابات الأمانة (قرشنات عهد) ({trusts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('guardian')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'guardian'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>خزنة الوصي للطوارئ (قرشنات وصي) ({guardians.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('share')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'share'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>مشاركة المحافظ والصلاحيات ({sharedList.length})</span>
        </button>
      </div>

      {/* 1. QERSHNAT AHD (TRUSTS) SECTION */}
      {activeTab === 'ahd' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>
                ملاحظة أمان: أموال الأمانات (عهد) معزولة تماماً عن حسابات الدخل والمصروفات وصافي ثروتك.
              </span>
            </div>
            <span className="font-bold text-emerald-800 font-['Cairo',sans-serif]">
              إجمالي الأمانات المتروكة لديك: {totalTrustsAmount.toLocaleString('ar-EG')} ج.م
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trusts.map((t) => (
              <div
                key={t.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                    قرشنات عهد • أمانة للغير
                  </span>
                  <span className="text-xs text-slate-400">تاريخ الاستلام: {t.receivedDate}</span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900">{t.ownerName}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{t.title}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between font-['Cairo',sans-serif]">
                  <span className="text-xs text-slate-500">المبلغ المحتفظ به كأمانة:</span>
                  <span className="text-xl font-black text-emerald-700">
                    {t.amount.toLocaleString('ar-EG')} {t.currency}
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{t.notes}</span>
                  <button
                    onClick={() => showToast(`تم تسليم وتصفية أمانة ${t.ownerName}`)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition cursor-pointer"
                  >
                    إرجاع الأمانة
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. QERSHNAT GUARDIAN (EMERGENCY VAULT) SECTION */}
      {activeTab === 'guardian' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 text-white text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-emerald-400" />
              <span>
                خزنة الوصي: سجلات مشفرة للغاية تظهر للأشخاص الموثوقين المحددين في حالات الطوارئ فقط.
              </span>
            </div>
            <button
              onClick={() => setIsGuardianModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              + إضافة سجل
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guardians.map((g) => {
              const isUnlocked = unlockedRecordId === g.id;
              return (
                <div
                  key={g.id}
                  className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
                      خزنة الوصي للطوارئ
                    </span>
                    <span className="text-xs text-slate-400">الوصي: {g.guardianName}</span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <FileLock className="w-4 h-4 text-emerald-600" />
                    {g.title}
                  </h3>

                  <div className="bg-slate-900 text-slate-100 p-3.5 rounded-2xl font-mono text-xs relative overflow-hidden">
                    {isUnlocked ? (
                      <p className="whitespace-pre-wrap text-emerald-300 font-sans">{g.confidentialData}</p>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="tracking-widest">••••••••••••••••••••••••••••</span>
                        <span className="text-[10px] text-amber-400">مشفر برمز الأمان</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-400">هاتف الوصي: {g.guardianPhone}</span>
                    <button
                      onClick={() => setUnlockedRecordId(isUnlocked ? null : g.id)}
                      className="flex items-center gap-1 font-bold text-emerald-700 hover:underline cursor-pointer"
                    >
                      {isUnlocked ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      <span>{isUnlocked ? 'إخفاء وتشفير' : 'فك التشفير والعرض'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. SHARING & PERMISSIONS SECTION */}
      {activeTab === 'share' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">أفراد العائلة والشركاء المشاركون</h3>
                <p className="text-xs text-slate-500">
                  تحديد صلاحيات الرؤية والتعديل لكل فرد من أفراد العائلة أو دفتر الحسابات.
                </p>
              </div>
              <button
                onClick={() => showToast('تم إرسال دعوة مشاركة عائلية')}
                className="px-4 py-2 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                + دعوة فرد جديد
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {sharedList.map((s) => (
                <div key={s.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                      {s.memberName.slice(0, 1)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{s.memberName} ({s.relation})</h4>
                      <p className="text-xs text-slate-400">
                        المحافظ المشاركة: {s.sharedWallets.join('، ')}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    {s.roleLevel === 'editor' ? 'صلاحية تعديل وإضافة' : 'رؤية فقط'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CREATE AHD MODAL */}
      <AnimatePresence>
        {isAhdModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200"
              dir="rtl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900">تسجيل أمانة جديدة (قرشنات عهد)</h3>
                <button
                  onClick={() => setIsAhdModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAhd} className="space-y-4 mt-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">اسم صاحب الأمانة *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: د. حسام الدين"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">المبلغ المتروك كأمانة (ج.م) *</label>
                  <input
                    type="number"
                    required
                    placeholder="0.00"
                    value={trustAmount}
                    onChange={(e) => setTrustAmount(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">وصف أو غرض الأمانة</label>
                  <input
                    type="text"
                    placeholder="مثال: أمانة لحين الشراء أو الشراكة"
                    value={trustTitle}
                    onChange={(e) => setTrustTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg cursor-pointer"
                  >
                    حفظ حساب الأمانة المعزول
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE GUARDIAN RECORD MODAL */}
      <AnimatePresence>
        {isGuardianModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200"
              dir="rtl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900">إضافة سجل لخزنة الوصي</h3>
                <button
                  onClick={() => setIsGuardianModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateGuardian} className="space-y-4 mt-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">عنوان السجل *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: تفاصيل الأوراق الرسمية والوصية"
                    value={guardianTitle}
                    onChange={(e) => setGuardianTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">البيانات والمعلومات السرية *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="أكتب النص السري المراد حفظه وتشفيره..."
                    value={confidentialText}
                    onChange={(e) => setConfidentialText(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">اسم الوصي الموثوق</label>
                    <input
                      type="text"
                      placeholder="الأخ / الصديق"
                      value={guardianPerson}
                      onChange={(e) => setGuardianPerson(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">هاتف الوصي</label>
                    <input
                      type="text"
                      placeholder="01xxxxxxxxx"
                      value={guardianPhone}
                      onChange={(e) => setGuardianPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-lg cursor-pointer"
                  >
                    تشفير وإيداع بخزنة الوصي
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
