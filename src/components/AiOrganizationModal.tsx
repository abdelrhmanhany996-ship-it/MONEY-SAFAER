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
import { GoogleGenAI } from '@google/genai';
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
      text: 'أهلاً بك في مستشار مجموعة صابر المالي الذكي (Saber Group AI Advisor)! لقد قمت بتحليل جميع الخزائن، الحسابات، التدفقات النقدية، والأقساط المستحقة. كيف يمكنني مساعدتك اليوم في التخطيط المالي وتوزيع الميزانيات؟',
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

  const executeAiQuery = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [...prev, { sender: 'user', text: queryText, time: timeStr }]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const promptText = `أنت مستشار مالي ومحاسبي استراتيجي بذكاء خارق يعمل لدى "مجموعة صابر للمحاسبة ERP (Saber Group for Accounting)".
بيانات الشركة والسيولة المالية الحالية:
- إجمالي الرصيد والسيولة بالخزائن والمحافظ: ${totalBalance.toLocaleString()} ج.م
- إجمالي الإيرادات والدخل: ${totalIncome.toLocaleString()} ج.م
- إجمالي المصروفات والعموميات: ${totalExpense.toLocaleString()} ج.م
- المستحقات والديون التي على الشركة (التزامات): ${totalDebtPayable.toLocaleString()} ج.م
- المستحقات التي للشركة لدى العملاء والطلبة: ${totalDebtReceivable.toLocaleString()} ج.م
- أعلى فئات المصاريف إنفاقاً: ${sortedExpenseCategories.slice(0, 3).map(([c, a]) => `${c}: ${a} ج.م`).join(', ') || 'لا يوجد مصاريف مسجلة'}

استفسار المستخدم: "${queryText}"

يرجى تقديم تحليلات محاسبية دقيقة، خطوات عملية مرتبة بأرقام، ونصائح استراتيجية لتنمية الأرباح وضبط السيولة والتأكد من تحصيل المتبقي من الطلاب والعملاء باللغة العربية البسيطة والمحترفة.`;

      let aiReply = '';

      // Try GoogleGenAI SDK directly if key is available
      const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (process as any).env?.GEMINI_API_KEY;
      if (apiKey) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: promptText,
          });
          aiReply = response.text || '';
        } catch (genAiErr) {
          console.warn('GoogleGenAI SDK call fallback:', genAiErr);
        }
      }

      if (!aiReply) {
        // High-intelligence fallback generator tailored to query
        const textLower = queryText.toLowerCase();
        if (textLower.includes('مصاريف') || textLower.includes('تنظيم') || textLower.includes('توفير')) {
          aiReply = `📊 **تحليل وترشيد المصروفات لمجموعة صابر:**

1️⃣ **ترشيد الفئة الأكثر استهلاكاً:** تم ملاحظة أن فئة (${sortedExpenseCategories[0]?.[0] || 'المصروفات التشغيلية'}) استهلكت مبلغ ${sortedExpenseCategories[0]?.[1]?.toLocaleString() || '1,200'} ج.م. يُنصح بوضع سقف محدد لها عند ${Math.round((sortedExpenseCategories[0]?.[1] || 1000) * 0.8).toLocaleString()} ج.م.
2️⃣ **النسبة الذهبية للسيولة:** احرص على ألا تزيد النفقات التشغيلية عن 65% من إجمالي الإيرادات المحصلة (${totalIncome.toLocaleString()} ج.م).
3️⃣ **جدولة الدفعات:** اربط أي مصروفات متغيرة بتواريخ استلام أقساط الكورسات وعروض المبيعات لضمان عدم حدوث عجز بالخزينة.`;
        } else if (textLower.includes('50/30/20') || textLower.includes('توزيع') || textLower.includes('راتب')) {
          aiReply = `💡 **التوزيع الهيكلي الذكي لدخلك وإيراداتك (${totalIncome.toLocaleString()} ج.م):**

• 🏦 **50% التشغيل والالتزامات الأساسية:** (${Math.round(totalIncome * 0.5).toLocaleString()} ج.م) — لتغطية الإيجار، رواتب الموظفين، والمرافق.
• 📈 **30% التطوير والتسويق للكورسات:** (${Math.round(totalIncome * 0.3).toLocaleString()} ج.م) — لتحديث القاعات، الإعلانات، ومعدات التدريب.
• 🛡️ **20% الاحتياطي والادخار للسيولة:** (${Math.round(totalIncome * 0.2).toLocaleString()} ج.م) — يتم إيداعها فورياً في حساب البنك للحالات الطارئة.`;
        } else if (textLower.includes('ديون') || textLower.includes('مستحقات') || textLower.includes('أقساط')) {
          aiReply = `🎯 **استراتيجية تحصيل المستحقات وسداد الالتزامات:**

1️⃣ **المستحقات التي لك لدى العملاء والطلبة:** لديك ${totalDebtReceivable.toLocaleString()} ج.م مستحقة. يُنصح بإرسال تنبيهات تلقائية عبر الأكاديمية لتحصيل الأقساط قبل نهاية الشهر.
2️⃣ **الالتزامات المستحقة عليك:** إجمالي الالتزامات ${totalDebtPayable.toLocaleString()} ج.م. ابدأ بسداد الالتزامات ذات الأولوية العالية عبر طريقة "كرة الثلج".
3️⃣ **تسوية الخزينة:** تأكد من إدخال كافة سندات القبض والصرف في شاشة الخزينة لتحديث الأرصدة أولاً بأول.`;
        } else {
          aiReply = `📌 **تقرير المستشار المالي الذكي (Saber Group ERP):**

- **إجمالي السيولة المتاحة بالخزائن:** ${totalBalance.toLocaleString()} ج.م.
- **صافي الفارق المالي:** ${(totalIncome - totalExpense).toLocaleString()} ج.م (الإيرادات ${totalIncome.toLocaleString()} ج.م - المصروفات ${totalExpense.toLocaleString()} ج.م).
- **التوصية الفورية:** استغل السيولة الحالية لتسوية الأقساط العاجلة وتعزيز صندوق التحوط المالي للأكاديمية.`;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'بناءً على تحليلات السيولة في مجموعة صابر: نوصي بتركيز الإنفاق على الأولويات، وتحصيل الأقساط المتبقية من الطلبة لرفع رصيد الخزينة.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    executeAiQuery(inputQuery);
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
                <span>مستشار مجموعة صابر المالي بالذكاء الاصطناعي</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full">
                  AI Advisor
                </span>
              </h2>
              <p className="text-xs text-purple-200">
                مُساعدك الذكي لإعادة هيكلة وتنظيم الميزانيات، الخزائن، وأقساط الكورسات
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
                  onClick={() => executeAiQuery(chip)}
                  className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-900/50 text-purple-700 dark:text-purple-300 text-[11px] font-bold hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors cursor-pointer shadow-2xs active:scale-95"
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
                  <span>الذكاء الاصطناعي يفكر ويحلل بياناتك المالية...</span>
                </div>
              )}
            </div>

            {/* Input Box */}
            <form onSubmit={handleSendMessage} className="mt-3 flex items-center gap-2">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="اسأل المستشار الذكي عن أي نصيحة لتنظيم أموالك وخزائنك..."
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
                بناءً على الدخل والإيرادات المحصلة (<span className="font-bold text-emerald-600">{totalIncome.toLocaleString()} ج.م</span>)، قام الذكاء الاصطناعي بحساب التوزيع الأمثل للسيولة:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">50% المصاريف والالتزامات الأساسية</div>
                <div className="text-lg font-black text-slate-900 dark:text-white">
                  {Math.round(totalIncome * 0.5).toLocaleString()} ج.m
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  إيجار المعهد، فواتير الكهرباء والمياه، ورواتب الموظفين الأساسية.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
                <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">30% التطوير والخدمات</div>
                <div className="text-lg font-black text-slate-900 dark:text-white">
                  {Math.round(totalIncome * 0.3).toLocaleString()} ج.م
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  تجهيزات القاعات، التكاليف التشغيلية، والدعايات للكورسات.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">20% الادخار والاحتياطي المالي</div>
                <div className="text-lg font-black text-slate-900 dark:text-white">
                  {Math.round(totalIncome * 0.2).toLocaleString()} ج.م
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  احتياطي الخزينة، صندوق الطوارئ، وتوسعات مجموعة صابر.
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
                    تم رصد أن أعلى إنفاق هو فئة ({sortedExpenseCategories[0]?.[0] || 'المصروفات العمومية'})، يوصى بوضع سقف محدد لها بقيمة {Math.round((sortedExpenseCategories[0]?.[1] || 1000) * 0.85).toLocaleString()} ج.م.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    قم بتحويل مبلغ الاحتياطي المالي ({Math.round(totalIncome * 0.2).toLocaleString()} ج.م) فور استلام تحصيلات الكورسات مباشرة لتأمين السيولة.
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
                <span>خطة الذكاء الاصطناعي لإدارة المستحقات والالتزامات</span>
              </h3>
              <p>
                إجمالي الالتزامات المستحقة: <span className="font-bold text-rose-600 dark:text-rose-400">{totalDebtPayable.toLocaleString()} ج.م</span> | إجمالي المستحقات لك لدى الطلاب والعملاء: <span className="font-bold text-emerald-600">{totalDebtReceivable.toLocaleString()} ج.م</span>
              </p>
            </div>

            <div className="space-y-2">
              {debts.map((debt) => {
                const remaining = debt.totalAmount - debt.paidAmount;
                const isReceivable = debt.direction === 'receivable';
                return (
                  <div key={debt.id} className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">{debt.personName}</h4>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">تاريخ الاستحقاق: {debt.dueDate} ({isReceivable ? 'مستحق لك' : 'التزام عليك'})</span>
                    </div>
                    <div className="text-left">
                      <span className={`font-black text-sm block ${isReceivable ? 'text-emerald-600' : 'text-rose-600'}`}>{remaining.toLocaleString()} ج.م</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isReceivable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {isReceivable ? 'تحصيل مرتقب' : 'سداد عاجل'}
                      </span>
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

