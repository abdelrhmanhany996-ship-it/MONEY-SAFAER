export type TabType =
  | 'dashboard'
  | 'wallets_tx'
  | 'wallets_transactions'
  | 'debts_circles'
  | 'debts_and_circles'
  | 'budgets_goals'
  | 'budgets_and_goals'
  | 'trusts_guardian'
  | 'trusts_and_guardian'
  | 'daily_life'
  | 'daily_life_assets'
  | 'smart_tools'
  | 'smart_tools_analytics'
  | 'bank_sms_apps'
  | 'home'
  | 'business'
  | 'money'
  | 'expenses'
  | 'installments'
  | 'cashflow'
  | 'daily_report'
  | 'general_ledger'
  | 'sales_receivables'
  | 'purchases_payables'
  | 'inventory'
  | 'banking'
  | 'financial_reports'
  | 'more';

export type UserRole = 'manager' | 'accountant';

// ==========================================
// 1. GENERAL LEDGER (الحسابات العامة)
// ==========================================
export type AccountCategory = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';

export interface AccountItem {
  id: string;
  code: string;
  name: string;
  parentCode?: string;
  category: AccountCategory;
  categoryLabel: string;
  level: number;
  debit: number;
  credit: number;
  balance: number;
  isParent?: boolean;
}

export interface JournalEntryLine {
  id: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  costCenter?: string;
  description?: string;
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  description: string;
  lines: JournalEntryLine[];
  totalAmount: number;
  reference?: string;
  status: 'posted' | 'draft';
  createdAt: string;
}

export interface CostCenter {
  id: string;
  code: string;
  name: string;
  manager: string;
  totalRevenue: number;
  totalExpense: number;
  netProfit: number;
  status: 'active' | 'inactive';
}

// ==========================================
// 2. SALES & RECEIVABLES (المبيعات والعملاء)
// ==========================================
export interface SalesInvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientPhone?: string;
  clientTaxNumber?: string;
  date: string;
  dueDate: string;
  items: SalesInvoiceItem[];
  subtotal: number;
  discount: number;
  vatRate: number; // standard 14% in Egypt
  vatAmount: number;
  grandTotal: number;
  paidAmount: number;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
  costCenter?: string;
  notes?: string;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  clientName: string;
  clientPhone?: string;
  date: string;
  expiryDate: string;
  items: SalesInvoiceItem[];
  subtotal: number;
  vatAmount: number;
  grandTotal: number;
  status: 'draft' | 'sent' | 'approved' | 'converted';
  convertedInvoiceId?: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  company?: string;
  phone: string;
  email: string;
  taxNumber?: string;
  creditLimit: number;
  currentBalance: number; // outstanding receivables
  totalInvoiced: number;
  address: string;
}

// ==========================================
// 3. PURCHASES & PAYABLES (المشتريات والموردين)
// ==========================================
export interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  vendorInvoiceNumber: string;
  vendorName: string;
  date: string;
  dueDate: string;
  items: {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  vatAmount: number;
  grandTotal: number;
  paidAmount: number;
  status: 'paid' | 'partial' | 'unpaid';
  costCenter?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorName: string;
  date: string;
  expectedDate: string;
  items: {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  grandTotal: number;
  status: 'draft' | 'approved' | 'received' | 'cancelled';
}

export interface VendorProfile {
  id: string;
  name: string;
  category: string;
  phone: string;
  email: string;
  taxNumber?: string;
  currentBalance: number; // accounts payable
  totalPurchased: number;
  paymentTerms: string;
}

// ==========================================
// 4. INVENTORY MANAGEMENT (المخازن والمخزون)
// ==========================================
export interface ProductItem {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  category: string;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  warehouseName: string;
}

export interface StockMovement {
  id: string;
  voucherNumber: string;
  type: 'inbound' | 'outbound' | 'adjustment';
  date: string;
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  reason: string;
  recipientOrSource: string;
}

// ==========================================
// 5. CASH & BANKING (الخزينة والبنوك)
// ==========================================
export interface PaymentVoucher {
  id: string;
  voucherNumber: string;
  type: 'receipt' | 'payment'; // سند قبض (+) أو سند صرف (-)
  date: string;
  partyName: string;
  amount: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'cheque' | 'vodafone_cash' | 'instapay';
  walletOrBank: string;
  accountCode: string;
  description: string;
  referenceNumber?: string;
}

export interface BankReconciliationItem {
  id: string;
  date: string;
  description: string;
  statementAmount: number;
  bookAmount: number;
  status: 'matched' | 'unmatched';
  reference: string;
}

export interface Installment {
  id: string;
  clientName: string;
  phone: string;
  courseTitle: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  installmentNumber: number;
  totalInstallments: number;
  installmentAmount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  lastPaymentDate?: string;
}

export type BusinessSubTab = 'courses' | 'clients' | 'tasks' | 'calendar' | 'invoices' | 'monitor';
export type MoneySubTab = 'wallets' | 'transactions' | 'reports' | 'goals';

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  category: 'برمجة وتطوير' | 'تسويق رقمي' | 'إدارة أعمال' | 'تصميم ومونتاج' | 'ذكاء اصطناعي';
  instructor: string;
  progress: number;
  studentsCount: number;
  maxStudents: number;
  duration: string;
  status: 'active' | 'planning' | 'completed';
  price: number;
  level: 'مبتدئ' | 'متوسط' | 'متقدم';
}

