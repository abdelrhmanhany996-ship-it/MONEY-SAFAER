import React, { useState } from 'react';
import { Download, Share, X, CheckCircle } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700">
        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
        <span>تطبيق مثبت</span>
      </div>
    );
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
        title="تثبيت التطبيق على الشاشة الرئيسية"
      >
        <Download className="w-3.5 h-3.5" />
        <span>تثبيت التطبيق (PWA)</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all border border-emerald-300 dark:border-emerald-800 cursor-pointer"
        >
          <Share className="w-3.5 h-3.5" />
          <span>تثبيت على iPhone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 dir-rtl">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute left-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Share className="w-5 h-5 text-emerald-600" />
                <span>التثبيت على أجهزة iPhone / iPad</span>
              </h3>
              <div className="mt-3 text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
                <p>1. اضغط على زر <strong>المشاركة (Share)</strong> في شريط متصفح Safari.</p>
                <p>2. اختر <strong>إضافة إلى الشاشة الرئيسية (Add to Home Screen)</strong>.</p>
                <p>3. تأكيد التثبيت ليعمل التطبيق كبرنامج مستقّل بخصائص كاملة.</p>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700"
              >
                تم، فهمت ذلك
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
        alert('لتثبيت التطبيق على جهازك: افتح خيارات المتصفح (⋮ أو ⚙) واختر "إضافة إلى الشاشة الرئيسية" أو "تثبيت التطبيق".');
      }}
      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
    >
      <Download className="w-3.5 h-3.5 text-emerald-600" />
      <span>تثبيت PWA</span>
    </button>
  );
};
