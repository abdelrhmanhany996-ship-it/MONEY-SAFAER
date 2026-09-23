import { useState } from 'react';
import {
  Search,
  Bell,
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  Menu,
  SlidersHorizontal,
  Sun,
  Moon,
  Sparkles,
  Mail,
  ShieldCheck,
  User,
  LogOut,
  ChevronDown,
  Settings,
  Globe,
} from 'lucide-react';
import { NotificationItem, TabType } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { AccountSettingsModal } from './AccountSettingsModal';
import { Language } from '../lib/i18n';

interface HeaderProps {
  notifications: NotificationItem[];
  onMarkNotificationAsRead: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAddModal: () => void;
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
  isDbConnected?: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  userEmail?: string;
  userName?: string;
  userPhoto?: string | null;
  isAuthenticated?: boolean;
  onLoginWithGoogle?: () => void;
  onOpenAuthModal?: () => void;
  onOpenEmployeeMgmtModal?: () => void;
  onLogout?: () => void;
  onToggleSidebar?: () => void;
  onOpenSearchFilter?: () => void;
  onOpenAiAdvisor?: () => void;
  currentLanguage?: Language;
  currentCurrency?: string;
  onSaveSettings?: (newLang: Language, newCurrency: string) => void;
  userRole?: 'admin' | 'employee';
  onToggleRole?: () => void;
}

