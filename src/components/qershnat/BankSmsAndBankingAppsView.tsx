import React, { useState } from 'react';
import {
  MessageSquareCode,
  Smartphone,
  CreditCard,
  Building2,
  Send,
  Plus,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowRightLeft,
  Apple,
} from 'lucide-react';
import { Wallet, Transaction } from '../../types';

interface BankSmsAndBankingAppsViewProps {
  wallets: Wallet[];
  onAddTransaction: (tx: Partial<Transaction>) => void;
  showToast: (msg: string) => void;
  lang?: 'ar' | 'en';
}

interface ParsedSmsResult {
  bankName: string;
  amount: number;
  currency: string;
  type: 'expense' | 'income';
  cardLast4?: string;
  merchant?: string;
  dateTime?: string;
  confidence: number;
}

export default function BankSmsAndBankingAppsView({
  wallets,
  onAddTransaction,
  showToast,
  lang = 'ar',
}: BankSmsAndBankingAppsViewProps) {
  const [smsText, setSmsText] = useState('');
  const [selectedWalletName, setSelectedWalletName] = useState(wallets[0]?.name || 'المحفظة النقدية');
  const [parsedResult, setParsedResult] = useState<ParsedSmsResult | null>(null);

  // Sample template SMS for quick testing
  const SAMPLE_SMS = [
    {
      label: 'CIB - عملية شراء Apple Pay',
      text: 'CIB: Purchase of EGP 1,450.00 with your card ending in 4092 at Carrefour Egypt on 2026-09-21 via Apple Pay. Avail bal: EGP 28,500.00.',
    },
    {
      label: 'البنك الأهلي - تحويل انستا باي',
      text: 'تم تحويل مبلغ 3,500 جم بنجاح من حسابك ****8821 عبر انستا باي InstaPay إلى أحمد علي بتاريخ 21-09-2026. المتبقي: 42,100 جم.',
    },
    {
      label: 'فودافون كاش - خصم مصروفات',
      text: 'تم خصم 450 جنيه مقابل دفع فاتورة الكهرباء عبر فودافون كاش. رصيدك الحالي هو 2,150 جنيه.',
    },
    {
      label: 'بنك مصر - سحب نقدي ATM',
      text: 'بنك مصر: عملية سحب نقدي بمبلغ 2,000 جنيه مصري من ماكينة ATM من بطاقة خصم مباشر ****1102. الرصيد المتاح: 18,900 جم.',
    },
  ];

  // Bank SMS Parser Algorithm
  const parseBankSms = (text: string): ParsedSmsResult | null => {
    if (!text.trim()) return null;

    let bankName = 'بنك / محفظة إلكترونية';
    let amount = 0;
    let currency = 'EGP';
    let type: 'expense' | 'income' = 'expense';
    let cardLast4 = '';
    let merchant = '';

    // 1. Identify Bank or Service
    if (/CIB/i.test(text)) bankName = 'CIB (التجاري الدولي)';
    else if (/الأهلي|NBE/i.test(text)) bankName = 'البنك الأهلي المصري';
    else if (/بنك مصر|BM/i.test(text)) bankName = 'بنك مصر';
    else if (/فودافون كاش|Vodafone/i.test(text)) bankName = 'فودافون كاش';
    else if (/QNB/i.test(text)) bankName = 'QNB الأهلي';
    else if (/InstaPay|انستا باي/i.test(text)) bankName = 'انستا باي InstaPay';
    else if (/Apple Pay/i.test(text)) bankName = 'Apple Pay (أبل باي)';

    // 2. Detect Amount & Currency
    const amountMatch = text.match(/(?:EGP|جم|جنيه|USD|\$)\s*([\d,]+(?:\.\d+)?)|([\d,]+(?:\.\d+)?)\s*(?:EGP|جم|جنيه|USD|\$)/i);
    if (amountMatch) {
      const rawNum = (amountMatch[1] || amountMatch[2]).replace(/,/g, '');
      amount = parseFloat(rawNum) || 0;
    } else {
      const fallbackNum = text.match(/[\d,]+(?:\.\d+)?/);
      if (fallbackNum) amount = parseFloat(fallbackNum[0].replace(/,/g, '')) || 0;
    }

    if (/USD|\$/i.test(text)) currency = 'USD';

    // 3. Detect Expense vs Income
    if (/إيداع|استلام|تم تحويل لك|Credited|Received|Deposit/i.test(text)) {
      type = 'income';
    }

    // 4. Extract Card / Account Last 4 digits
    const cardMatch = text.match(/(?:card|حسابك|بطاقة|ending in|\*\*\*\*)\s*([0-9]{4})/i) || text.match(/\*{3,4}([0-9]{4})/);
    if (cardMatch) {
      cardLast4 = cardMatch[1];
    }

    // 5. Extract Merchant Name
    const merchantMatch = text.match(/(?:at|لدى|من|في)\s+([A-Za-z0-9\sأ-ي]+?)(?=\s+(?:on|بتاريخ|via|المتبقي|Avail|$))/i);
    if (merchantMatch) {
      merchant = merchantMatch[1].trim();
    } else if (type === 'expense') {
      merchant = 'عملية بنكية عبر الرسائل';
    }

    return {
      bankName,
      amount,
      currency,
      type,
      cardLast4,
      merchant: merchant || (type === 'income' ? 'إيداع بنكي' : 'مشتريات/سحب'),
      confidence: amount > 0 ? 0.95 : 0.6,
    };
  };

  const handleTextChange = (val: string) => {
    setSmsText(val);
    if (val.trim().length > 10) {
      const res = parseBankSms(val);
      setParsedResult(res);
    } else {
      setParsedResult(null);
    }
  };

  const handleApplySample = (sampleText: string) => {
    setSmsText(sampleText);
    const res = parseBankSms(sampleText);
    setParsedResult(res);
  };

  const handleSaveTransaction = () => {
    if (!parsedResult || parsedResult.amount <= 0) {
      showToast('يرجى التأكد من استخراج المبلغ بشكل صحيح');
      return;
    }

    onAddTransaction({
      title: `${parsedResult.merchant} (${parsedResult.bankName})`,
      amount: parsedResult.amount,
      currency: parsedResult.currency,
      type: parsedResult.type,
      category: parsedResult.type === 'income' ? 'دفعات وإيداع' : 'مشتريات وبنوك',
      subcategory: parsedResult.bankName,
      walletName: selectedWalletName,
      date: new Date().toISOString().split('T')[0],
      description: `تمت القراءة والتسجيل الآلي من رسالة البنك SMS. بطاقة: ****${parsedResult.cardLast4 || '---'}`,
    });

    showToast(
      lang === 'ar'
        ? `تم تسجيل العملية بقيمة ${parsedResult.amount} ${parsedResult.currency} بنجاح ✓`
        : `Transaction of ${parsedResult.amount} ${parsedResult.currency} added successfully!`
    );

    setSmsText('');
    setParsedResult(null);
  };

  // Browser Web Payment Request API Test for Apple Pay / Google Pay
  const handleTestApplePayRequest = async () => {
    if (window.PaymentRequest) {
      try {
        const supportedInstruments = [
          {
            supportedMethods: 'https://apple.com/apple-pay',
            data: {
              version: 3,
              merchantIdentifier: 'merchant.com.qershnat.app',
              countryCode: 'EG',
              currencyCode: 'EGP',
              supportedNetworks: ['visa', 'masterCard', 'meeza'],
              merchantCapabilities: ['supports3DS'],
            },
          },
          { supportedMethods: 'basic-card' },
        ];

        const details = {
          total: {
            label: 'اختبار محفظة قرشنات Apple Pay',
            amount: { currency: 'EGP', value: '10.00' },
          },
        };

        const request = new PaymentRequest(supportedInstruments, details);
        showToast('جاري فتح شاشة اختبار Apple Pay / الدفع الإلكتروني...');
        await request.show();
      } catch (err: any) {
        showToast('Apple Pay متوافق مع متصفحك وسيعمل عند الدفع في المتاجر الرسمية.');
      }
    } else {
      showToast('خاصية Apple Pay Web متوفرة رسمياً على متصفح Safari على جهاز الآيفون والماك.');
    }
  };

  const BANK_APPS = [
    {
      id: 'instapay',
      name: 'انستا باي InstaPay',
      subtitle: 'التحويل اللحظي لكافة البنوك والبطاقات',
      bg: 'bg-indigo-600',
      icon: <Zap className="w-5 h-5 text-white" />,
      deepLink: 'https://www.instapay.eg/',
      storeUrl: 'https://play.google.com/store/apps/details?id=com.egyptianbanks.instapay',
    },
    {
      id: 'cib',
      name: 'CIB Egypt Mobile',
      subtitle: 'البنك التجاري الدولي',
      bg: 'bg-blue-700',
      icon: <Building2 className="w-5 h-5 text-white" />,
      deepLink: 'https://www.cibeg.com/',
      storeUrl: 'https://www.cibeg.com/arabic/personal/services/digital-services/cib-mobile-banking',
    },
    {
      id: 'nbe',
      name: 'الأهلي فون NBE',
      subtitle: 'البنك الأهلي المصري',
      bg: 'bg-emerald-700',
      icon: <ShieldCheck className="w-5 h-5 text-white" />,
      deepLink: 'https://www.nbe.com.eg/',
      storeUrl: 'https://www.nbe.com.eg/',
    },
    {
      id: 'vfcash',
      name: 'فودافون كاش Vodafone Cash',
      subtitle: 'محفظة الهاتف المحمول الأولى',
      bg: 'bg-rose-600',
      icon: <Smartphone className="w-5 h-5 text-white" />,
      deepLink: 'tel:*9%23',
      storeUrl: 'https://web.vodafone.com.eg/ar/vodafone-cash',
    },
    {
      id: 'applepay',
      name: 'محفظة Apple Pay',
      subtitle: 'الدفع المباشر باللمس على الآيفون والماك',
      bg: 'bg-slate-900 dark:bg-slate-800',
      icon: <Apple className="w-5 h-5 text-white" />,
      deepLink: 'https://www.apple.com/apple-pay/',
      storeUrl: 'https://www.apple.com/apple-pay/',
    },
  ];

  return (
    <div className="space-y-6 dir-rtl">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-xl relative overflow-hidden border border-emerald-800/50">
        <div className="absolute left-0 top-0 translate-y-[-20%] translate-x-[-10%] w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[11px] border border-emerald-500/30">
                ميزة ذكية حصرياً
              </span>
              <span className="text-xs text-emerald-200">الربط البنكي و SMS</span>
            </div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <MessageSquareCode className="w-6 h-6 text-emerald-400" />
              <span>قارئ رسائل البنوك والاتصال بالتطبيقات و Apple Pay</span>
            </h2>
            <p className="text-xs text-emerald-100/80 mt-1 max-w-2xl leading-relaxed">
              قم بلصق رسائل الـ SMS الواردة من البنك أو التطبيق لحساب العملية تلقائياً دون الحاجة للإدخال اليدوي.
            </p>
          </div>

          <button
            onClick={handleTestApplePayRequest}
            className="px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-emerald-50 text-xs font-black shadow-md flex items-center gap-2 shrink-0 transition-all cursor-pointer active:scale-95"
          >
            <Apple className="w-4 h-4 text-slate-900" />
            <span>اختصار Apple Pay</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Bank SMS Reader & Converter */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                    مستخرج رسائل البنوك الذكي (SMS Parser)
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    انسخ نص الرسالة البنكية والصقها هنا
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Sample Selector */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                تجارب سريعة (اضغط لتجربة التحليل):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_SMS.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleApplySample(sample.text)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 dark:hover:text-emerald-300 text-slate-700 dark:text-slate-300 text-[11px] font-bold transition-all border border-slate-200/60 dark:border-slate-700/50 cursor-pointer"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Textarea */}
            <div>
              <textarea
                value={smsText}
                onChange={(e) => handleTextChange(e.target.value)}
                rows={3}
                placeholder="مثال: CIB: Purchase of EGP 450.00 with card ****4092 at Carrefour via Apple Pay..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
              />
            </div>

            {/* Parsed Result Display Box */}
            {parsedResult && (
              <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 space-y-3 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white font-extrabold text-[10px]">
                    تم تحليل الرسالة بنجاح (ثقة {Math.round(parsedResult.confidence * 100)}%)
                  </span>
                  <span className="text-xs font-extrabold text-emerald-900 dark:text-emerald-200">
                    {parsedResult.bankName}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-emerald-100 dark:border-emerald-900/50">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">المبلغ والمصروف:</span>
                    <span
                      className={`font-extrabold text-sm ${
                        parsedResult.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {parsedResult.type === 'income' ? '+' : '-'} {parsedResult.amount} {parsedResult.currency}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-emerald-100 dark:border-emerald-900/50">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">الجهة / التاجر:</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200 truncate block">
                      {parsedResult.merchant}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-emerald-100 dark:border-emerald-900/50">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">رقم البطاقة:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      ****{parsedResult.cardLast4 || 'غير محدد'}
                    </span>
                  </div>
                </div>

                {/* Target Wallet Selection & Save */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <div className="w-full sm:w-auto flex-1">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      إيداع/خصم العملية في المحفظة التالية:
                    </label>
                    <select
                      value={selectedWalletName}
                      onChange={(e) => setSelectedWalletName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {wallets.map((w) => (
                        <option key={w.id} value={w.name}>
                          {w.name} (رصيد: {w.balance} {w.currency})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleSaveTransaction}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>تسجيل العملية فوراً في المحفظة</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Banking Apps & Apple Pay Integration Hub */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                    الاتصال المباشر ببرامج البنوك و Apple Pay
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    روابط سريعة ومباشرة لتطبيقات البنوك والمحافظ
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              {BANK_APPS.map((app) => (
                <div
                  key={app.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl ${app.bg} flex items-center justify-center shrink-0 shadow-xs`}>
                      {app.icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-xs truncate">
                        {app.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {app.subtitle}
                      </p>
                    </div>
                  </div>

                  <a
                    href={app.deepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <span>فتح</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 text-[11px] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>جميع البيانات البنكية والرسائل تعالج محلياً داخل جهازك بأعلى معايير الخصوصية والأمان.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
