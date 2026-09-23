import {
  Wallet,
  CreditCard,
  PieChart,
  ShieldCheck,
  CheckSquare,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Plus,
  MessageSquareCode,
  Globe,
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import { TabType } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { Language, translations } from '../lib/i18n';

interface SidebarNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenAddModal: () => void;
  isDbConnected: boolean;
  collapsed: boolean;
  onToggleCollapse: () => void;
  lang?: Language;
  onToggleLanguage?: () => void;
}

export default function SidebarNav({
  activeTab,
  onTabChange,
  onOpenAddModal,
  isDbConnected,
  collapsed,
  onToggleCollapse,
  lang = 'ar',
  onToggleLanguage,
}: SidebarNavProps) {
  const t = translations[lang];

  // The Official Qershnat Menus
  const qershnatItems = [
    {
      id: 'wallets_transactions' as TabType,
      label: lang === 'ar' ? '1. المحافظ والعمليات المالية' : '1. Wallets & Transactions',
      icon: Wallet,
      badge: lang === 'ar' ? 'كاش/بنوك' : 'Cash/Cards',
      badgeColor: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300',
    },
    {
      id: 'debts_and_circles' as TabType,
      label: lang === 'ar' ? '2. الديون والأقساط والجمعيات' : '2. Debts & Circles',
      icon: CreditCard,
      badge: lang === 'ar' ? 'مستحقات' : 'Debts',
      badgeColor: 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300',
    },
    {
      id: 'budgets_and_goals' as TabType,
      label: lang === 'ar' ? '3. الميزانيات والأهداف المالية' : '3. Budgets & Goals',
      icon: PieChart,
      badge: lang === 'ar' ? 'ادخار' : 'Savings',
      badgeColor: 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300',
    },
    {
      id: 'bank_sms_apps' as TabType,
      label: lang === 'ar' ? '4. رسائل البنوك و Apple Pay' : '4. Bank SMS & Apple Pay',
      icon: MessageSquareCode,
      badge: lang === 'ar' ? 'قراءة SMS' : 'Apple Pay',
      badgeColor: 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300',
    },
    {
      id: 'trusts_and_guardian' as TabType,
      label: lang === 'ar' ? '5. الأمانات والوصايا والخصوصية' : '5. Trusts & Vault',
      icon: ShieldCheck,
      badge: lang === 'ar' ? 'عهَد' : 'Vault',
      badgeColor: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200',
    },
    {
      id: 'daily_life_assets' as TabType,
      label: lang === 'ar' ? '6. الحياة اليومية والمستندات' : '6. Expenses & Tasks',
      icon: CheckSquare,
      badge: lang === 'ar' ? 'مهام' : 'Tasks',
      badgeColor: 'bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300',
    },
    {
      id: 'smart_tools_analytics' as TabType,
      label: lang === 'ar' ? '7. المساعد الذكي والتحليل' : '7. Smart AI Tools',
      icon: Sparkles,
      badge: lang === 'ar' ? 'ذكاء' : 'AI',
      badgeColor: 'bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300',
    },
  ];

  return (
    <aside
      className={`fixed top-0 z-40 h-screen bg-white dark:bg-slate-900 border-x border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col justify-between shadow-sm select-none ${
        lang === 'ar' ? 'right-0' : 'left-0'
      } ${collapsed ? 'w-20' : 'w-72'}`}
    >
      {/* Top Section: Brand & Collapse Toggle */}
      <div>
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          {!collapsed ? (
            <div className="flex items-center gap-2.5">
              <BrandLogo size="sm" showSubtitle={false} />
              <div>
                <h1 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                  {t.appTitle}
                </h1>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  {t.appSubtitle}
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto">
              <BrandLogo size="sm" showSubtitle={false} />
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-500 hover:text-emerald-600 flex items-center justify-center transition-colors cursor-pointer"
            title={collapsed ? 'توسيع القائمة' : 'تصغير القائمة'}
          >
            {collapsed ? (
              <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            )}
          </button>
        </div>

        {/* Action Buttons: Quick Add & Language Switcher */}
        <div className="p-3 space-y-2">
          <button
            onClick={onOpenAddModal}
            className={`w-full py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer ${
              collapsed ? 'px-0' : 'px-4'
            }`}
            title={t.quickAddBtn}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            {!collapsed && <span>{t.quickAddBtn}</span>}
          </button>

          {!collapsed && onToggleLanguage && (
            <button
              onClick={onToggleLanguage}
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.switchLang}</span>
            </button>
          )}

          {!collapsed && (
            <div className="pt-1">
              <PWAInstallButton lang={lang} variant="full" />
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="px-2 space-y-1 overflow-y-auto max-h-[calc(100vh-320px)] custom-scrollbar">
          {!collapsed && (
            <div className="px-3 pt-2 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {lang === 'ar' ? 'القوائم الرئيسية' : 'Main Menu'}
            </div>
          )}
          {qershnatItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-700 dark:bg-emerald-600 text-white shadow-md shadow-emerald-700/20'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400'
                } ${collapsed ? 'justify-center' : 'justify-between'}`}
                title={collapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!collapsed && item.badge && (
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Section: DB Status & App Details */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        {!collapsed ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Firestore:</span>
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-[10px]">
                {isDbConnected ? (lang === 'ar' ? 'متزامنة حياً' : 'Synced Live') : (lang === 'ar' ? 'متصلة' : 'Connected')}
              </span>
            </div>

            <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span>قرشنات © 2026</span>
              <span>{lang === 'ar' ? 'حساب شخصي' : 'Personal Account'}</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
