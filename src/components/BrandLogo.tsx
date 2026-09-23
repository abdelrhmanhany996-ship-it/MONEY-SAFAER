interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'hero';
  showSubtitle?: boolean;
  className?: string;
  variant?: 'badge' | 'horizontal' | 'compact';
  darkBg?: boolean;
}

export default function BrandLogo({
  size = 'md',
  showSubtitle = true,
  className = '',
  variant,
  darkBg = false,
}: BrandLogoProps) {
  const effectiveVariant = variant || (size === 'xs' || size === 'sm' ? 'horizontal' : 'badge');

  if (effectiveVariant === 'horizontal') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        {/* Saber Group Emblem */}
        <div className="relative w-10 h-10 rounded-2xl overflow-hidden flex flex-col items-center justify-center bg-gradient-to-tr from-emerald-600 via-teal-600 to-blue-600 border border-emerald-400 shadow-md shadow-emerald-500/25 shrink-0">
          <div className="text-center flex items-center justify-center font-black text-white text-xl font-['Cairo',sans-serif]">
            ص
          </div>
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
        </div>

        <div className="flex flex-col text-right justify-center">
          <div className="flex items-center gap-1.5">
            <span className={`font-black text-base sm:text-lg tracking-tight leading-none font-['Cairo',sans-serif] ${darkBg ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
              مجموعة صابر
            </span>
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200 leading-none dir-ltr">
              Saber Group
            </span>
          </div>
          {showSubtitle && (
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`text-[10px] font-semibold font-['Cairo',sans-serif] leading-none ${darkBg ? 'text-emerald-200' : 'text-slate-500 dark:text-slate-400'}`}>
                Saber Group for Accounting
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (size === 'hero' || effectiveVariant === 'badge') {
    return (
      <div
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xl shadow-emerald-600/10 bg-gradient-to-br from-emerald-700 via-teal-800 to-slate-900 text-center transition-all ${className}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(52,211,153,0.3),transparent_65%)] pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />

        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-200 flex items-center justify-center text-emerald-950 font-black text-3xl shadow-lg shadow-emerald-500/30 mb-3 border border-white/40">
            ص
          </div>

          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-wide leading-tight font-['Cairo',sans-serif]">
              Saber Group for Accounting
            </h1>
          </div>

          {showSubtitle && (
            <div className="mt-3 pt-3 border-t border-white/20 w-full max-w-[380px] flex flex-col items-center">
              <p className="text-xs sm:text-sm font-extrabold tracking-widest text-emerald-200 font-['Cairo',sans-serif]">
                مجموعة صابر للمحاسبة والاستشارات والحلول البرمجية
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border border-emerald-200 bg-white dark:bg-slate-900 shadow-md shadow-emerald-500/5 ${className}`}
    >
      <div className="flex items-center justify-center gap-1.5">
        <span className="text-xl font-black text-emerald-800 dark:text-emerald-400 font-['Cairo',sans-serif]">
          مجموعة صابر
        </span>
        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded-md">
          Saber Group
        </span>
      </div>

      {showSubtitle && (
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1 font-['Cairo',sans-serif]">
          Saber Group for Accounting
        </span>
      )}
    </div>
  );
}

