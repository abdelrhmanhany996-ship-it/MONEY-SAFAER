import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  Calendar,
  FolderLock,
  Sparkles,
  ShieldCheck,
  Settings,
  HelpCircle,
  FileCheck,
  Users2,
  BellRing,
  ChevronLeft,
  X,
  CheckCircle2,
} from 'lucide-react';
import BrandLogo from './BrandLogo';

interface MoreMenuViewProps {
  showToast: (msg: string) => void;
}

interface MenuItemData {
  title: string;
  desc: string;
  badge?: string;
  icon: any;
  color: string;
  detail: string;
}

export default function MoreMenuView({ showToast }: MoreMenuViewProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItemData | null>(null);

  const menuSections: { title: string; items: MenuItemData[] }[] = [
    {
      title: 'خدمات الأكاديمية والتدريب',
      items: [
        {
          title: 'الشهادات والاعتمادات الرقمية',
          desc: 'إصدار شهادات معتمدة مشفرة برمز QR فوري',
          badge: 'معتمد',
          icon: Award,
          color: 'from-blue-600 to-indigo-700',
          detail:
            'منظومة إصدار الشهادات الرقمية المعتمدة من Saber Group Courses Academy تتيح للطلاب وأصحاب الأعمال التحقق من صحة واجتياز المتدربين لأي مسار تدريبي بكود فريد غير قابل للتزوير.',
        },
        {
          title: 'جدول القاعات والمحاضرات الذكية',
          desc: 'تنظيم مواعيد الحضور الفعلي والافتراضي',
          icon: Calendar,
          color: 'from-sky-500 to-blue-600',
          detail:
            'نظام جدولة القاعات التدريبية A و B ومعامل الكمبيوتر مع ربط البث المباشر على منصة الأكاديمية تلقائياً.',
        },
        {
          title: 'مكتبة المحتوى والملفات المرفوعة',
          desc: 'السلايدات، الأكواد والمشاريع التطبيقية',
          badge: '3.4 GB',
          icon: FolderLock,
          color: 'from-cyan-600 to-blue-700',
          detail:
            'مستودع سحابي آمن لجميع المواد العلمية والملفات المسجلة لمسارات البرمجة، التسويق، والتصميم.',
        },
        {
          title: 'شؤون المدربين والمحاضرين',
          desc: 'إدارة نخبة المحاضرين وجداولهم وعقودهم',
          icon: Users2,
          color: 'from-blue-700 to-slate-800',
          detail:
            'سجل شامل للمدربين المعتمدين في أكاديمية صابر مع التقييم الفصلي وساعات التدريب المنجزة.',
        },
      ],
    },
    {
      title: 'أدوات الذكاء الاصطناعي والأتمتة',
      items: [
        {
          title: 'مساعد Saber AI الذكي للأكاديمية',
          desc: 'تحليل أداء المتدربين واقتراح مسارات مخصصة',
          badge: 'Gemini AI',
          icon: Sparkles,
          color: 'from-blue-600 to-sky-500',
          detail:
            'المساعد الذكي المبني بنماذج Gemini المتقدمة يساعد في تلخيص المحاضرات، صياغة الاختبارات، وتحليل تقييمات الطلاب وسرعة استيعابهم.',
        },
        {
          title: 'التقارير التحليلية والتدقيق المالي',
          desc: 'كشوف الإيرادات الشهرية ومعدلات النمو',
          icon: FileCheck,
          color: 'from-emerald-600 to-teal-700',
          detail:
            'نظام تقارير محاسبية تفصيلية مطابقة للمعايير المالية لمتابعة الربحية الصافية والتدفقات النقدية.',
        },
      ],
    },
    {
      title: 'النظام والأمان',
      items: [
        {
          title: 'إعدادات المنصة والأمان',
          desc: 'صلاحيات الوصول، التوثيق الثنائي، والنسخ الاحتياطي',
          icon: ShieldCheck,
          color: 'from-slate-700 to-slate-900',
          detail:
            'إدارة تشفير البيانات وقواعد الحماية السحابية وضمان تشغيل منصة التدريب بكفاءة 99.9%.',
        },
        {
          title: 'تفضيلات الإشعارات والتنبيهات',
          desc: 'تنبيهات فودافون كاش، إنستاباي، ورسائل المتدربين',
          icon: BellRing,
          color: 'from-blue-600 to-indigo-600',
          detail:
            'تخصيص القنوات المفضلة لإشعارات التسجيل والتحويلات المالية اليومية للمدير الإداري.',
        },
        {
          title: 'الدعم الفني واستشارات الأكاديمية',
          desc: 'تواصل مباشر مع فريق الدعم الفني لصابر جروب',
          icon: HelpCircle,
          color: 'from-sky-600 to-slate-700',
          detail:
            'فريق دعم متاح 24/7 لمساندة العمليات التدريبية والتقنية في الأكاديمية.',
        },
      ],
    },
  ];

  return (
    <div className="space-y-4 pb-20">
      {/* 1. Brand Identity Banner Card */}
      <BrandLogo size="hero" showSubtitle={true} />

      {/* 2. Grouped Distinctive Menus */}
      <div className="space-y-4">
        {menuSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-2">
            <h4 className="text-xs font-bold text-slate-500 px-1 uppercase tracking-wider">
              {section.title}
            </h4>

            <div className="space-y-2">
              {section.items.map((item, iIdx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={iIdx}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.1 }}
                    onClick={() => setSelectedItem(item)}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer group shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-150`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {item.title}
                          </h5>
                          {item.badge && (
                            <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors shrink-0">
                      <ChevronLeft className="w-4 h-4" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Dialog */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl z-10 text-right"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${selectedItem.color} flex items-center justify-center text-white`}
                  >
                    <selectedItem.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {selectedItem.title}
                    </h4>
                    <span className="text-[10px] text-slate-500">
                      SABER GROUP COURSES ACADEMY
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Special Certificate Preview Mode */}
              {selectedItem.title.includes('الشهادات') ? (
                <div className="space-y-3 mb-4">
                  <div className="p-4 rounded-2xl border border-blue-200 bg-gradient-to-b from-blue-50/70 via-sky-50/40 to-white text-center relative overflow-hidden shadow-sm">
                    <div className="relative z-10">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <span className="text-sm font-black text-blue-900 tracking-widest uppercase font-['Plus_Jakarta_Sans',sans-serif]">
                          SABER GROUP
                        </span>
                        <span className="text-[9px] font-bold text-blue-800 border border-blue-400 rounded-full w-3.5 h-3.5 flex items-center justify-center -mt-1.5">
                          ®
                        </span>
                      </div>
                      <span className="text-[9px] font-bold tracking-[0.2em] text-blue-600 uppercase block">
                        COURSES ACADEMY
                      </span>
                      <span className="text-[10px] font-bold tracking-widest text-slate-600 block mb-2 font-['Cairo',sans-serif]">
                        أكاديمية تدريب معتمدة
                      </span>

                      <div className="my-2 py-2 border-y border-blue-200 bg-white/80 rounded-xl px-2 shadow-xs">
                        <span className="text-[10px] text-slate-500 block">تشهد الأكاديمية باجتياز المتدرب</span>
                        <h5 className="text-sm font-bold text-slate-900 mt-0.5 font-['Cairo',sans-serif]">
                          أحمد حسام الدين السيد
                        </h5>
                        <p className="text-[11px] text-blue-600 font-semibold mt-0.5">
                          مسار Full-Stack Web Development (بتقدير ممتاز 98%)
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[9px] text-slate-500 pt-1">
                        <div className="flex items-center gap-1 text-emerald-600 font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>كود التوثيق: SG-2026-994</span>
                        </div>
                        <span className="text-blue-700 font-bold">ختم الاعتماد الرقمي ✓</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedItem.detail}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {selectedItem.detail}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    showToast(`تم تفعيل: ${selectedItem.title} بنجاح ✓`);
                    setSelectedItem(null);
                  }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-sky-600 text-white text-xs font-bold rounded-xl hover:opacity-95 transition-opacity cursor-pointer shadow-sm shadow-blue-500/20"
                >
                  تشغيل الخدمة الآن
                </button>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
