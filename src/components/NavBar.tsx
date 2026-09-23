import { motion } from 'motion/react';
import { LayoutDashboard, GraduationCap, Wallet, MoreHorizontal, Plus } from 'lucide-react';
import { TabType } from '../types';

interface NavBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenAddModal: () => void;
}

export default function NavBar({
  activeTab,
  onTabChange,
  onOpenAddModal,
}: NavBarProps) {
  const navItems = [
    { id: 'dashboard' as TabType, label: 'لوحة القيادة', icon: LayoutDashboard },
    { id: 'business' as TabType, label: 'الأكاديمية', icon: GraduationCap },
    { id: 'add' as const, label: 'إضافة', isAdd: true },
    { id: 'money' as TabType, label: 'الأموال', icon: Wallet },
    { id: 'more' as TabType, label: 'المزيد', icon: MoreHorizontal },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 pb-safe shadow-[0_-4px_25px_rgba(0,0,0,0.06)] md:hidden">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around relative">
        {navItems.map((item) => {
          if (item.isAdd) {
            return (
              <div key="add-button" className="relative -top-5 flex flex-col items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ duration: 0.12 }}
                  onClick={onOpenAddModal}
                  className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 border-2 border-white flex items-center justify-center text-white shadow-[0_6px_20px_rgba(37,99,235,0.4)] cursor-pointer"
                  title="إضافة جديد"
                >
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                </motion.button>
                <span className="text-[10px] font-bold text-slate-500 mt-1">
                  إضافة
                </span>
              </div>
            );
          }

          const Icon = item.icon!;
          const isActive = activeTab === item.id || (item.id === 'dashboard' && activeTab === 'home');

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.1 }}
              onClick={() => onTabChange(item.id as TabType)}
              className="flex flex-col items-center justify-center py-1 px-3 min-w-[56px] relative group cursor-pointer"
            >
              {/* Active Indicator Top Laser */}
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute -top-1 w-8 h-1 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.6)]"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}

              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-150 ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-slate-400 group-hover:text-slate-600'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.3]' : 'stroke-2'}`} />
              </div>

              <span
                className={`text-[11px] font-semibold transition-colors duration-150 mt-0.5 ${
                  isActive ? 'text-blue-700 font-bold' : 'text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
