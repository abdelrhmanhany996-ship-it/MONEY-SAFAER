import React from 'react';
import { AlertTriangle, TrendingDown, ArrowUpRight, Sparkles, X, ShieldAlert } from 'lucide-react';

interface FinancialAlertBannerProps {
  totalIncome: number;
  totalExpense: number;
  isWarning: boolean;
  onOpenAiAdvisor?: () => void;
  onDismiss?: () => void;
}

export default function FinancialAlertBanner({
  totalIncome,
  totalExpense,
  isWarning,
  onOpenAiAdvisor,
  onDismiss,
}: FinancialAlertBannerProps) {
  if (!isWarning) return null;

  const deficit = totalExpense - totalIncome;
  const deficitPercentage = totalIncome > 0 ? Math.round((deficit / totalIncome) * 100) : 100;

  return (
    <div className="mx-3 sm:mx-6 my-3 p-4 rounded-2xl bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 text-white shadow-lg border border-rose-500/30 animate-in slide-in-from-top duration-300 relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-rose-500/20 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/30 border border-rose-400/40 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
            <AlertTriangle className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white font-black text-[10px] uppercase tracking-wider">
                إنذار مالي عاجل ⚠️
              </span>
              <span className="text-xs font-semibold text-rose-200">
                اختلال في توازن المصروفات والدخل
              </span>
            </div>
            <h3 className="text-sm font-black text-white mt-1">
              المصروفات تتزايد وتتجاوز إيراداتك بنسبة {deficitPercentage}%!
            </h3>
            <p className="text-xs text-rose-100/90 mt-1 leading-relaxed">
              إجمالي المصروفات الحالية (<span className="font-bold text-rose-200">{totalExpense.toLocaleString()} ج.م</span>) 
              أكبر من الدخل الوارد (<span className="font-bold text-emerald-300">{totalIncome.toLocaleString()} ج.م</span>).
              يوصى بترشيد النفقات ومراجعة الميزانيات فوراً لمنع العجز المالي.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-rose-700/50 justify-end">
          {onOpenAiAdvisor && (
            <button
              onClick={onOpenAiAdvisor}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-900" />
              <span>مستشار التنظيم الذكي 🪄</span>
            </button>
          )}

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-2 rounded-xl bg-rose-950/50 hover:bg-rose-900 text-rose-200 hover:text-white transition-colors cursor-pointer border border-rose-700/40"
              title="إغلاق التنبيه"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
