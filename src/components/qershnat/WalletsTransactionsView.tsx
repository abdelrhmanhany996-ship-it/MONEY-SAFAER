import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wallet as WalletIcon,
  CreditCard,
  Building2,
  Smartphone,
  Coins,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  Paperclip,
  Clock,
  DollarSign,
  Tag,
  Search,
  Filter,
  CheckCircle2,
  X,
  FileText,
  Volume2,
  Video,
  Image as ImageIcon,
  AlertCircle,
  Percent,
} from 'lucide-react';
import { Wallet, Transaction, AttachmentItem } from '../../types';

interface WalletsTransactionsViewProps {
  wallets: Wallet[];
  transactions: Transaction[];
  onAddTransaction: (tx: Partial<Transaction>) => void;
  onAddWallet: (wallet: Partial<Wallet>) => void;
  showToast: (msg: string) => void;
}

export default function WalletsTransactionsView({
  wallets,
  transactions,
  onAddTransaction,
  onAddWallet,
  showToast,
}: WalletsTransactionsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'wallets' | 'transactions'>('wallets');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense' | 'transfer'>('all');
  const [selectedWallet, setSelectedWallet] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  // New Transaction Form state
  const [txTitle, setTxTitle] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txCurrency, setTxCurrency] = useState('EGP');
  const [txType, setTxType] = useState<'income' | 'expense' | 'transfer'>('expense');
  const [txCategory, setTxCategory] = useState('طعام ومشروبات');
  const [txSubcategory, setTxSubcategory] = useState('مطاعم وبقالة');
  const [txWallet, setTxWallet] = useState(wallets[0]?.name || 'المحفظة النقدية');
  const [txFee, setTxFee] = useState('');
  const [txDesc, setTxDesc] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFreq, setRecurringFreq] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [attachmentUrlInput, setAttachmentUrlInput] = useState('');
  const [attachmentTypeInput, setAttachmentTypeInput] = useState<'image' | 'pdf' | 'audio' | 'video'>('image');

  // New Wallet Form state
  const [wName, setWName] = useState('');
  const [wType, setWType] = useState<'cash' | 'bank' | 'credit_card' | 'vodafone_cash' | 'instapay'>('cash');
  const [wBalance, setWBalance] = useState('');
  const [wCurrency, setWCurrency] = useState('EGP');
  const [wLimit, setWLimit] = useState('');
  const [wAccountNum, setWAccountNum] = useState('');

  const handleAddAttachment = () => {
    if (!attachmentUrlInput) return;
    const newAtt: AttachmentItem = {
      id: 'att_' + Date.now(),
      name: `مرفق_${attachments.length + 1}`,
      type: attachmentTypeInput,
      url: attachmentUrlInput,
    };
    setAttachments([...attachments, newAtt]);
    setAttachmentUrlInput('');
    showToast('تمت إضافة المرفق بنجاح');
  };

  const handleCreateTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txTitle || !txAmount) {
      showToast('يرجى ملء المبلغ وعنوان العملية');
      return;
    }
    const amountNum = parseFloat(txAmount);
    const feeNum = txFee ? parseFloat(txFee) : 0;

    onAddTransaction({
      title: txTitle,
      description: txDesc,
      amount: amountNum,
      currency: txCurrency,
      fee: feeNum,
      type: txType,
      category: txCategory,
      subcategory: txSubcategory,
      walletName: txWallet,
      date: new Date().toISOString().split('T')[0],
      attachments,
      isRecurring,
      recurringFrequency: isRecurring ? recurringFreq : undefined,
    });

    setIsTxModalOpen(false);
    // Reset
    setTxTitle('');
    setTxAmount('');
    setTxFee('');
    setTxDesc('');
    setAttachments([]);
    showToast('تم تسجيل العملية بنجاح');
  };

  const handleCreateWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wName) {
      showToast('يرجى إدخال اسم المحفظة');
      return;
    }
    const balNum = wBalance ? parseFloat(wBalance) : 0;
    const limitNum = wLimit ? parseFloat(wLimit) : 0;

    const typeLabels: Record<string, string> = {
      cash: 'نقدي (كاش)',
      bank: 'حساب بنكي',
      credit_card: 'بطاقة ائتمانية (Visa/Master)',
      vodafone_cash: 'محفظة إلكترونية (فودافون كاش)',
      instapay: 'إنستاباي (InstaPay)',
    };

    onAddWallet({
      name: wName,
      type: wType,
      typeLabel: typeLabels[wType] || 'محفظة',
      balance: balNum,
      currency: wCurrency,
      creditLimit: wType === 'credit_card' ? limitNum : undefined,
      creditUsed: wType === 'credit_card' ? 0 : undefined,
      badge: wCurrency,
      accountNumber: wAccountNum,
    });

    setIsWalletModalOpen(false);
    setWName('');
    setWBalance('');
    setWLimit('');
    setWAccountNum('');
    showToast('تم إضافة المحفظة الجديدة بنجاح');
  };

  // Calculations
  const totalCashBalance = wallets.reduce((acc, w) => acc + w.balance, 0);

  const filteredTx = transactions.filter((t) => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesWallet = selectedWallet === 'all' || t.walletName === selectedWallet;
    const matchesSearch =
      !searchQuery ||
      t.title.includes(searchQuery) ||
      t.category.includes(searchQuery) ||
      (t.description && t.description.includes(searchQuery));
    return matchesType && matchesWallet && matchesSearch;
  });

  return (
    <div className="space-y-5 pb-16" dir="rtl">
      {/* Top Banner Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white shadow-lg border border-emerald-700/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.25),transparent_60%)] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                القائمة الأولى
              </span>
              <span className="text-xs text-emerald-200">قرشنات • إدارة الأموال</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-['Cairo',sans-serif]">
              المحافظ والعمليات المالية (Wallets & Transactions)
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              تتبع جميع محافظك (كاش، بنوك، كروت ائتمان، ومحافظ إلكترونية)، وتسجيل المصروفات والإيرادات مع المرفقات ورسوم المعاملات والتكرار الدورية.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsWalletModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition border border-white/20 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-300" />
              <span>إضافة محفظة جديدة</span>
            </button>
            <button
              onClick={() => setIsTxModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل عملية جديدة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub Tabs Selector */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('wallets')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'wallets'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <WalletIcon className="w-4 h-4" />
            <span>المحافظ والحسابات ({wallets.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('transactions')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'transactions'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>سجل المعاملات والعمليات ({transactions.length})</span>
          </button>
        </div>

        <div className="text-left">
          <span className="text-[11px] text-slate-500">إجمالي الأرصدة السيالة: </span>
          <span className="text-sm font-black text-emerald-700 font-['Cairo',sans-serif]">
            {totalCashBalance.toLocaleString('ar-EG')} ج.م
          </span>
        </div>
      </div>

      {/* 1. WALLETS SECTION */}
      {activeSubTab === 'wallets' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {wallets.map((w) => {
              const isCredit = w.type === 'credit_card';
              const limit = w.creditLimit || 0;
              const used = w.creditUsed || 0;
              const remainingCredit = limit - used;
              const usedPercent = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;

              return (
                <div
                  key={w.id}
                  className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition group relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition">
                      {w.type === 'bank' && <Building2 className="w-5 h-5" />}
                      {w.type === 'credit_card' && <CreditCard className="w-5 h-5 text-indigo-600" />}
                      {w.type === 'cash' && <Coins className="w-5 h-5 text-amber-600" />}
                      {(w.type === 'vodafone_cash' || w.type === 'instapay') && (
                        <Smartphone className="w-5 h-5 text-rose-600" />
                      )}
                    </div>
                    <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                      {w.typeLabel}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">{w.name}</h3>
                    {w.accountNumber && (
                      <p className="text-[11px] text-slate-400 mb-2 font-mono">
                        رقم: {w.accountNumber}
                      </p>
                    )}

                    {!isCredit ? (
                      <div className="mt-2">
                        <span className="text-2xl font-black text-emerald-700 font-['Cairo',sans-serif]">
                          {w.balance.toLocaleString('ar-EG')}
                        </span>
                        <span className="text-xs text-slate-500 mr-1.5 font-bold">{w.currency}</span>
                      </div>
                    ) : (
                      <div className="mt-2 space-y-2">
                        <div>
                          <span className="text-xs text-slate-500 block">حد الائتمان الإجمالي</span>
                          <span className="text-lg font-bold text-slate-800 font-['Cairo',sans-serif]">
                            {limit.toLocaleString('ar-EG')} {w.currency}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${usedPercent}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-rose-600">مستغرق: {used.toLocaleString('ar-EG')}</span>
                          <span className="text-emerald-600">متبقي: {remainingCredit.toLocaleString('ar-EG')}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>العملة: {w.currency}</span>
                    <button
                      onClick={() => {
                        setTxWallet(w.name);
                        setIsTxModalOpen(true);
                      }}
                      className="text-emerald-700 font-bold hover:underline cursor-pointer"
                    >
                      + معاملة
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. TRANSACTIONS SECTION */}
      {activeSubTab === 'transactions' && (
        <div className="space-y-4">
          {/* Controls & Filters */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="بحث في العمليات والتصنيفات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-9 pl-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  filterType === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                الكل
              </button>
              <button
                onClick={() => setFilterType('income')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  filterType === 'income'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                دخل (+)
              </button>
              <button
                onClick={() => setFilterType('expense')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  filterType === 'expense'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                مصروف (-)
              </button>
              <button
                onClick={() => setFilterType('transfer')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  filterType === 'transfer'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                تحويل (⇄)
              </button>

              <select
                value={selectedWallet}
                onChange={(e) => setSelectedWallet(e.target.value)}
                className="py-1.5 px-3 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700"
              >
                <option value="all">كل المحافظ</option>
                {wallets.map((w) => (
                  <option key={w.id} value={w.name}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {filteredTx.length === 0 ? (
                <div className="p-12 text-center">
                  <Coins className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-600">لا توجد عمليات تطابق البحث</p>
                </div>
              ) : (
                filteredTx.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-4 hover:bg-slate-50/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                          tx.type === 'income'
                            ? 'bg-emerald-100 text-emerald-700'
                            : tx.type === 'expense'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-indigo-100 text-indigo-700'
                        }`}
                      >
                        {tx.type === 'income' && <ArrowDownLeft className="w-5 h-5" />}
                        {tx.type === 'expense' && <ArrowUpRight className="w-5 h-5" />}
                        {tx.type === 'transfer' && <ArrowLeftRight className="w-5 h-5" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{tx.title}</h4>
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            {tx.category} {tx.subcategory ? `• ${tx.subcategory}` : ''}
                          </span>
                          {tx.isRecurring && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              دوري ({tx.recurringFrequency})
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                          <span>المحفظة: {tx.walletName}</span>
                          <span>• {tx.date}</span>
                          {tx.fee && tx.fee > 0 ? (
                            <span className="text-rose-600 font-bold">• رسوم: {tx.fee} ج.م</span>
                          ) : null}
                          {tx.description && <span className="text-slate-400">• {tx.description}</span>}
                        </div>

                        {/* Attachments pills */}
                        {tx.attachments && tx.attachments.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-2">
                            <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                              <Paperclip className="w-3 h-3" /> المرفقات:
                            </span>
                            {tx.attachments.map((att) => (
                              <a
                                key={att.id}
                                href={att.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md hover:underline flex items-center gap-1"
                              >
                                {att.type === 'image' && <ImageIcon className="w-3 h-3" />}
                                {att.type === 'pdf' && <FileText className="w-3 h-3" />}
                                {att.type === 'audio' && <Volume2 className="w-3 h-3" />}
                                {att.type === 'video' && <Video className="w-3 h-3" />}
                                {att.name}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-left font-['Cairo',sans-serif]">
                      <span
                        className={`text-lg font-black ${
                          tx.type === 'income'
                            ? 'text-emerald-600'
                            : tx.type === 'expense'
                            ? 'text-rose-600'
                            : 'text-indigo-600'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : tx.type === 'expense' ? '-' : ''}
                        {tx.amount.toLocaleString('ar-EG')}
                      </span>
                      <span className="text-xs font-bold text-slate-500 mr-1">{tx.currency || 'EGP'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE TRANSACTION MODAL */}
      <AnimatePresence>
        {isTxModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]"
              dir="rtl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900">تسجيل عملية جديدة في قرشنات</h3>
                <button
                  onClick={() => setIsTxModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTx} className="space-y-4 mt-4">
                {/* Transaction Type selector */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTxType('expense')}
                    className={`py-2 rounded-2xl text-xs font-bold border transition cursor-pointer ${
                      txType === 'expense'
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    مصروف (-)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxType('income')}
                    className={`py-2 rounded-2xl text-xs font-bold border transition cursor-pointer ${
                      txType === 'income'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    دخل (+)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxType('transfer')}
                    className={`py-2 rounded-2xl text-xs font-bold border transition cursor-pointer ${
                      txType === 'transfer'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    تحويل (⇄)
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">المبلغ *</label>
                    <input
                      type="number"
                      required
                      placeholder="0.00"
                      value={txAmount}
                      onChange={(e) => setTxAmount(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">العملة</label>
                    <select
                      value={txCurrency}
                      onChange={(e) => setTxCurrency(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                    >
                      <option value="EGP">ج.م (EGP)</option>
                      <option value="USD">دولار ($ USD)</option>
                      <option value="EUR">يورو (€ EUR)</option>
                      <option value="SAR">ريال (SAR)</option>
                      <option value="AED">درهم (AED)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">عنوان العملية *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: شراء مشتريات السوبرماركت / راتب الشهر"
                    value={txTitle}
                    onChange={(e) => setTxTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">التصنيف الرئيسي</label>
                    <select
                      value={txCategory}
                      onChange={(e) => setTxCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                    >
                      <option value="طعام ومشروبات">طعام ومشروبات</option>
                      <option value="مواصلات وبنزين">مواصلات وبنزين</option>
                      <option value="فواتير واشتراكات">فواتير واشتراكات</option>
                      <option value="صحة وعلاج">صحة وعلاج</option>
                      <option value="تسوق وملابس">تسوق وملابس</option>
                      <option value="راتب ودخل">راتب ودخل</option>
                      <option value="تحويلات بنكية">تحويلات بنكية</option>
                      <option value="أخرى">أخرى</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">المحفظة المستخدمة</label>
                    <select
                      value={txWallet}
                      onChange={(e) => setTxWallet(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                    >
                      {wallets.map((w) => (
                        <option key={w.id} value={w.name}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    رسوم المعاملة (إن وجدت)
                  </label>
                  <input
                    type="number"
                    placeholder="مثال: 5 ج.م رسوم تحويل أو سحب"
                    value={txFee}
                    onChange={(e) => setTxFee(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Recurring Options */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={isRecurring}
                      onChange={(e) => setIsRecurring(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <span>تكرار العملية تلقائياً (دورية)</span>
                  </label>

                  {isRecurring && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 font-bold">معدل التكرار:</span>
                      <select
                        value={recurringFreq}
                        onChange={(e) => setRecurringFreq(e.target.value as any)}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800"
                      >
                        <option value="daily">يومياً</option>
                        <option value="weekly">أسبوعياً</option>
                        <option value="monthly">شهرياً</option>
                        <option value="yearly">سنوياً</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Attachments Option */}
                <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2">
                  <span className="text-xs font-bold text-emerald-900 block">
                    المرفقات (صور فواتير، PDF، تسجيل صوتي، فيديو)
                  </span>
                  <div className="flex items-center gap-2">
                    <select
                      value={attachmentTypeInput}
                      onChange={(e) => setAttachmentTypeInput(e.target.value as any)}
                      className="p-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800"
                    >
                      <option value="image">صورة فاتورة</option>
                      <option value="pdf">ملف PDF</option>
                      <option value="audio">تسجيل صوتي</option>
                      <option value="video">مقطع فيديو</option>
                    </select>

                    <input
                      type="text"
                      placeholder="رابط أو اسم المرفق"
                      value={attachmentUrlInput}
                      onChange={(e) => setAttachmentUrlInput(e.target.value)}
                      className="flex-1 p-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800"
                    />

                    <button
                      type="button"
                      onClick={handleAddAttachment}
                      className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                    >
                      إرفاق
                    </button>
                  </div>

                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {attachments.map((att) => (
                        <span
                          key={att.id}
                          className="text-[10px] font-bold text-emerald-800 bg-white border border-emerald-200 px-2 py-1 rounded-md flex items-center gap-1"
                        >
                          <Paperclip className="w-3 h-3" /> {att.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg shadow-emerald-600/20 cursor-pointer"
                  >
                    حفظ العملية الآن
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE WALLET MODAL */}
      <AnimatePresence>
        {isWalletModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200"
              dir="rtl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900">إضافة محفظة أو حساب جديد</h3>
                <button
                  onClick={() => setIsWalletModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateWallet} className="space-y-4 mt-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">نوع المحفظة *</label>
                  <select
                    value={wType}
                    onChange={(e) => setWType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                  >
                    <option value="cash">محفظة كاش (نقدي)</option>
                    <option value="bank">حساب بنكي</option>
                    <option value="credit_card">بطاقة ائتمانية (مع ميزة حد الائتمان)</option>
                    <option value="vodafone_cash">محفظة إلكترونية (فودافون كاش)</option>
                    <option value="instapay">حساب إنستاباي (InstaPay)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">اسم المحفظة *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: البنك الأهلي المصري / فيزا مشتريات CIB"
                    value={wName}
                    onChange={(e) => setWName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">الرصيد الافتتاحي</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={wBalance}
                      onChange={(e) => setWBalance(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">العملة</label>
                    <select
                      value={wCurrency}
                      onChange={(e) => setWCurrency(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                    >
                      <option value="EGP">ج.م (EGP)</option>
                      <option value="USD">دولار ($ USD)</option>
                      <option value="EUR">يورو (€ EUR)</option>
                      <option value="SAR">ريال (SAR)</option>
                      <option value="AED">درهم (AED)</option>
                    </select>
                  </div>
                </div>

                {wType === 'credit_card' && (
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      حد الائتمان المسموح (Credit Limit)
                    </label>
                    <input
                      type="number"
                      placeholder="مثال: 50,000 ج.م"
                      value={wLimit}
                      onChange={(e) => setWLimit(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    رقم الحساب أو المحفظة (اختياري)
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: 010xxxxxxx"
                    value={wAccountNum}
                    onChange={(e) => setWAccountNum(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg shadow-emerald-600/20 cursor-pointer"
                  >
                    إنشاء المحفظة الآن
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
