import {
  BookOpen,
  Users,
  ShoppingCart,
  Landmark,
  Building2,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import { TabType } from '../types';
import { Language } from '../lib/i18n';

interface SidebarNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenAddModal: () => void;
  isDbConnected: boolean;
  collapsed: boolean;
  onToggleCollapse: () => void;
  language?: Language;
  userRole?: 'admin' | 'employee';
}

export default function SidebarNav({
  activeTab,
  onTabChange,
  onOpenAddModal,
  isDbConnected,
  collapsed,
  onToggleCollapse,
  language = 'ar',
  userRole = 'admin',
}: SidebarNavProps) {
  const isAr = language === 'ar';

  // The 5 Core Saber Group Accounting & Corporate ERP Menus
  const erpMenuItems = [
    {
      id: 'general_ledger' as TabType,
      label: isAr ? '1. الحسابات العامة والشجرة' : '1. General Ledger & Chart',
      icon: BookOpen,
      badge: isAr ? 'دليل القيود' : 'GL Entries',
      badgeColor: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300',
    },
    {
      id: 'sales_receivables' as TabType,
      label: isAr ? '2. المبيعات والعملاء' : '2. Sales & Receivables',
      icon: Users,
      badge: isAr ? 'فواتير/عروض' : 'Invoices',
      badgeColor: 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300',
    },
    {
      id: 'banking' as TabType,
      label: isAr ? '3. الخزينة والبنوك' : '3. Treasury & Banking',
      icon: Landmark,
      badge: isAr ? 'سندات/تسوية' : 'Cash/Bank',
      badgeColor: 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300',
    },
    {
      id: 'business' as TabType,
      label: isAr ? '4. الأكاديمية والكورسات' : '4. Academy & Courses',
      icon: Building2,
      badge: isAr ? 'طلبة/مجموعات' : 'Students/Fee',
      badgeColor: 'bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300',
    },
    {
      id: 'financial_reports' as TabType,
      label: isAr ? '5. التقارير والقوائم المالية' : '5. Financial Reports',
      icon: BarChart3,
      badge: isAr ? 'ميزانية/دخل' : 'P&L / Balance',
      badgeColor: 'bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300',
    },
  ];

  return (
    <aside
      className={`fixed top-0 right-0 z-40 h-screen bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col justify-between shadow-sm select-none dir-rtl ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Top Section: Brand & Collapse Toggle */}
      <div>
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          {!collapsed ? (
            <div className="flex items-center gap-2.5">
              <BrandLogo size="sm" showSubtitle={false} />
              <div>
                <h1 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                  {isAr ? 'مجموعة صابر للمحاسبة' : 'Saber Group Accounting'}
                </h1>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  {isAr ? 'Saber Group for Accounting' : 'Financial & Corporate System'}
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

        {/* Quick Add Button */}
        <div className="p-3">
          <button
            onClick={onOpenAddModal}
            className={`w-full py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer ${
              collapsed ? 'px-0' : 'px-4'
            }`}
            title="إضافة عملية جديدة"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            {!collapsed && <span>تسجيل عملية سريعة</span>}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="px-2 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] custom-scrollbar">
          {!collapsed && (
            <div className="px-3 pt-2 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {isAr ? 'نظام Saber Group للمحاسبة ERP' : 'Saber Group ERP Modules'}
            </div>
          )}
          {erpMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all text-right cursor-pointer ${
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
                <span>قاعدة Firestore:</span>
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-[10px]">
                {isDbConnected ? 'متزامنة حياً' : 'متصلة'}
              </span>
            </div>

            <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span>Saber Group © 2026</span>
              <span>نظام المحاسبة</span>
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
