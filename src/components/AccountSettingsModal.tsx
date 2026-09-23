import React, { useState } from 'react';
import { Settings, Globe, Coins, X, Check, ShieldCheck, Mail, LogOut } from 'lucide-react';
import { Language, SUPPORTED_CURRENCIES, translations } from '../lib/i18n';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
  currentCurrency: string;
  onSaveSettings: (newLang: Language, newCurrency: string) => void;
  userName?: string;
  userEmail?: string;
  userPhoto?: string | null;
  onLogout?: () => void;
}

export const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  currentCurrency,
  onSaveSettings,
  userName = 'عبد الرحمن هاني',
  userEmail = 'abdelrhmanhany996@gmail.com',
  userPhoto,
  onLogout,
}) => {
  const [selectedLang, setSelectedLang] = useState<Language>(currentLanguage);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(currentCurrency);

  if (!isOpen) return null;

  const t = translations[selectedLang];

  const handleSave = () => {
    onSaveSettings(selectedLang, selectedCurrency);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 dir-rtl animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-md">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {t.accountSettings}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.settings}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-200/60 dark:bg-slate-700/60 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {/* User Account Info Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-600/5 to-teal-500/10 border border-emerald-500/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {userPhoto ? (
                <img src={userPhoto} alt={userName} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/30" />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-lg font-black shadow-inner">
                  G
                </div>
              )}
              <div>
                <h4 className="font-black text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                  <span>{userName}</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-500 inline" />
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1 mt-0.5 dir-ltr justify-end">
                  <span>{userEmail}</span>
                  <Mail className="w-3 h-3 text-emerald-600" />
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-300/60 dark:border-emerald-800">
              {t.signedInAs}
            </span>
          </div>

          {/* 1. Language Preference */}
          <div className="space-y-2.5">
            <label className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>{t.language}</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedLang('ar')}
                className={`p-3.5 rounded-2xl border text-right flex items-center justify-between transition-all cursor-pointer ${
                  selectedLang === 'ar'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 dark:text-emerald-200 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300 font-medium'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">🇪🇬</span>
                  <div>
                    <span className="block text-xs font-black">العربية</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Arabic (RTL)</span>
                  </div>
                </div>
                {selectedLang === 'ar' && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => setSelectedLang('en')}
                className={`p-3.5 rounded-2xl border text-right flex items-center justify-between transition-all cursor-pointer ${
                  selectedLang === 'en'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 dark:text-emerald-200 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300 font-medium'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">🇬🇧</span>
                  <div>
                    <span className="block text-xs font-black">English</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">الإنجليزية (LTR)</span>
                  </div>
                </div>
                {selectedLang === 'en' && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
              </button>
            </div>
          </div>

          {/* 2. Preferred Currency Preference */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-500" />
                <span>{t.preferredCurrency}</span>
              </label>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                {selectedCurrency}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {t.selectCurrency} — سيتم تحديث رمز العملة تلقائياً عبر جميع حسابات ومحافظ التطبيق.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar p-1 border border-slate-200 dark:border-slate-800 rounded-2xl">
              {SUPPORTED_CURRENCIES.map((curr) => {
                const isSelected = selectedCurrency === curr.code;
                return (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => setSelectedCurrency(curr.code)}
                    className={`p-2.5 rounded-xl border text-right flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-500 ring-1 ring-amber-500/30 font-bold text-amber-950 dark:text-amber-200'
                        : 'bg-white dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-xs shrink-0">
                        {curr.symbol}
                      </span>
                      <span className="text-xs truncate">
                        {selectedLang === 'ar' ? curr.nameAr : curr.nameEn}
                      </span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-amber-600 shrink-0 mr-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          {onLogout && (
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-rose-200/60 dark:border-rose-900/50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.signOut}</span>
            </button>
          )}

          <div className="flex items-center gap-2 mr-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{t.saveSettings}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
