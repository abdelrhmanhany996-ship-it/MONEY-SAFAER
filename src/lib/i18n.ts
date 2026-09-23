export type Language = 'ar' | 'en';

export interface TranslationDictionary {
  appName: string;
  settings: string;
  language: string;
  arabic: string;
  english: string;
  preferredCurrency: string;
  selectCurrency: string;
  accountSettings: string;
  saveSettings: string;
  settingsSaved: string;
  wallets: string;
  debtsAndCircles: string;
  budgetsAndGoals: string;
  trustsAndGuardian: string;
  dailyLife: string;
  smartTools: string;
  companyAcademy: string;
  signOut: string;
  signedInAs: string;
  firestoreConnected: string;
  financialAlert: string;
  aiAdvisor: string;
  themeToggle: string;
  darkMode: string;
  lightMode: string;
  installApp: string;
  // Role Translations
  managerRole: string;
  employeeRole: string;
  switchRole: string;
  currentRole: string;
  employeeViewNotice: string;
  managerViewNotice: string;
  // General ERP Pillar Titles
  generalLedgerTitle: string;
  salesReceivablesTitle: string;
  treasuryBankingTitle: string;
  academyCoursesTitle: string;
  financialReportsTitle: string;
  payrollHRTitle: string;
  // General Actions & Terms
  addTransaction: string;
  addWallet: string;
  income: string;
  expense: string;
  transfer: string;
  balance: string;
  totalIncome: string;
  totalExpense: string;
  netProfit: string;
  courses: string;
  students: string;
  invoices: string;
  costCenters: string;
  action: string;
  status: string;
  date: string;
  amount: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  viewDetails: string;
  printInvoice: string;
  quickSearch: string;
  notifications: string;
  // Employee Selection
  selectEmployeeTitle: string;
  selectEmployeeSubtitle: string;
  manageEmployees: string;
  addEmployee: string;
  employeeCode: string;
  employeeDepartment: string;
  activeStatus: string;
  inactiveStatus: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  ar: {
    appName: 'مجموعة صابر للمحاسبة',
    settings: 'الإعدادات والتفضيلات',
    language: 'لغة التطبيق',
    arabic: 'العربية (Arabic)',
    english: 'الإنجليزية (English)',
    preferredCurrency: 'العملة المفضلة الحالية',
    selectCurrency: 'اختر العملة الرئيسية للمحافظ',
    accountSettings: 'إعدادات حساب مجموعة صابر',
    saveSettings: 'حفظ وتطبيق التغييرات',
    settingsSaved: 'تم تحديث اللغة والعملة المفضلة عبر كافة المحافظ بنجاح ✓',
    wallets: 'المحافظ والعمليات المالية',
    debtsAndCircles: 'الديون والأقساط والجمعيات',
    budgetsAndGoals: 'الميزانيات والأهداف المالية',
    trustsAndGuardian: 'الأمانات والوصايا والخصوصية',
    dailyLife: 'الحياة اليومية والمستندات',
    smartTools: 'المساعد الذكي والتحليل',
    companyAcademy: 'نظام الشركة والأكاديمية',
    signOut: 'تسجيل الخروج من الحساب',
    signedInAs: 'حساب موثق في مجموعة صابر',
    firestoreConnected: 'قواعد Firestore متصلة حياً',
    financialAlert: 'إنذار مالية الميزانية',
    aiAdvisor: 'مستشار التنظيم الذكي',
    themeToggle: 'تبديل المظهر',
    darkMode: 'الوضع الداكن 🌙',
    lightMode: 'الوضع الفاتح ☀️',
    installApp: 'تثبيت تطبيق الشركة (PWA)',
    managerRole: 'مدير النظام (كامل الصلاحيات)',
    employeeRole: 'موظف تشغيلي (صلاحيات محددة)',
    switchRole: 'التبديل بين دور المدير ودور الموظف',
    currentRole: 'الدور الحالي',
    employeeViewNotice: 'أنت الآن في واجهة الموظف: متاح تسجيل العمليات، الفواتير، ومتابعة الطلاب والمهام اليومية.',
    managerViewNotice: 'أنت الآن في واجهة المدير: متاح التحكم الكامل بمراكز التكلفة، التقارير المالية، والتعديلات الإدارية.',
    generalLedgerTitle: '1. الحسابات العامة والشجرة',
    salesReceivablesTitle: '2. المبيعات والعملاء',
    treasuryBankingTitle: '3. الخزينة والبنوك',
    academyCoursesTitle: '4. الأكاديمية والكورسات',
    financialReportsTitle: '5. التقارير والقوائم المالية',
    payrollHRTitle: 'جدول المرتبات وإدارة الموظفين',
    addTransaction: 'تسجيل عملية جديدة',
    addWallet: 'إضافة محفظة جديدة',
    income: 'إيراد / مدخول',
    expense: 'مصروف / خرج',
    transfer: 'تحويل مالي',
    balance: 'الرصيد الإجمالي',
    totalIncome: 'إجمالي المقبوضات',
    totalExpense: 'إجمالي المصروفات',
    netProfit: 'صافي الأرباح',
    courses: 'الكورسات والدبلومات',
    students: 'الطلاب والعملاء',
    invoices: 'الفواتير والمبيعات',
    costCenters: 'مراكز التكلفة للفروع',
    action: 'إجراء',
    status: 'الحالة',
    date: 'التاريخ',
    amount: 'المبلغ',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    viewDetails: 'عرض التفاصيل',
    printInvoice: 'طباعة الفاتورة',
    quickSearch: 'بحث سريع في السيستم...',
    notifications: 'التنبيهات والرسائل',
    selectEmployeeTitle: 'اختر حساب الموظف للعمل به 👤',
    selectEmployeeSubtitle: 'حدد حساب الموظف المعتمد للتحويل إلى واجهته التشغيلية',
    manageEmployees: 'إدارة حسابات الموظفين والصلاحيات',
    addEmployee: 'إضافة موظف جديد',
    employeeCode: 'كود الموظف',
    employeeDepartment: 'القسم / الفرع',
    activeStatus: 'نشط',
    inactiveStatus: 'موقوف',
  },
  en: {
    appName: 'Saber Group Accounting',
    settings: 'Settings & Preferences',
    language: 'App Language',
    arabic: 'العربية (Arabic)',
    english: 'English (الإنجليزية)',
    preferredCurrency: 'Primary Preferred Currency',
    selectCurrency: 'Select primary currency for wallets',
    accountSettings: 'Saber Group Account Settings',
    saveSettings: 'Save & Apply Changes',
    settingsSaved: 'Language and currency updated across all wallets successfully ✓',
    wallets: 'Wallets & Financial Transactions',
    debtsAndCircles: 'Debts & Money Circles',
    budgetsAndGoals: 'Budgets & Financial Goals',
    trustsAndGuardian: 'Trusts & Confidential Vault',
    dailyLife: 'Daily Operations & Documents',
    smartTools: 'AI Assistant & Analytics',
    companyAcademy: 'Company & Academy System',
    signOut: 'Sign Out Account',
    signedInAs: 'Verified Saber Group Account',
    firestoreConnected: 'Firestore Database Live',
    financialAlert: 'Budget Warning Alert',
    aiAdvisor: 'AI Smart Advisor',
    themeToggle: 'Toggle Theme',
    darkMode: 'Dark Mode 🌙',
    lightMode: 'Light Mode ☀️',
    installApp: 'Install Desktop / Mobile App (PWA)',
    managerRole: 'System Manager (Full Access)',
    employeeRole: 'Operations Staff (Restricted)',
    switchRole: 'Switch between Manager & Employee Role',
    currentRole: 'Current Active Role',
    employeeViewNotice: 'Employee Interface Active: Quick transaction entry, invoices, student logs, & daily tasks enabled.',
    managerViewNotice: 'Manager Interface Active: Full administrative control, cost centers, profit/loss, & global settings.',
    generalLedgerTitle: '1. General Ledger & Chart of Accounts',
    salesReceivablesTitle: '2. Sales & Receivables',
    treasuryBankingTitle: '3. Treasury & Banking',
    academyCoursesTitle: '4. Academy & Courses',
    financialReportsTitle: '5. Financial Reports & Analytics',
    payrollHRTitle: 'Payroll & HR Management',
    addTransaction: 'Record New Transaction',
    addWallet: 'Add New Wallet',
    income: 'Income / Revenue',
    expense: 'Expense / Cost',
    transfer: 'Money Transfer',
    balance: 'Total Balance',
    totalIncome: 'Total Revenue',
    totalExpense: 'Total Expenses',
    netProfit: 'Net Profit',
    courses: 'Courses & Diplomas',
    students: 'Students & Clients',
    invoices: 'Invoices & Sales',
    costCenters: 'Cost Centers & Branches',
    action: 'Action',
    status: 'Status',
    date: 'Date',
    amount: 'Amount',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    viewDetails: 'View Details',
    printInvoice: 'Print Invoice',
    quickSearch: 'Search system...',
    notifications: 'Notifications & Alerts',
    selectEmployeeTitle: 'Select Employee Account 👤',
    selectEmployeeSubtitle: 'Choose authorized staff account to switch to employee interface',
    manageEmployees: 'Manage Staff Accounts & Permissions',
    addEmployee: 'Add New Staff Member',
    employeeCode: 'Staff Code',
    employeeDepartment: 'Department / Branch',
    activeStatus: 'Active',
    inactiveStatus: 'Suspended',
  },
};