export interface ClientOrStudent {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'student' | 'company' | 'vip';
  typeLabel: string;
  coursesEnrolled: string[];
  totalPaid: number;
  initials: string;
}

export interface Task {
  id: string;
  title: string;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  column: 'todo' | 'in_progress' | 'done';
  courseOrProject: string;
  dueDate: string;
  scheduledDate?: string; // YYYY-MM-DD format e.g. '2026-09-21'
  time?: string; // e.g. '04:00 PM'
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  courseOrService: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

export interface Wallet {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'credit_card' | 'vodafone_cash' | 'instapay';
  typeLabel: string;
  balance: number;
  currency: string;
  badge?: string;
  creditLimit?: number; // للبطاقات الائتمانية
  creditUsed?: number;
  accountNumber?: string;
}

export interface AttachmentItem {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'audio' | 'video';
  url: string;
  size?: string;
}

export interface Transaction {
  id: string;
  title: string;
  description?: string;
  category: string;
  subcategory?: string;
  amount: number;
  currency: string; // دعم تعدد العملات
  fee?: number; // رسوم المعاملة أو التحويل
  type: 'income' | 'expense' | 'transfer';
  date: string;
  walletName: string;
  attachments?: AttachmentItem[]; // المرفقات
  isRecurring?: boolean; // تكرار العملية
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

// 2. الديون والأقساط والجمعيات
export interface DebtItem {
  id: string;
  personName: string;
  phone?: string;
  totalAmount: number;
  paidAmount: number;
  currency: string;
  startDate: string;
  dueDate: string;
  direction: 'receivable' | 'payable'; // لي (مستحق لي) أم علي (التزام)
  status: 'pending' | 'partial' | 'paid';
  notes?: string;
}

export interface MoneyCircleMember {
  id: string;
  name: string;
  phone?: string;
  turnNumber: number; // دور القبض
  payoutMonth: string; // شهر الاستلام
  isPaidCurrentMonth: boolean;
  paymentProofUrl?: string;
}

export interface MoneyCircle {
  id: string;
  name: string;
  monthlyAmount: number; // القسط الشهري للكل
  totalPayout: number; // المبلغ الإجمالي للقبض
  totalShares: number;
  currency: string;
  startDate: string;
  members: MoneyCircleMember[];
  myTurnMonth: string;
  status: 'active' | 'completed';
}

// 3. الميزانيات والأهداف المالية
export interface BudgetItem {
  id: string;
  name: string;
  category: string;
  maxLimit: number;
  spentAmount: number;
  currency: string;
  period: 'monthly' | 'weekly' | 'yearly';
  walletName?: string;
}

export interface GoalItem {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  progressPercent: number;
  targetDate: string;
  category: string;
  iconName?: string;
}

// 4. الأمانات والوصايا والخصوصية (عهد ووصي)
export interface TrustItem {
  id: string;
  ownerName: string; // اسم صاحب الأمانة
  ownerPhone?: string;
  title: string; // وصف الأمانة
  amount: number;
  currency: string;
  receivedDate: string;
  status: 'held' | 'returned';
  notes?: string;
  history?: { id: string; date: string; type: 'deposit' | 'withdraw'; amount: number; note: string }[];
}

export interface GuardianRecord {
  id: string;
  title: string;
  category: 'bank_vault' | 'will' | 'passwords' | 'property_docs';
  confidentialData: string;
  guardianName: string;
  guardianPhone: string;
  emergencyOnly: boolean;
  isUnlocked: boolean;
  updatedAt: string;
}

export interface SharedAccess {
  id: string;
  memberName: string;
  relation: string;
  roleLevel: 'viewer' | 'editor';
  sharedWallets: string[];
  sharedLedgers?: string[];
}

// 5. الحياة اليومية والتنظيم
export interface NotebookEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  updatedAt: string;
}

export interface OccasionGift {
  id: string;
  eventName: string; // مثل: زفاف، مولود، نجاح
  personName: string;
  type: 'given' | 'received'; // نقوط مدفوع أم مقبول
  amount: number;
  currency: string;
  giftDescription?: string;
  date: string;
  linkedWalletName?: string;
}

export interface AssetDocument {
  id: string;
  title: string; // اسم المستند أو المركبة
  assetType: 'vehicle' | 'property' | 'official_paper' | 'appliance';
  category: 'maintenance' | 'bill' | 'contract' | 'warranty';
  cost?: number;
  date: string;
  fileUrl?: string;
  carMileage?: number; // ك Counters للسيارات
  notes?: string;
}

// 6. المساعد الذكي والتحليل
export interface SmsHelperNotice {
  id: string;
  bankName: string;
  rawText: string;
  parsedAmount: number;
  parsedType: 'income' | 'expense';
  parsedMerchant?: string;
  date: string;
  isConverted: boolean;
}

export interface ZakatCalcData {
  cashWallets: number;
  goldGrams24: number;
  goldGrams21: number;
  silverGrams: number;
  debtsToDeduct: number;
  goldPrice24PerGram: number;
  zakatNisabEgp: number; // حد النصاب
  zakatDueEgp: number;
}

export interface FocusItem {
  id: string;
  title: string;
  time: string;
  tag: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export interface UpcomingBill {
  id: string;
  title: string;
  dueIn: string;
  amount: number;
  icon: 'wifi' | 'server' | 'marketing' | 'rent';
}

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'alert';
}
