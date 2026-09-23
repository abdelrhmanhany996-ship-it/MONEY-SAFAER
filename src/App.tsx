import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import SidebarNav from './components/SidebarNav';
import WalletsTransactionsView from './components/qershnat/WalletsTransactionsView';
import DebtsAndCirclesView from './components/qershnat/DebtsAndCirclesView';
import BudgetsAndGoalsView from './components/qershnat/BudgetsAndGoalsView';
import TrustsAndGuardianView from './components/qershnat/TrustsAndGuardianView';
import DailyLifeAndAssetsView from './components/qershnat/DailyLifeAndAssetsView';
import SmartToolsAnalyticsView from './components/qershnat/SmartToolsAnalyticsView';
import CompanyAcademyView from './components/qershnat/CompanyAcademyView';
import PayrollHRView from './components/qershnat/PayrollHRView';
import AddModal from './components/AddModal';
import FinancialAlertBanner from './components/FinancialAlertBanner';
import AiOrganizationModal from './components/AiOrganizationModal';
import AuthModal, { EmployeeAccount } from './components/AuthModal';
import EmployeeManagementModal from './components/EmployeeManagementModal';
import SelectEmployeeModal from './components/SelectEmployeeModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import {
  INITIAL_WALLETS,
  INITIAL_TRANSACTIONS,
  INITIAL_INSTALLMENTS,
  INITIAL_TASKS,
  INITIAL_NOTIFICATIONS,
  INITIAL_COURSES,
  INITIAL_CLIENTS,
  INITIAL_INVOICES,
} from './data/initialData';
import {
  TabType,
  Wallet,
  Transaction,
  Installment,
  DebtItem,
  MoneyCircle,
  BudgetItem,
  GoalItem,
  TrustItem,
  GuardianRecord,
  SharedAccess,
  Task,
  NotebookEntry,
  OccasionGift,
  AssetDocument,
  NotificationItem,
  Course,
  ClientOrStudent,
  Invoice,
} from './types';
import {
  seedInitialDataIfEmpty,
  subscribeToWallets,
  subscribeToTransactions,
  subscribeToInstallments,
  saveTransaction,
  updateWalletBalance,
  updateAllWalletsCurrency,
  saveCourse,
  saveClient,
  saveInvoice,
  updateInstallmentStatus,
} from './lib/databaseService';
import { User } from 'firebase/auth';
import {
  signInWithGoogle,
  logoutUser,
  subscribeToAuthChanges,
} from './lib/authService';
import { Language } from './lib/i18n';

