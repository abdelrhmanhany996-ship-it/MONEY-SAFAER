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
  signOut: string;
  signedInAs: string;
  firestoreConnected: string;
  financialAlert: string;
  aiAdvisor: string;
  themeToggle: string;
  darkMode: string;
  lightMode: string;
  installApp: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  ar: {
    appName: 'قرشنات',
    settings: 'الإعدادات والتفضيلات',
    language: 'لغة التطبيق',
    arabic: 'العربية (Arabic)',
    english: 'الإنجليزية (English)',
    preferredCurrency: 'العملة المفضلة الحالية',
    selectCurrency: 'اختر العملة الرئيسية للمحافظ',
    accountSettings: 'إعدادات الحساب الشخصي',
    saveSettings: 'حفظ وتطبيق التغييرات',
    settingsSaved: 'تم تحديث اللغة والعملة المفضلة عبر كافة المحافظ بنجاح ✓',
    wallets: 'المحافظ والعمليات',
    debtsAndCircles: 'الديون والجمعيات',
    budgetsAndGoals: 'الميزانيات والأهداف',
    trustsAndGuardian: 'الأمانات والوصايا',
    dailyLife: 'الحياة اليومية والتنظيم',
    smartTools: 'المساعد الذكي والتحليل',
    signOut: 'تسجيل الخروج من الحساب',
    signedInAs: 'حساب موثق في Firestore',
    firestoreConnected: 'Firestore متصلة',
    financialAlert: 'إنذار مالية الميزانية',
    aiAdvisor: 'مستشار التنظيم الذكي',
    themeToggle: 'تبديل المظهر',
    darkMode: 'الوضع الداكن',
    lightMode: 'الوضع الفاتح',
    installApp: 'تثبيت التطبيق (PWA)',
  },
  en: {
    appName: 'Qershnat',
    settings: 'Settings & Preferences',
    language: 'App Language',
    arabic: 'العربية (Arabic)',
    english: 'English (الإنجليزية)',
    preferredCurrency: 'Primary Preferred Currency',
    selectCurrency: 'Select primary currency for wallets',
    accountSettings: 'Personal Account Settings',
    saveSettings: 'Save & Apply Changes',
    settingsSaved: 'Language & currency updated across all wallets successfully ✓',
    wallets: 'Wallets & Transactions',
    debtsAndCircles: 'Debts & Money Circles',
    budgetsAndGoals: 'Budgets & Financial Goals',
    trustsAndGuardian: 'Trusts & Confidential Vault',
    dailyLife: 'Daily Life & Tasks',
    smartTools: 'AI Assistant & Analytics',
    signOut: 'Sign Out Account',
    signedInAs: 'Verified Firestore Profile',
    firestoreConnected: 'Firestore Connected',
    financialAlert: 'Budget Warning Alert',
    aiAdvisor: 'AI Smart Advisor',
    themeToggle: 'Toggle Theme',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    installApp: 'Install PWA App',
  },
};

export const SUPPORTED_CURRENCIES = [
  { code: 'EGP', nameAr: 'الجنيه المصري (ج.م)', nameEn: 'Egyptian Pound (EGP)', symbol: 'ج.م' },
  { code: 'SAR', nameAr: 'الريال السعودي (ر.س)', nameEn: 'Saudi Riyal (SAR)', symbol: 'ر.س' },
  { code: 'USD', nameAr: 'الدولار الأمريكي ($)', nameEn: 'US Dollar (USD)', symbol: '$' },
  { code: 'EUR', nameAr: 'اليورو الأوروبي (€)', nameEn: 'Euro (EUR)', symbol: '€' },
  { code: 'AED', nameAr: 'الدرهم الإماراتي (د.إ)', nameEn: 'UAE Dirham (AED)', symbol: 'د.إ' },
  { code: 'KWD', nameAr: 'الدينار الكويتي (د.ك)', nameEn: 'Kuwaiti Dinar (KWD)', symbol: 'د.ك' },
  { code: 'BHD', nameAr: 'الدينار البحريني (د.ب)', nameEn: 'Bahraini Dinar (BHD)', symbol: 'د.ب' },
  { code: 'QAR', nameAr: 'الريال القطري (ر.ق)', nameEn: 'Qatari Riyal (QAR)', symbol: 'ر.ق' },
  { code: 'JOD', nameAr: 'الدينار الأردني (د.أ)', nameEn: 'Jordanian Dinar (JOD)', symbol: 'د.أ' },
  { code: 'OMR', nameAr: 'الريال العماني (ر.ع)', nameEn: 'Omani Rial (OMR)', symbol: 'ر.ع' },
];