export default function Header({
  notifications,
  onMarkNotificationAsRead,
  searchQuery,
  onSearchChange,
  onOpenAddModal,
  activeTab = 'wallets_transactions',
  onTabChange,
  isDbConnected = true,
  theme,
  onToggleTheme,
  userEmail = 'saber.group@accounting.com',
  userName = 'مجموعة صابر المحاسبية',
  userPhoto,
  isAuthenticated = true,
  onLoginWithGoogle,
  onOpenAuthModal,
  onOpenEmployeeMgmtModal,
  onLogout,
  onToggleSidebar,
  onOpenSearchFilter,
  onOpenAiAdvisor,
  currentLanguage = 'ar',
  currentCurrency = 'EGP',
  onSaveSettings,
  userRole = 'admin',
  onToggleRole,
}: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-3 sm:px-6 py-2.5 transition-colors shadow-xs dir-rtl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left Side: Mobile Menu Trigger & Google Profile */}
        <div className="flex items-center gap-2.5">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center cursor-pointer transition-colors"
              title="فتح القائمة الجانبية"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Google / Gmail Connected Profile Badge or Sign-In Button */}
          <div className="relative">
            {isAuthenticated ? (
              <button
                onClick={() => setShowAccountModal(!showAccountModal)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 hover:border-emerald-400 text-emerald-900 dark:text-emerald-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                {userPhoto ? (
                  <img src={userPhoto} alt={userName} className="w-6 h-6 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-[11px] font-black shrink-0">
                    {userName.charAt(0)}
                  </div>
                )}
                <div className="text-right hidden sm:block">
                  <div className="flex items-center gap-1">
                    <span className="font-black text-slate-900 dark:text-white text-xs">{userName}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block -mt-0.5 dir-ltr truncate max-w-[150px]">
                    {userEmail}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal || onLoginWithGoogle}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <User className="w-4 h-4" />
                <span>تسجيل الدخول / مدير وموظف</span>
              </button>
            )}

            {/* Google / Account Modal Dropdown */}
            {showAccountModal && isAuthenticated && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    {userPhoto ? (
                      <img src={userPhoto} alt={userName} className="w-8 h-8 rounded-xl object-cover shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                        {userName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white text-xs">{userName}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {userRole === 'admin' ? '🛡️ مدير النظام العام' : '💼 موظف عمليات'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAccountModal(false)}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="py-3 space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 space-y-1">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>البريد المسجل:</span>
                      </span>
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-100 block dir-ltr truncate text-[11px]">
                      {userEmail}
                    </span>
                  </div>

                  {userRole === 'admin' && onOpenEmployeeMgmtModal && (
                    <button
                      onClick={() => {
                        setShowAccountModal(false);
                        onOpenEmployeeMgmtModal();
                      }}
                      className="w-full p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-900 dark:text-purple-300 border border-purple-200 dark:border-purple-800/80 font-black text-xs flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>إدارة وإضافة حسابات الموظفين</span>
                      <User className="w-4 h-4 text-purple-600" />
                    </button>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setShowAccountModal(false);
                      setIsSettingsOpen(true);
                    }}
                    className="w-full py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-emerald-200/60 dark:border-emerald-800/60"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>إعدادات اللغة والعملة المفضلة</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onLogout) onLogout();
                      setShowAccountModal(false);
                    }}
                    className="w-full py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-rose-200/50 dark:border-rose-900/50"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>تسجيل الخروج من الحساب</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Database Live Sync Status */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-[11px] font-bold">
            <span className="relative flex h-2 w-2">
              {isDbConnected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isDbConnected ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              ></span>
            </span>
            <span className={isDbConnected ? 'text-slate-700 dark:text-slate-300' : 'text-amber-700'}>
              {isDbConnected ? 'Firestore متصلة' : 'جاري المزامنة...'}
            </span>
          </div>
        </div>

        {/* Right Side: PWA Install, AI Assistant, Dark Mode, Search, Notifications */}
        <div className="flex items-center gap-2">
          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* AI Organization Advisor Trigger Button */}
          {onOpenAiAdvisor && (
            <button
              onClick={onOpenAiAdvisor}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer"
              title="مستشار التنظيم الذكي بالذكاء الاصطناعي"
            >
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">مستشار التنظيم الذكي</span>
            </button>
          )}

          {/* Role Switcher Toggle Button (Admin / Employee) */}
          <button
            onClick={onToggleRole}
            className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 transition-all duration-150 active:scale-95 cursor-pointer shadow-2xs ${
              userRole === 'admin'
                ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-100'
                : 'bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100'
            }`}
            title="انقر للتبديل بين واجهة المدير وواجهة الموظف"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{userRole === 'admin' ? 'مدير النظام 🛡️' : 'واجهة الموظف 👤'}</span>
          </button>
          <button
            onClick={() => {
              const nextLang: Language = currentLanguage === 'ar' ? 'en' : 'ar';
              if (onSaveSettings) onSaveSettings(nextLang, currentCurrency);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-800 dark:text-slate-100 font-black text-xs flex items-center gap-1.5 transition-all duration-150 active:scale-95 cursor-pointer shadow-2xs"
            title={currentLanguage === 'ar' ? 'Switch to English' : 'التحويل إلى اللغة العربية'}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{currentLanguage === 'ar' ? 'العربية' : 'English'}</span>
          </button>

          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-400 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center gap-1.5 transition-all duration-150 active:scale-95 cursor-pointer shadow-2xs"
            title={theme === 'dark' ? 'الوضع الحالي: داكن (انقر للتحويل للفاتح)' : 'الوضع الحالي: فاتح (انقر للتحويل للداكن)'}
          >
            {theme === 'dark' ? (
              <>
                <Moon className="w-4 h-4 text-amber-300" />
                <span className="text-[11px] font-black text-amber-300">الوضع الداكن 🌙</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-600" />
                <span className="text-[11px] font-black text-slate-700">الوضع الفاتح ☀️</span>
              </>
            )}
          </button>

          {/* PWA Install Button for Mobile & Desktop */}
          <PWAInstallButton />

          {/* Quick Search */}
          {showSearch ? (
            <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-emerald-500 rounded-xl px-2.5 py-1.5 w-48 sm:w-64 transition-all">
              <Search className="w-4 h-4 text-emerald-600 shrink-0 ml-1.5" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="بحث سريع في التطبيق..."
                className="bg-transparent border-none text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none w-full text-right"
              />
              <button
                onClick={() => {
                  setShowSearch(false);
                  onSearchChange('');
                }}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 rounded transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowSearch(true)}
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-slate-600 dark:text-slate-300 hover:text-emerald-600 flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer"
                title="بحث سريع"
              >
                <Search className="w-4 h-4" />
              </button>

              {onOpenSearchFilter && (
                <button
                  onClick={onOpenSearchFilter}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                  title="تصفية وبحث متقدم"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                  <span>تصفية</span>
                </button>
              )}
            </div>
          )}

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-slate-600 dark:text-slate-300 hover:text-emerald-600 flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer"
              title="الإشعارات والتنبيهات"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border border-white dark:border-slate-900 shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Modal */}
            {showNotifications && (
              <div className="absolute left-0 mt-2 w-80 max-w-[calc(100vw-32px)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      إشعارات قرشنات
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => onMarkNotificationAsRead(n.id)}
                      className={`p-2.5 rounded-xl border text-right cursor-pointer transition-all duration-150 ${
                        n.read
                          ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 opacity-60'
                          : 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5 shrink-0">
                          {n.type === 'success' && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {n.type === 'alert' && (
                            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                          )}
                          {n.type === 'info' && (
                            <Info className="w-3.5 h-3.5 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-snug">
                            {n.title}
                          </p>
                          <span className="text-[10px] text-slate-400 block mt-1">
                            {n.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account & Currency Settings Modal */}
      <AccountSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentLanguage={currentLanguage}
        currentCurrency={currentCurrency}
        onSaveSettings={(newLang, newCurr) => {
          if (onSaveSettings) onSaveSettings(newLang, newCurr);
        }}
        userName={userName}
        userEmail={userEmail}
        userPhoto={userPhoto}
        onLogout={onLogout}
      />
    </header>
  );
}