export const SUPPORTED_CURRENCIES = [
  { code: 'EGP', nameAr: 'الجنيه المصري (ج.م)', nameEn: 'Egyptian Pound (EGP)', symbol: 'EGP' },
  { code: 'SAR', nameAr: 'الريال السعودي (ر.س)', nameEn: 'Saudi Riyal (SAR)', symbol: 'SAR' },
  { code: 'USD', nameAr: 'الدولار الأمريكي ($)', nameEn: 'US Dollar (USD)', symbol: '$' },
  { code: 'EUR', nameAr: 'اليورو الأوروبي (€)', nameEn: 'Euro (EUR)', symbol: '€' },
  { code: 'AED', nameAr: 'الدرهم الإماراتي (د.إ)', nameEn: 'UAE Dirham (AED)', symbol: 'AED' },
  { code: 'KWD', nameAr: 'الدينار الكويتي (د.ك)', nameEn: 'Kuwaiti Dinar (KWD)', symbol: 'KWD' },
  { code: 'BHD', nameAr: 'الدينار البحريني (د.ب)', nameEn: 'Bahraini Dinar (BHD)', symbol: 'BHD' },
  { code: 'QAR', nameAr: 'الريال القطري (ر.ق)', nameEn: 'Qatari Riyal (QAR)', symbol: 'QAR' },
  { code: 'JOD', nameAr: 'الدينار الأردني (د.أ)', nameEn: 'Jordanian Dinar (JOD)', symbol: 'JOD' },
  { code: 'OMR', nameAr: 'الريال العماني (ر.ع)', nameEn: 'Omani Rial (OMR)', symbol: 'OMR' },
];
