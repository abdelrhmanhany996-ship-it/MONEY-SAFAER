import React from 'react';
import { User, ShieldCheck, Check, X, UserPlus, Briefcase } from 'lucide-react';
import { EmployeeAccount } from './AuthModal';
import { Language, translations } from '../lib/i18n';

interface SelectEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: EmployeeAccount[];
  onSelectEmployee: (emp: EmployeeAccount) => void;
  onOpenAddEmployeeModal?: () => void;
  language?: Language;
}

export default function SelectEmployeeModal({
  isOpen,
  onClose,
  employees,
  onSelectEmployee,
  onOpenAddEmployeeModal,
  language = 'ar',
}: SelectEmployeeModalProps) {
  if (!isOpen) return null;

  const isAr = language === 'ar';
  const t = translations[language];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150 ${isAr ? 'dir-rtl' : 'dir-ltr'}`}>
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-white">{t.selectEmployeeTitle}</h3>
              <p className="text-xs text-blue-100 opacity-90">
                {t.selectEmployeeSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3 max-h-[65vh] overflow-y-auto">
          {employees.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  لا يوجد حسابات موظفين مضافة حتى الآن
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  يرجى من المدير العام إضافة حساب موظف أولاً لتحديد صلاحيات الوصول.
                </p>
              </div>
              {onOpenAddEmployeeModal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAddEmployeeModal();
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>إضافة حساب موظف جديد الآن</span>
                </button>
              )}
            </div>
          ) : (
            employees.map((emp) => (
              <div
                key={emp.id}
                onClick={() => {
                  onSelectEmployee(emp);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer group flex items-center justify-between ${
                  emp.active
                    ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md'
                    : 'bg-slate-100 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                    {emp.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">
                        {emp.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-mono text-[10px] font-bold">
                        {emp.code}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {emp.department} • {emp.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {emp.active ? (
                    <span className="p-2 rounded-xl bg-blue-600 text-white group-hover:bg-blue-700 transition-colors">
                      <Check className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-600 font-bold px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-950">
                      موقف
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>نظام صلاحيات الموظفين المعتمد</span>
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 font-bold transition-colors cursor-pointer"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
