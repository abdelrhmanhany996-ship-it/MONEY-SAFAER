import React, { useState } from 'react';
import { Download, Share, X, CheckCircle, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 shadow-2xs">
        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
        <span className="hidden sm:inline">التطبيق مُثبّت</span>
        <span className="sm:hidden">مُثبّت</span>
      </div>
    );
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white text-xs font-black transition-all shadow-md cursor-pointer"
        title="تثبيت التطبيق على الجوال أو الكمبيوتر"
      >
        <Smartphone className="w-4 h-4 text-emerald-100" />
        <span>تثبيت التطبيق (PWA) 📱</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all border border-emerald-300 dark:border-emerald-800 cursor-pointer shadow-2xs"
        >
          <Share className="w-3.5 h-3.5" />
          <span>تثبيت على iPhone 📱</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 dir-rtl">
            <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute left-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    التثبيت على أجهزة iPhone / iPad
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    خطوات إضافة تطبيق مجموعة صابر للشاشة الرئيسية
                  </p>
                </div>
              </div>
              <div className="mt-4 text-xs text-slate-700 dark:text-slate-300 space-y-3 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                <p className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span>اضغط على زر <strong>المشاركة (Share)</strong> في أسفل متصفح Safari.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span>اختر <strong>إضافة إلى الشاشة الرئيسية (Add to Home Screen)</strong>.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span>اضغط <strong>إضافة (Add)</strong> وسيصبح التطبيق جاهزاً للعمل كبرنامج مستقل بدون إنترنت.</span>
                </p>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-2xl bg-emerald-600 py-3 text-xs font-black text-white hover:bg-emerald-700 shadow-md transition-all cursor-pointer"
              >
                حسناً، فهمت ذلك 👍
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <button
      onClick={() => {
        alert('لتثبيت التطبيق على الجوال أو الكومبيوتر:\n1. افتح قائمة خيارات المتصفح (⋮ أو ⚙)\n2. اختر "إضافة إلى الشاشة الرئيسية" أو "تثبيت التطبيق" (Install App).');
      }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 cursor-pointer shadow-2xs"
      title="تثبيت التطبيق على الجوال PWA"
    >
      <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
      <span>تثبيت PWA 📱</span>
    </button>
  );
};
