import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Users2,
  Lock,
  Mail,
  CheckCircle2,
  ShieldCheck,
  KeyRound,
  Trash2,
  Building,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import { doc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { EmployeeAccount } from './AuthModal';

interface EmployeeManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: EmployeeAccount[];
  onAddEmployee: (newEmp: EmployeeAccount) => void;
  onRemoveEmployee: (id: string) => void;
  onToggleActiveEmployee: (id: string) => void;
  language?: string;
}

export default function EmployeeManagementModal({
  isOpen,
  onClose,
  employees,
  onAddEmployee,
  onRemoveEmployee,
  onToggleActiveEmployee,
  language = 'ar',
}: EmployeeManagementModalProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [empName, setEmpName] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empPassword, setEmpPassword] = useState('');
  const [empCode, setEmpCode] = useState(`EMP-${Math.floor(100 + Math.random() * 900)}`);
  const [empDepartment, setEmpDepartment] = useState('محاسب عمليات وقيد');

  const [toastMsg, setToastMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!empName.trim() || !empEmail.trim() || !empPassword.trim()) {
      setErrorMsg('يرجى ملء الاسم، البريد، وكلمة المرور للموظف.');
      return;
    }

    if (empPassword.length < 4) {
      setErrorMsg('كلمة المرور يجب ألا تقل عن 4 رموز.');
      return;
    }

    const newEmp: EmployeeAccount = {
      id: 'emp-' + Date.now(),
      name: empName.trim(),
      email: empEmail.trim().toLowerCase(),
      passwordHash: empPassword.trim(),
      code: empCode.trim(),
      role: 'employee',
      department: empDepartment,
      createdAt: new Date().toLocaleDateString('ar-EG'),
      createdBy: 'المدير العام',
      active: true,
    };

    try {
      // Sync with Firestore
      await setDoc(doc(db, 'employees', newEmp.id), newEmp, { merge: true });
    } catch (err) {
      console.warn('Firestore employee sync fallback:', err);
    }

    onAddEmployee(newEmp);
    setToastMsg(`تم إنشاء حساب الموظف (${newEmp.name}) بنجاح ✓`);
    
    // Reset form
    setEmpName('');
    setEmpEmail('');
    setEmpPassword('');
    setEmpCode(`EMP-${Math.floor(100 + Math.random() * 900)}`);
    setShowAddForm(false);

    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden dir-rtl">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-300 flex items-center justify-center text-slate-950 shadow-md shrink-0">
              <Users2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight flex items-center gap-2">
                <span>إدارة حسابات وصلاحيات الموظفين</span>
                <span className="text-[10px] bg-purple-400 text-slate-950 font-black px-2 py-0.5 rounded-full">
                  Admin Only
                </span>
              </h2>
              <p className="text-xs text-purple-200">
                إضافة واعتماد الموظفين المسموح لهم بتسجيل الدخول
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {toastMsg && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Manager Action Bar */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>قائمة الموظفين المعتمَدين ({employees.length})</span>
            </h3>

            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setErrorMsg('');
              }}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>{showAddForm ? 'إلغاء الإضافة' : 'إضافة حساب موظف جديد'}</span>
            </button>
          </div>

          {/* ADD EMPLOYEE FORM (OPENED BY MANAGER) */}
          {showAddForm && (
            <form
              onSubmit={handleCreateEmployee}
              className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/80 space-y-3 animate-in fade-in duration-150"
            >
              <div className="flex items-center gap-2 pb-2 border-b border-purple-200 dark:border-purple-800/60 text-purple-900 dark:text-purple-300 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>بيانات دخول الموظف الجديد (مدير النظام يتولى الإنشاء):</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    اسم الموظف الثلاثي
                  </label>
                  <input
                    type="text"
                    value={empName}
                    onChange={(e) => setEmpName(e.target.value)}
                    placeholder="أحمد علي السعيد"
                    required
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    كود الموظف
                  </label>
                  <input
                    type="text"
                    value={empCode}
                    onChange={(e) => setEmpCode(e.target.value)}
                    placeholder="EMP-102"
                    required
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 dir-ltr"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-purple-600" />
                    <span>بريد دخول الموظف (Sign-in Email)</span>
                  </label>
                  <input
                    type="email"
                    value={empEmail}
                    onChange={(e) => setEmpEmail(e.target.value)}
                    placeholder="ahmed@sabergroup.com"
                    required
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 dir-ltr"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <KeyRound className="w-3 h-3 text-purple-600" />
                    <span>كلمة المرور / الباسورد الخاص بالموظف</span>
                  </label>
                  <input
                    type="text"
                    value={empPassword}
                    onChange={(e) => setEmpPassword(e.target.value)}
                    placeholder="123456"
                    required
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 dir-ltr font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  القسم / المسمى الوظيفي
                </label>
                <select
                  value={empDepartment}
                  onChange={(e) => setEmpDepartment(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="محاسب مبيعات وعملاء">محاسب مبيعات وعملاء</option>
                  <option value="محاسب مشتريات وموردين">محاسب مشتريات وموردين</option>
                  <option value="مسئول الخزينة والبنوك">مسئول الخزينة والبنوك</option>
                  <option value="إداري الأكاديمية والكورسات">إداري الأكاديمية والكورسات</option>
                  <option value="موظف عمليات وتشغيل">موظف عمليات وتشغيل</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>اعتماد وحفظ حساب الموظف فوراً</span>
              </button>
            </form>
          )}

          {/* EMPLOYEES TABLE LIST */}
          <div className="space-y-2">
            {employees.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <Users2 className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                <p className="text-xs font-bold">لا يوجد موظفون مضافون حتى الآن.</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  قم بإضافة موظفك الأول من خلال الزر بالأعلى ليتمكن من تسجيل الدخول.
                </p>
              </div>
            ) : (
              employees.map((emp) => (
                <div
                  key={emp.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 flex items-center justify-center font-black text-xs shrink-0">
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-slate-900 dark:text-white text-xs">
                          {emp.name}
                        </h4>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono px-1.5 py-0.5 rounded">
                          {emp.code}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            emp.active
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {emp.active ? 'مفعل' : 'موقف'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        <span>البريد: <strong className="text-slate-700 dark:text-slate-200">{emp.email}</strong></span>
                        <span>الباسورد: <strong className="font-mono text-purple-600 dark:text-purple-400">{emp.passwordHash}</strong></span>
                        <span>القسم: {emp.department}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleActiveEmployee(emp.id)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border cursor-pointer transition-colors ${
                        emp.active
                          ? 'border-rose-200 text-rose-700 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300 hover:bg-rose-100'
                          : 'border-emerald-200 text-emerald-700 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 hover:bg-emerald-100'
                      }`}
                    >
                      {emp.active ? 'إيقاف الحساب' : 'تفعيل الحساب'}
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`هل أنت تأكد من حذف حساب الموظف ${emp.name}؟`)) {
                          onRemoveEmployee(emp.id);
                        }
                      }}
                      className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-700/60 hover:bg-rose-100 hover:text-rose-600 text-slate-400 cursor-pointer transition-colors"
                      title="حذف الحساب"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
