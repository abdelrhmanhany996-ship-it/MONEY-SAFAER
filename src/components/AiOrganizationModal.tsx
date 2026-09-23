import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  X,
  Send,
  PieChart,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  TrendingDown,
  ArrowRight,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { Wallet, Transaction, BudgetItem, DebtItem } from '../types';

interface AiOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallets: Wallet[];
  transactions: Transaction[];
  budgets: BudgetItem[];
  debts: DebtItem[];
}

export default function AiOrganizationModal({
  isOpen,
  onClose,
  wallets,
  transactions,
  budgets,
  debts,
}: AiOrganizationModalProps) {
  const [messages, setMessages] = useState<
    { sender: 'user' | 'ai'; text: string; time: string }[]
  >([
    {
      sender: 'ai',
      text: 'أهلاً بك يا عبد الرحمن! أنا مستشار الذكاء الاصطناعي الخاص بك لتنظيم أموالك وحياتك. لقد قمت بتحليل جميع محافظك، معملاتك، وميزانياتك الحالية. كيف يمكنني مساعدتك اليوم في إعادة هيكلة وتنظيم أموالك؟',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'advisor' | 'autobudget' | 'debts'>('advisor');

  if (!isOpen) return null;

  // Calculate high-level financial metrics for the AI
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);
  const totalDebtReceivable = debts.filter(d => d.direction === 'receivable').reduce((sum, d) => sum + (d.totalAmount - d.paidAmount), 0);
  const totalDebtPayable = debts.filter(d => d.direction === 'payable').reduce((sum, d) => sum + (d.totalAmount - d.paidAmount), 0);

  // Group expenses by category
  const expensesByCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const sortedExpenseCategories = Object.entries(expensesByCategory).sort(
    (a, b) => b[1] - a[1]
  );

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() || isLoading) return;

    const userText = inputQuery.trim();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [...prev, { sender: 'user', text: userText, time: timeStr }]);
    setInputQuery('');
    setIsLoading(true);

    try {
      // Direct call to Gemini API or smart response generator
      const promptText = `أنت مستشار مالي ذكي لتطبيق "قرشنات" باللغة العربية.
بيانات المستخدم الحالية:
- إجمالي الرصيد في المحافظ: ${totalBalance} ج.م
- إجمالي الدخل: ${totalIncome} ج.م
- إجمالي المصروفات: ${totalExpense} ج.م
- الديون التي عليه (التزامات): ${totalDebtPayable} ج.م
- الديون التي له (مستحقات): ${totalDebtReceivable} ج.م
- أعلى 3 مصاريف: ${sortedExpenseCategories.slice(0, 3).map(([c, a]) => `${c}: ${a} ج.م`).join(', ')}

سؤال المستخدم: "${userText}"

يرجى إعطاء إجابة ماليّة ودقيقة ومنظمة ومحددة باللغة العربية مع خطوات عملية لتنظيم المال.`;

      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText }),
      });

      let aiReply = '';
      if (response.ok) {
        const data = await response.json();
        aiReply = data.text || data.reply;
      }

      if (!aiReply) {
        // Rule-based fallback if API endpoint is standard client side
        if (userText.includes('توفير') || userText.includes('ادخار')) {
          aiReply = `لتوفير المال بناءً على تحليلاتك الحالية:\n1. خفّض مصاريف فئة (${sortedExpenseCategories[0]?.[0] || 'المصاريف المتغيرة'}) التي استهلكت ${sortedExpenseCategories[0]?.[1] || 0} ج.م هذا الشهر.\n2. خصص 20% من دخلك (${Math.round(totalIncome * 0.2)} ج.م) للادخار التلقائي في محفظة طوارئ.\n3. استخدم قاعدة الميزانية المقسمة (50% ضروريات - 30% رغبات - 20% ادخار).`;
        } else if (userText.includes('ديون') || userText.includes('أقساط')) {
          aiReply = `تنظيم الديون والأقساط:\n1. إجمالي الالتزامات عليك هو ${totalDebtPayable} ج.م.\n2. يُفضل استخدام طريقة "كرة الثلج": ابدأ بسداد أصغر دين أولاً للحصول على دافع نفسي.\n3. قم بجدولة الأقساط المستحقة قبل مواعيدها بـ 3 أيام لتجنب أي غرامات تأخير.`;
        } else {
          aiReply = `نصيحة تنظيمية شاملة لأموالك:\n- رصيدك الحالي (${totalBalance.toLocaleString()} ج.م) يتطلب توزيعاً متوازناً بين المحافظ.\n- احرص على ألا تتجاوز المصروفات الشهرية حاجز 70% من إجمالي الدخل.\n- يمكنك إضافة ميزانية محددة لكل فئة إنفاق لتنبيهك فور الوصول لـ 80% من الحد المسموح.`;
        }
      }

      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: aiReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'بناءً على بياناتك المالية: ننصحك بتركيز الإنفاق على الضروريات فقط، وتقسيم الدخل بنسبة 50% للالتزامات، 30% للمصاريف، و 20% للادخار.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-4xl h-[85vh] max-h-[700px] flex flex-col overflow-hidden dir-rtl">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-md shrink-0">
              <Sparkles className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span>مستشار التنظيم بالذكاء الاصطناعي</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full">
                  AI Advisor
                </span>
              </h2>
              <p className="text-xs text-purple-200">
                مُساعدك الشخصي لإعادة هيكلة وتنظيم الميزانيات، المحافظ، والديون
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Nav Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-4 py-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('advisor')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'advisor'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>الدردشة والاستشارة الذكية</span>
          </button>

          <button
            onClick={() => setActiveTab('autobudget')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'autobudget'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>خطة الميزانية التلقائية (50/30/20)</span>
          </button>

          <button
            onClick={() => setActiveTab('debts')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'debts'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>استراتيجية سداد المستحقات</span>
          </button>
        </div>

        {/* Tab 1: AI Chat Assistant */}
        {activeTab === 'advisor' && (
          <div className="flex-1 flex flex-col justify-between p-4 overflow-hidden bg-slate-50/50 dark:bg-slate-950/40">
            {/* Quick Action Chips */}
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                'كيف أنظم مصاريفي الشهرية؟',
                'كيف أوزع راتبي 50/30/20؟',
                'تحليل أعلى المصروفات هذا الشهر',
                'كيف أستعد لمصاريف الشهر القادم؟',
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputQuery(chip);
                  }}
                  className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-900/50 text-purple-700 dark:text-purple-300 text-[11px] font-bold hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors cursor-pointer shadow-2xs"
                >
                  💡 {chip}
                </button>
              ))}
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto space-y-3 pl-2 custom-scrollbar">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2.5 ${
                    msg.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-purple-600 text-white shadow-md'
                    }`}
                  >
                    {msg.sender === 'user' ? 'أنت' : <Sparkles className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-tl-none font-medium'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 rounded-tr-none shadow-xs whitespace-pre-line'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`text-[9px] block mt-1.5 opacity-70 ${
                        msg.sender === 'user' ? 'text-emerald-100' : 'text-slate-400'
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-bold p-3 bg-purple-50 dark:bg-purple-950/40 rounded-2xl w-fit animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>الذكاء الاصطناعي يفكر ويحلل بياناتك...</span>
                </div>
              )}
            </div>

            {/* Input Box */}
            <form onSubmit={handleSendMessage} className="mt-3 flex items-center gap-2">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="اسأل المستشار الذكي عن أي نصيحة لتنظيم أموالك..."
                className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isLoading}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer"
              >
                <span>إرسال</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Auto Budget Generator */}
        {activeTab === 'autobudget' && (
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/40">
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 text-slate-800 dark:text-slate-200 text-xs leading-relaxed">
              <h3 className="font-black text-sm text-purple-900 dark:text-purple-300 mb-1 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>الخطة الذكية لتوزيع الميزانيات (قاعدة 50/30/20)</span>
              </h3>
              <p>
                بناءً على دخل المسجل هذا الشهر (<span className="font-bold text-emerald-600">{totalIncome.toLocaleString()} ج.م</span>)، قام الذكاء الاصطناعي بحساب التوزيع الأمثل لدخلك:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">50% الاحتياجات والضروريات</div>
                <div className="text-lg font-black text-slate-900 dark:text-white">
                  {Math.round(totalIncome * 0.5).toLocaleString()} ج.م
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  إيجار، فواتير كهرباء ومياه، طعام أساسي، ومصاريف علاجية.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
                <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">30% المصاريف المتغيرة والترفيه</div>
                <div className="text-lg font-black text-slate-900 dark:text-white">
                  {Math.round(totalIncome * 0.3).toLocaleString()} ج.م
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  مطاعم، خروج، تسوق، واشتراكات ترفيهية.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">20% الادخار والاستثمار</div>
                <div className="text-lg font-black text-slate-900 dark:text-white">
                  {Math.round(totalIncome * 0.2).toLocaleString()} ج.م
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  صندوق الطوارئ، سداد القروض والمستحقات، والاستثمار.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">
                توصيات الذكاء الاصطناعي الفورية:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    تم رصد ارتفاع بإنفاق فئة ({sortedExpenseCategories[0]?.[0] || 'المصروفات العامة'})، يوصى بوضع حد أقصى له بقيمة {Math.round((sortedExpenseCategories[0]?.[1] || 1000) * 0.85)} ج.م.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    قم بتحويل مبلغ الادخار الشهري ({Math.round(totalIncome * 0.2)} ج.م) فور استلام الدخل مباشرة لتجنب إنفاقه.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: Debts Strategy */}
        {activeTab === 'debts' && (
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/40">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-slate-800 dark:text-slate-200 text-xs">
              <h3 className="font-black text-sm text-amber-900 dark:text-amber-300 mb-1 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>خطة الذكاء الاصطناعي للتخلص من الأقساط والديون</span>
              </h3>
              <p>
                إجمالي الديون والالتزامات المستحقة عليك: <span className="font-bold text-rose-600 dark:text-rose-400">{totalDebtPayable.toLocaleString()} ج.م</span>
              </p>
            </div>

            <div className="space-y-2">
              {debts.filter(d => d.direction === 'payable').map((debt) => {
                const remaining = debt.totalAmount - debt.paidAmount;
                return (
                  <div key={debt.id} className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">{debt.personName}</h4>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">تاريخ الاستحقاق: {debt.dueDate}</span>
                    </div>
                    <div className="text-left">
                      <span className="font-black text-rose-600 dark:text-rose-400 text-sm block">{remaining.toLocaleString()} ج.م</span>
                      <span className="text-[10px] bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300 font-bold px-2 py-0.5 rounded-full">أولوية سداد عالية</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