export default function App() {
  // Theme (Dark Mode) State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('qershnat_theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('qershnat_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Language & Preferred Currency Settings State
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('qershnat_language') as Language) || 'ar';
  });

  const [preferredCurrency, setPreferredCurrency] = useState<string>(() => {
    return localStorage.getItem('qershnat_currency') || 'EGP';
  });

  useEffect(() => {
    localStorage.setItem('qershnat_language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // User Role State ('admin' vs 'employee')
  const [userRole, setUserRole] = useState<'admin' | 'employee'>(() => {
    return (localStorage.getItem('saber_active_user_role') as 'admin' | 'employee') || 'admin';
  });
  const [activeUserName, setActiveUserName] = useState<string>(() => {
    return localStorage.getItem('saber_active_user_name') || 'مجموعة صابر المحاسبية';
  });
  const [activeUserEmail, setActiveUserEmail] = useState<string>(() => {
    return localStorage.getItem('saber_active_user_email') || 'saber.group@accounting.com';
  });

  // Modals for Auth & Employee Access Control
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEmployeeMgmtModalOpen, setIsEmployeeMgmtModalOpen] = useState(false);
  const [isSelectEmployeeModalOpen, setIsSelectEmployeeModalOpen] = useState(false);

  // Employees List State (Managed by Manager)
  const [employees, setEmployees] = useState<EmployeeAccount[]>(() => {
    const local = localStorage.getItem('saber_group_employees');
    if (local) {
      try { return JSON.parse(local); } catch (e) {}
    }
    return [
      {
        id: 'emp-101',
        name: 'م. أحمد جودة',
        email: 'ahmed@sabergroup.com',
        passwordHash: 'emp123',
        code: 'EMP-101',
        role: 'employee',
        department: 'محاسب مبيعات وعملاء',
        createdAt: '2026-09-01',
        createdBy: 'المدير العام',
        active: true,
      },
      {
        id: 'emp-102',
        name: 'سارة إبراهيم',
        email: 'sara@sabergroup.com',
        passwordHash: 'emp123',
        code: 'EMP-102',
        role: 'employee',
        department: 'إداري الأكاديمية والكورسات',
        createdAt: '2026-09-10',
        createdBy: 'المدير العام',
        active: true,
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('saber_group_employees', JSON.stringify(employees));
  }, [employees]);

  const handleAddEmployee = (newEmp: EmployeeAccount) => {
    setEmployees((prev) => [newEmp, ...prev]);
    showToast(`تم حفظ وتفعيل حساب الموظف ${newEmp.name} بنجاح ✓`);
  };

  const handleRemoveEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    showToast('تم حذف حساب الموظف.');
  };

  const handleToggleActiveEmployee = (id: string) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, active: !e.active } : e))
    );
    showToast('تم تحديث حالة حساب الموظف.');
  };

  const handleSuccessAuth = (user: {
    uid: string;
    email: string;
    displayName: string;
    role: 'admin' | 'employee';
  }) => {
    setUserRole(user.role);
    setActiveUserName(user.displayName);
    setActiveUserEmail(user.email);
    localStorage.setItem('saber_active_user_name', user.displayName);
    localStorage.setItem('saber_active_user_email', user.email);
    localStorage.setItem('saber_active_user_role', user.role);
    showToast(
      user.role === 'admin'
        ? `أهلاً بك يا ${user.displayName}! تم دخول المدير العام 🛡️`
        : `أهلاً بك يا ${user.displayName}! تم تسجيل دخول الموظف 👤`
    );
  };

  const handleSelectEmployeeAccount = (emp: EmployeeAccount) => {
    setUserRole('employee');
    setActiveUserName(emp.name);
    setActiveUserEmail(emp.email);
    localStorage.setItem('saber_active_user_name', emp.name);
    localStorage.setItem('saber_active_user_email', emp.email);
    localStorage.setItem('saber_active_user_role', 'employee');
    showToast(`تم تسجيل الدخول بصفتك الموظف: ${emp.name} (${emp.department}) ✓`);
  };

  const handleToggleRole = () => {
    if (userRole === 'admin') {
      // Opening Employee Selector Modal for Manager
      setIsSelectEmployeeModalOpen(true);
    } else {
      // Switch back to Admin General Manager
      setUserRole('admin');
      setActiveUserName('مجموعة صابر المحاسبية');
      setActiveUserEmail('saber.group@accounting.com');
      localStorage.setItem('saber_active_user_name', 'مجموعة صابر المحاسبية');
      localStorage.setItem('saber_active_user_email', 'saber.group@accounting.com');
      localStorage.setItem('saber_active_user_role', 'admin');
      showToast('تم التحويل إلى واجهة المدير العام (كامل الصلاحيات) 🛡️');
    }
  };

  // AI Advisor Modal State
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);

  // Navigation & Layout State
  const [activeTab, setActiveTab] = useState<TabType>('general_ledger');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Search, modals & toast
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [dismissWarning, setDismissWarning] = useState(false);

  // Core Data State
  const [wallets, setWallets] = useState<Wallet[]>(INITIAL_WALLETS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [installments, setInstallments] = useState<Installment[]>(INITIAL_INSTALLMENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Qershnat Extended State
  const [debts, setDebts] = useState<DebtItem[]>([
    {
      id: 'd1',
      personName: 'م. أحمد جودة',
      phone: '01012345678',
      totalAmount: 15000,
      paidAmount: 5000,
      currency: 'EGP',
      startDate: '2026-01-15',
      dueDate: '2026-10-01',
      direction: 'receivable',
      status: 'pending',
      notes: 'قرض مؤقت للمشروع',
    },
    {
      id: 'd2',
      personName: 'شركة التجهيزات',
      phone: '01298765432',
      totalAmount: 28000,
      paidAmount: 12000,
      currency: 'EGP',
      startDate: '2026-02-01',
      dueDate: '2026-11-15',
      direction: 'payable',
      status: 'pending',
      notes: 'التزام معدات وأجهزة',
    },
  ]);

  const [circles, setCircles] = useState<MoneyCircle[]>([
    {
      id: 'mc1',
      name: 'جمعية العائلة الراقية 2026',
      monthlyAmount: 5000,
      totalPayout: 50000,
      totalShares: 10,
      currency: 'EGP',
      startDate: '2026-01-01',
      myTurnMonth: 'الشهر الثالث (مارس)',
      status: 'active',
      members: [
        { id: 'm1', name: 'أحمد محمود', turnNumber: 1, payoutMonth: 'يناير', isPaidCurrentMonth: true },
        { id: 'm2', name: 'سارة جلال', turnNumber: 2, payoutMonth: 'فبراير', isPaidCurrentMonth: true },
        { id: 'm3', name: 'أنت (تم الاستلام)', turnNumber: 3, payoutMonth: 'مارس', isPaidCurrentMonth: true },
        { id: 'm4', name: 'طارق علي', turnNumber: 4, payoutMonth: 'أبريل', isPaidCurrentMonth: false },
      ],
    },
  ]);

  const [budgets, setBudgets] = useState<BudgetItem[]>([
    {
      id: 'b1',
      name: 'ميزانية التسوق والمواد الغذائية',
      category: 'طعام ومشروبات',
      maxLimit: 12000,
      spentAmount: 8400,
      currency: 'EGP',
      period: 'monthly',
    },
    {
      id: 'b2',
      name: 'ميزانية الفواتير والبنزين',
      category: 'فواتير واشتراكات',
      maxLimit: 6000,
      spentAmount: 5100,
      currency: 'EGP',
      period: 'monthly',
    },
  ]);

  const [goals, setGoals] = useState<GoalItem[]>([
    {
      id: 'g1',
      title: 'شراء سيارة جديدة موديل 2026',
      targetAmount: 450000,
      currentAmount: 180000,
      currency: 'EGP',
      progressPercent: 40,
      targetDate: '2026-12-31',
      category: 'ادخار واستثمار',
    },
    {
      id: 'g2',
      title: 'رحلة العمرة والزيارة',
      targetAmount: 60000,
      currentAmount: 45000,
      currency: 'EGP',
      progressPercent: 75,
      targetDate: '2026-11-01',
      category: 'رحلات ودين',
    },
  ]);

  const [trusts, setTrusts] = useState<TrustItem[]>([
    {
      id: 'tr1',
      ownerName: 'د. حسام الدين',
      title: 'أمانة مالية لشراء قطعة أرض مشتركة',
      amount: 100000,
      currency: 'EGP',
      receivedDate: '2026-03-10',
      status: 'held',
      notes: 'مفصولة تماماً عن تقارير الدخل والمصروفات الشخصية لضمان الأمانة',
    },
  ]);

  const [guardians, setGuardians] = useState<GuardianRecord[]>([
    {
      id: 'gr1',
      title: 'تفاصيل الخزنة والوثائق الرسمية',
      category: 'bank_vault',
      confidentialData: 'مفتاح الخزنة في الحجرة رقم 2 - رقم الإغلاق: 8492. وصية ملكية الأصول معتمدة في الشهر العقاري.',
      guardianName: 'المهندس طارق (الأخ)',
      guardianPhone: '01000998877',
      emergencyOnly: true,
      isUnlocked: false,
      updatedAt: '2026-08-01',
    },
  ]);

  const [sharedList, setSharedList] = useState<SharedAccess[]>([
    {
      id: 'sa1',
      memberName: 'أميرة (الزوجة)',
      relation: 'زوجة',
      roleLevel: 'editor',
      sharedWallets: ['المحفظة النقدية', 'فيزا المشتريات CIB'],
    },
  ]);

  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [notebook, setNotebook] = useState<NotebookEntry[]>([
    {
      id: 'n1',
      title: 'خطة المصاريف والتزامات الربع الثالث 2026',
      content: 'التركيز على تسديد أقساط الائتمان وزيادة نسبة الادخار بفرع البنك الأهلي.',
      category: 'مالي',
      tags: ['تخطيط'],
      updatedAt: '2026-09-01',
    },
  ]);

  const [occasions, setOccasions] = useState<OccasionGift[]>([
    {
      id: 'occ1',
      eventName: 'حفل زفاف المهندس كريم',
      personName: 'كريم محمود',
      type: 'given',
      amount: 2000,
      currency: 'EGP',
      date: '2026-08-20',
      linkedWalletName: 'المحفظة النقدية',
    },
  ]);

  const [assets, setAssets] = useState<AssetDocument[]>([
    {
      id: 'ast1',
      title: 'تغيير زيت المحرك وتيل الفرامل (تويوتا)',
      assetType: 'vehicle',
      category: 'maintenance',
      cost: 3200,
      carMileage: 85000,
      date: '2026-09-10',
    },
  ]);

  // Company & Academy Data State
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [clients, setClients] = useState<ClientOrStudent[]>(INITIAL_CLIENTS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);

  // Firebase Auth User State
  const [authUser, setAuthUser] = useState<User | null>(null);

  // Sync with Firestore & Auth on mount
  useEffect(() => {
    let unsubWallets: (() => void) | undefined;
    let unsubTransactions: (() => void) | undefined;
    let unsubInstallments: (() => void) | undefined;

    // Listen to Firebase Authentication changes
    const unsubAuth = subscribeToAuthChanges((user) => {
      setAuthUser(user);
    });

    async function initDatabase() {
      try {
        await seedInitialDataIfEmpty();
        setIsDbConnected(true);

        unsubWallets = subscribeToWallets((data) => {
          if (data && data.length > 0) setWallets(data);
        });

        unsubTransactions = subscribeToTransactions((data) => {
          if (data && data.length > 0) setTransactions(data);
        });

        unsubInstallments = subscribeToInstallments((data) => {
          if (data && data.length > 0) setInstallments(data);
        });
      } catch (err) {
        console.error('Firestore connection error:', err);
        setIsDbConnected(false);
      }
    }

    initDatabase();

    return () => {
      if (unsubWallets) unsubWallets();
      if (unsubTransactions) unsubTransactions();
      if (unsubInstallments) unsubInstallments();
      unsubAuth();
    };
  }, []);

  const handleLoginWithGoogle = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        showToast(`أهلاً بك ${user.displayName || user.email}! تم تسجيل الدخول بـ Gmail بنجاح ✓`);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      showToast('تعذر فتح نافذة تسجيل الدخول بـ Google. يرجى السماح بالنوافذ المنبثقة.');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error('Logout error:', e);
    }
    setAuthUser(null);
    setActiveUserName('');
    setActiveUserEmail('');
    localStorage.removeItem('saber_active_user_name');
    localStorage.removeItem('saber_active_user_email');
    localStorage.removeItem('saber_active_user_role');
    showToast('تم تسجيل الخروج بنجاح. يمكنك الدخول الآن كـ مدير أو موظف.');
    setIsAuthModalOpen(true);
  };

  const handleSaveSettings = async (newLang: Language, newCurr: string) => {
    setLanguage(newLang);
    setPreferredCurrency(newCurr);
    localStorage.setItem('qershnat_language', newLang);
    localStorage.setItem('qershnat_currency', newCurr);

    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;

    // Update all wallets in local state
    const updated = wallets.map((w) => ({
      ...w,
      currency: newCurr,
    }));
    setWallets(updated);

    // Batch update all wallets currency in Firestore
    try {
      await updateAllWalletsCurrency(newCurr, wallets);
    } catch (err) {
      console.error('Error updating wallets currency in Firestore:', err);
    }

    showToast(
      newLang === 'ar'
        ? `تم تحديث لغة التطبيق إلى (العربية) والعملة المفضلة إلى (${newCurr}) بنجاح ✓`
        : `App language set to English & preferred currency updated to (${newCurr}) successfully ✓`
    );
  };

  // Financial Alert Monitor Logic
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Warning triggers if expense exceeds income or expense is higher than 85% of income
  const isFinancialWarning =
    totalExpense > 0 && (totalExpense > totalIncome || totalExpense >= totalIncome * 0.85);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleAddTransaction = (newTx: Partial<Transaction>) => {
    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      title: newTx.title || 'عملية جديدة',
      category: newTx.category || 'عام',
      subcategory: newTx.subcategory,
      amount: newTx.amount || 0,
      currency: newTx.currency || 'EGP',
      type: newTx.type || 'expense',
      date: newTx.date || new Date().toISOString().split('T')[0],
      walletName: newTx.walletName || 'المحفظة النقدية',
      fee: newTx.fee,
      attachments: newTx.attachments,
      isRecurring: newTx.isRecurring,
      recurringFrequency: newTx.recurringFrequency,
      description: newTx.description,
    };

    setTransactions((prev) => [tx, ...prev]);
    saveTransaction(tx).catch((err) => console.error('Error saving transaction:', err));

    // Balance update
    if (newTx.amount) {
      setWallets((prev) =>
        prev.map((w) => {
          if (w.name === tx.walletName) {
            const delta = tx.type === 'income' ? tx.amount : -tx.amount - (tx.fee || 0);
            const newBal = w.balance + delta;
            updateWalletBalance(w.id, newBal).catch((err) => console.error('Error updating wallet:', err));
            return { ...w, balance: newBal };
          }
          return w;
        })
      );
    }
  };

  const handleAddWallet = (newWallet: Partial<Wallet>) => {
    const w: Wallet = {
      id: `w_${Date.now()}`,
      name: newWallet.name || 'محفظة جديدة',
      type: newWallet.type || 'cash',
      typeLabel: newWallet.typeLabel || 'محفظة',
      balance: newWallet.balance || 0,
      currency: newWallet.currency || 'EGP',
      creditLimit: newWallet.creditLimit,
      creditUsed: newWallet.creditUsed,
      accountNumber: newWallet.accountNumber,
    };
    setWallets((prev) => [...prev, w]);
  };

  const handleAddDebt = (debt: Partial<DebtItem>) => {
    const item: DebtItem = {
      id: `d_${Date.now()}`,
      personName: debt.personName || 'شخص',
      phone: debt.phone,
      totalAmount: debt.totalAmount || 0,
      paidAmount: debt.paidAmount || 0,
      currency: debt.currency || 'EGP',
      startDate: debt.startDate || new Date().toISOString().split('T')[0],
      dueDate: debt.dueDate || '2026-12-31',
      direction: debt.direction || 'receivable',
      status: 'pending',
    };
    setDebts((prev) => [item, ...prev]);
  };

  const handleAddCircle = (circle: Partial<MoneyCircle>) => {
    const item: MoneyCircle = {
      id: `mc_${Date.now()}`,
      name: circle.name || 'جمعية شهرية',
      monthlyAmount: circle.monthlyAmount || 1000,
      totalPayout: circle.totalPayout || 10000,
      totalShares: circle.totalShares || 10,
      currency: circle.currency || 'EGP',
      startDate: circle.startDate || new Date().toISOString().split('T')[0],
      myTurnMonth: circle.myTurnMonth || 'الشهر الأول',
      status: 'active',
      members: circle.members || [],
    };
    setCircles((prev) => [item, ...prev]);
  };

  const handleAddBudget = (budget: Partial<BudgetItem>) => {
    const b: BudgetItem = {
      id: `b_${Date.now()}`,
      name: budget.name || 'ميزانية جديدة',
      category: budget.category || 'عام',
      maxLimit: budget.maxLimit || 1000,
      spentAmount: budget.spentAmount || 0,
      currency: budget.currency || 'EGP',
      period: budget.period || 'monthly',
    };
    setBudgets((prev) => [...prev, b]);
  };

  const handleAddGoal = (goal: Partial<GoalItem>) => {
    const g: GoalItem = {
      id: `g_${Date.now()}`,
      title: goal.title || 'هدف مالي جديد',
      targetAmount: goal.targetAmount || 1000,
      currentAmount: goal.currentAmount || 0,
      currency: goal.currency || 'EGP',
      progressPercent: goal.progressPercent || 0,
      targetDate: goal.targetDate || '2026-12-31',
      category: goal.category || 'ادخار',
    };
    setGoals((prev) => [...prev, g]);
  };

  const handleContributeGoal = (goalId: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const newCurrent = g.currentAmount + amount;
          const newPercent = g.targetAmount > 0 ? Math.min(100, Math.round((newCurrent / g.targetAmount) * 100)) : 0;
          return { ...g, currentAmount: newCurrent, progressPercent: newPercent };
        }
        return g;
      })
    );
  };

  const handleAddTrust = (trust: Partial<TrustItem>) => {
    const t: TrustItem = {
      id: `tr_${Date.now()}`,
      ownerName: trust.ownerName || 'صاحب الأمانة',
      title: trust.title || 'أمانة مالية',
      amount: trust.amount || 0,
      currency: trust.currency || 'EGP',
      receivedDate: trust.receivedDate || new Date().toISOString().split('T')[0],
      status: 'held',
      notes: trust.notes,
    };
    setTrusts((prev) => [t, ...prev]);
  };

  const handleAddGuardian = (record: Partial<GuardianRecord>) => {
    const gr: GuardianRecord = {
      id: `gr_${Date.now()}`,
      title: record.title || 'سجل خزنة الوصي',
      category: record.category || 'bank_vault',
      confidentialData: record.confidentialData || '',
      guardianName: record.guardianName || 'الوصي',
      guardianPhone: record.guardianPhone || '',
      emergencyOnly: true,
      isUnlocked: false,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setGuardians((prev) => [gr, ...prev]);
  };

  const handleAddSharedAccess = (access: Partial<SharedAccess>) => {
    const sa: SharedAccess = {
      id: `sa_${Date.now()}`,
      memberName: access.memberName || 'فرد من العائلة',
      relation: access.relation || 'قريب',
      roleLevel: access.roleLevel || 'viewer',
      sharedWallets: access.sharedWallets || ['المحفظة النقدية'],
    };
    setSharedList((prev) => [...prev, sa]);
  };

  const handleAddTask = (task: Partial<Task>) => {
    const t: Task = {
      id: `task_${Date.now()}`,
      title: task.title || 'مهمة جديدة',
      priority: task.priority || 'medium',
      column: 'todo',
      assignee: task.assignee || 'أنت',
      courseOrProject: task.courseOrProject || 'عام',
      dueDate: task.dueDate || 'اليوم',
    };
    setTasks((prev) => [t, ...prev]);
  };

  const handleAddCourse = async (courseData: Partial<Course>) => {
    const newCourse: Course = {
      id: courseData.id || 'c_' + Date.now(),
      title: courseData.title || 'دورة جديدة',
      subtitle: courseData.subtitle || 'دورة تدريبية متقدمة',
      category: courseData.category || 'برمجة وتطوير',
      instructor: courseData.instructor || 'أستاذ المحاضر',
      price: courseData.price || 3000,
      duration: courseData.duration || '8 أسابيع',
      studentsCount: courseData.studentsCount || 1,
      maxStudents: courseData.maxStudents || 30,
      progress: courseData.progress || 0,
      status: 'active',
      level: courseData.level || 'متوسط',
    };
    setCourses((prev) => [newCourse, ...prev]);
    await saveCourse(newCourse);
  };

  const handleAddClient = async (clientData: Partial<ClientOrStudent>) => {
    const newClient: ClientOrStudent = {
      id: clientData.id || 'st_' + Date.now(),
      name: clientData.name || 'طالب جديد',
      email: clientData.email || 'student@academy.com',
      phone: clientData.phone || '01000000000',
      type: clientData.type || 'student',
      typeLabel: clientData.typeLabel || 'متدرب',
      coursesEnrolled: clientData.coursesEnrolled || ['دورة عامة'],
      totalPaid: clientData.totalPaid || 0,
      initials: clientData.initials || 'طج',
    };
    setClients((prev) => [newClient, ...prev]);
    await saveClient(newClient);
  };

  const handleAddInvoice = async (invData: Partial<Invoice>) => {
    const newInv: Invoice = {
      id: invData.id || 'inv_' + Date.now(),
      invoiceNumber: invData.invoiceNumber || 'INV-' + Math.floor(1000 + Math.random() * 9000),
      clientName: invData.clientName || 'عميل شركة',
      courseOrService: invData.courseOrService || 'خدمات تدريبية وحلول برمجية',
      date: invData.date || new Date().toISOString().split('T')[0],
      amount: invData.amount || 0,
      status: invData.status || 'paid',
    };
    setInvoices((prev) => [newInv, ...prev]);
    await saveInvoice(newInv);
  };

  const handleUpdateInstallmentStatus = async (
    id: string,
    paidAmount: number,
    remainingAmount: number,
    status: 'paid' | 'pending' | 'overdue'
  ) => {
    setInstallments((prev) =>
      prev.map((inst) =>
        inst.id === id
          ? {
              ...inst,
              paidAmount,
              remainingAmount,
              status,
              lastPaymentDate: new Date().toISOString().split('T')[0],
            }
          : inst
      )
    );
    await updateInstallmentStatus(id, status, paidAmount, remainingAmount);
  };

  const handleAddNote = (note: Partial<NotebookEntry>) => {
    const n: NotebookEntry = {
      id: `n_${Date.now()}`,
      title: note.title || 'ملاحظة جديدة',
      content: note.content || '',
      category: note.category || 'عام',
      tags: note.tags || [],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setNotebook((prev) => [n, ...prev]);
  };

  const handleAddOccasion = (occ: Partial<OccasionGift>) => {
    const o: OccasionGift = {
      id: `occ_${Date.now()}`,
      eventName: occ.eventName || 'مناسبة',
      personName: occ.personName || 'شخص',
      type: occ.type || 'given',
      amount: occ.amount || 0,
      currency: occ.currency || 'EGP',
      date: occ.date || new Date().toISOString().split('T')[0],
      linkedWalletName: occ.linkedWalletName,
    };
    setOccasions((prev) => [o, ...prev]);
  };

  const handleAddAsset = (asset: Partial<AssetDocument>) => {
    const a: AssetDocument = {
      id: `ast_${Date.now()}`,
      title: asset.title || 'سجل صيانة / مستند',
      assetType: asset.assetType || 'vehicle',
      category: asset.category || 'maintenance',
      cost: asset.cost,
      carMileage: asset.carMileage,
      date: asset.date || new Date().toISOString().split('T')[0],
    };
    setAssets((prev) => [a, ...prev]);
  };

  const handlePayInstallment = (instId: string) => {
    setInstallments((prev) =>
      prev.map((i) => (i.id === instId ? { ...i, status: 'paid' } : i))
    );
    showToast('تم تحديث حالة القسط إلى مدفوع ✓');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-['Cairo',sans-serif] transition-colors duration-200 dir-rtl">
      {/* Sidebar Navigation */}
      <div className="hidden lg:block print:hidden">
        <SidebarNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          isDbConnected={isDbConnected}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          language={language}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end print:hidden">
          <div className="w-72 bg-white dark:bg-slate-900 h-full shadow-2xl relative">
            <SidebarNav
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab);
                setMobileSidebarOpen(false);
              }}
              onOpenAddModal={() => {
                setIsAddModalOpen(true);
                setMobileSidebarOpen(false);
              }}
              isDbConnected={isDbConnected}
              collapsed={false}
              onToggleCollapse={() => setMobileSidebarOpen(false)}
              language={language}
            />
          </div>
        </div>
      )}

      {/* Main Body */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:mr-20' : 'lg:mr-72'
        } print:mr-0`}
      >
        <Header
          notifications={notifications}
          onMarkNotificationAsRead={(id) =>
            setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
          }
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isDbConnected={isDbConnected}
          theme={theme}
          onToggleTheme={toggleTheme}
          userEmail={activeUserEmail || authUser?.email || 'saber.group@accounting.com'}
          userName={activeUserName || authUser?.displayName || (userRole === 'admin' ? 'مجموعة صابر (المدير العام)' : 'موظف العمليات')}
          userPhoto={authUser?.photoURL || null}
          isAuthenticated={!!authUser || !!activeUserEmail}
          onLoginWithGoogle={handleLoginWithGoogle}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenEmployeeMgmtModal={() => setIsEmployeeMgmtModalOpen(true)}
          onLogout={handleLogout}
          onToggleSidebar={() => setMobileSidebarOpen(true)}
          onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
          currentLanguage={language}
          currentCurrency={preferredCurrency}
          onSaveSettings={handleSaveSettings}
          userRole={userRole}
          onToggleRole={handleToggleRole}
        />

        {/* Financial Warning Alert Banner */}
        {!dismissWarning && (
          <FinancialAlertBanner
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            isWarning={isFinancialWarning}
            onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
            onDismiss={() => setDismissWarning(true)}
          />
        )}

        <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 pb-16 print:p-0">
          <AnimatePresence mode="wait">
            {/* 1. General Ledger & Accounts View */}
            {(activeTab === 'general_ledger' || activeTab === 'wallets_transactions') && (
              <motion.div
                key="general_ledger"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
              >
                <WalletsTransactionsView
                  wallets={wallets}
                  transactions={transactions}
                  onAddTransaction={handleAddTransaction}
                  onAddWallet={handleAddWallet}
                  showToast={showToast}
                />
              </motion.div>
            )}

            {/* 2. Sales & Receivables View */}
            {activeTab === 'sales_receivables' && (
              <motion.div
                key="sales_receivables"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
              >
                <CompanyAcademyView
                  courses={courses}
                  clients={clients}
                  installments={installments}
                  invoices={invoices}
                  tasks={tasks}
                  onAddCourse={handleAddCourse}
                  onAddClient={handleAddClient}
                  onAddInvoice={handleAddInvoice}
                  onAddTask={handleAddTask}
                  onUpdateInstallment={handleUpdateInstallmentStatus}
                  onAddTransaction={handleAddTransaction}
                  showToast={showToast}
                  currency={preferredCurrency}
                  userRole={userRole}
                />
              </motion.div>
            )}

            {/* 3. Purchases & Payables View */}
            {(activeTab === 'purchases_payables' || activeTab === 'debts_and_circles') && (
              <motion.div
                key="purchases_payables"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
              >
                <DebtsAndCirclesView
                  debts={debts}
                  installments={installments}
                  circles={circles}
                  onAddDebt={handleAddDebt}
                  onAddCircle={handleAddCircle}
                  onPayInstallment={handlePayInstallment}
                  showToast={showToast}
                />
              </motion.div>
            )}

            {/* 4. Inventory & Warehouses View */}
            {(activeTab === 'inventory' || activeTab === 'daily_life_assets') && (
              <motion.div
                key="inventory"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
              >
                <DailyLifeAndAssetsView
                  tasks={tasks}
                  notebook={notebook}
                  occasions={occasions}
                  assets={assets}
                  onAddTask={handleAddTask}
                  onAddNote={handleAddNote}
                  onAddOccasion={handleAddOccasion}
                  onAddAsset={handleAddAsset}
                  showToast={showToast}
                />
              </motion.div>
            )}

            {/* 5. Treasury & Banking View */}
            {activeTab === 'banking' && (
              <motion.div
                key="banking"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
              >
                <WalletsTransactionsView
                  wallets={wallets}
                  transactions={transactions}
                  onAddTransaction={handleAddTransaction}
                  onAddWallet={handleAddWallet}
                  showToast={showToast}
                />
              </motion.div>
            )}

            {/* 6. Academy & Courses View */}
            {activeTab === 'business' && (
              <motion.div
                key="business"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
              >
                <CompanyAcademyView
                  courses={courses}
                  clients={clients}
                  installments={installments}
                  invoices={invoices}
                  tasks={tasks}
                  onAddCourse={handleAddCourse}
                  onAddClient={handleAddClient}
                  onAddInvoice={handleAddInvoice}
                  onAddTask={handleAddTask}
                  onUpdateInstallment={handleUpdateInstallmentStatus}
                  onAddTransaction={handleAddTransaction}
                  showToast={showToast}
                  currency={preferredCurrency}
                  userRole={userRole}
                />
              </motion.div>
            )}

            {/* 7. Payroll & HR System View */}
            {activeTab === 'payroll_hr' && (
              <motion.div
                key="payroll_hr"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
              >
                <PayrollHRView
                  onAddTransaction={handleAddTransaction}
                  showToast={showToast}
                  currency={preferredCurrency}
                  userRole={userRole}
                />
              </motion.div>
            )}

            {/* 8. Financial Reports & Cost Centers View */}
            {(activeTab === 'financial_reports' || activeTab === 'smart_tools_analytics') && (
              <motion.div
                key="financial_reports"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
              >
                <SmartToolsAnalyticsView
                  wallets={wallets}
                  transactions={transactions}
                  onAddTransaction={handleAddTransaction}
                  showToast={showToast}
                />
              </motion.div>
            )}

            {/* Extra fallback views if accessed */}
            {activeTab === 'budgets_and_goals' && (
              <motion.div
                key="budgets_and_goals"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
              >
                <BudgetsAndGoalsView
                  budgets={budgets}
                  goals={goals}
                  onAddBudget={handleAddBudget}
                  onAddGoal={handleAddGoal}
                  onContributeGoal={handleContributeGoal}
                  showToast={showToast}
                />
              </motion.div>
            )}

            {activeTab === 'trusts_and_guardian' && (
              <motion.div
                key="trusts_and_guardian"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
              >
                <TrustsAndGuardianView
                  trusts={trusts}
                  guardians={guardians}
                  sharedList={sharedList}
                  onAddTrust={handleAddTrust}
                  onAddGuardian={handleAddGuardian}
                  onAddSharedAccess={handleAddSharedAccess}
                  showToast={showToast}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Authentication & Access Control Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccessAuth={handleSuccessAuth}
        onLoginWithGoogle={handleLoginWithGoogle}
        employeesList={employees}
        language={language}
      />

      {/* Employee Management Modal for Admin */}
      <EmployeeManagementModal
        isOpen={isEmployeeMgmtModalOpen}
        onClose={() => setIsEmployeeMgmtModalOpen(false)}
        employees={employees}
        onAddEmployee={handleAddEmployee}
        onRemoveEmployee={handleRemoveEmployee}
        onToggleActiveEmployee={handleToggleActiveEmployee}
        language={language}
      />

      {/* Select Employee Account Modal */}
      <SelectEmployeeModal
        isOpen={isSelectEmployeeModalOpen}
        onClose={() => setIsSelectEmployeeModalOpen(false)}
        employees={employees}
        onSelectEmployee={handleSelectEmployeeAccount}
        onOpenAddEmployeeModal={() => setIsEmployeeMgmtModalOpen(true)}
        language={language}
      />

      {/* AI Organization Advisor Modal */}
      <AiOrganizationModal
        isOpen={isAiAdvisorOpen}
        onClose={() => setIsAiAdvisorOpen(false)}
        wallets={wallets}
        transactions={transactions}
        budgets={budgets}
        debts={debts}
      />

      {/* Quick Add Modal */}
      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCourse={() => {}}
        onAddClient={() => {}}
        onAddTransaction={handleAddTransaction}
        onAddTask={handleAddTask}
        onAddInvoice={() => {}}
        showToast={showToast}
      />

      {/* Fast Toast Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-xl border border-slate-700 flex items-center gap-2 whitespace-nowrap"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Offline Connectivity Indicator */}
      <OfflineIndicator />
    </div>
  );
}
