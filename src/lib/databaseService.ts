import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  Course,
  ClientOrStudent,
  Task,
  Invoice,
  Wallet,
  Transaction,
  Installment,
} from '../types';
import {
  INITIAL_COURSES,
  INITIAL_CLIENTS,
  INITIAL_TASKS,
  INITIAL_INVOICES,
  INITIAL_WALLETS,
  INITIAL_TRANSACTIONS,
  INITIAL_INSTALLMENTS,
} from '../data/initialData';

// Collection references
const coursesCol = collection(db, 'courses');
const clientsCol = collection(db, 'clients');
const tasksCol = collection(db, 'tasks');
const invoicesCol = collection(db, 'invoices');
const walletsCol = collection(db, 'wallets');
const transactionsCol = collection(db, 'transactions');
const installmentsCol = collection(db, 'installments');

/**
 * Seeds initial academy data to Firestore if collections are empty.
 */
export async function seedInitialDataIfEmpty(): Promise<void> {
  try {
    const courseSnap = await getDocs(coursesCol);
    if (courseSnap.empty) {
      console.log('Seeding initial Firestore academy data...');
      const batch = writeBatch(db);

      // Seed Courses
      INITIAL_COURSES.forEach((course) => {
        const ref = doc(db, 'courses', course.id);
        batch.set(ref, course);
      });

      // Seed Clients
      INITIAL_CLIENTS.forEach((client) => {
        const ref = doc(db, 'clients', client.id);
        batch.set(ref, client);
      });

      // Seed Tasks
      INITIAL_TASKS.forEach((task) => {
        const ref = doc(db, 'tasks', task.id);
        batch.set(ref, task);
      });

      // Seed Invoices
      INITIAL_INVOICES.forEach((invoice) => {
        const ref = doc(db, 'invoices', invoice.id);
        batch.set(ref, invoice);
      });

      // Seed Wallets
      INITIAL_WALLETS.forEach((wallet) => {
        const ref = doc(db, 'wallets', wallet.id);
        batch.set(ref, wallet);
      });

      // Seed Transactions
      INITIAL_TRANSACTIONS.forEach((tx) => {
        const ref = doc(db, 'transactions', tx.id);
        batch.set(ref, tx);
      });

      // Seed Installments
      INITIAL_INSTALLMENTS.forEach((inst) => {
        const ref = doc(db, 'installments', inst.id);
        batch.set(ref, inst);
      });

      await batch.commit();
      console.log('Initial Firestore data seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding initial Firestore data:', error);
  }
}

// Real-time Subscriptions
export function subscribeToInstallments(callback: (installments: Installment[]) => void) {
  return onSnapshot(installmentsCol, (snap) => {
    const data: Installment[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Installment, 'id'>),
    }));
    callback(data);
  });
}
export function subscribeToCourses(callback: (courses: Course[]) => void) {
  return onSnapshot(coursesCol, (snap) => {
    const data: Course[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Course, 'id'>),
    }));
    callback(data);
  });
}

export function subscribeToClients(callback: (clients: ClientOrStudent[]) => void) {
  return onSnapshot(clientsCol, (snap) => {
    const data: ClientOrStudent[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<ClientOrStudent, 'id'>),
    }));
    callback(data);
  });
}

export function subscribeToTasks(callback: (tasks: Task[]) => void) {
  return onSnapshot(tasksCol, (snap) => {
    const data: Task[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Task, 'id'>),
    }));
    callback(data);
  });
}

export function subscribeToInvoices(callback: (invoices: Invoice[]) => void) {
  return onSnapshot(invoicesCol, (snap) => {
    const data: Invoice[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Invoice, 'id'>),
    }));
    callback(data);
  });
}

export function subscribeToWallets(callback: (wallets: Wallet[]) => void) {
  return onSnapshot(walletsCol, (snap) => {
    const data: Wallet[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Wallet, 'id'>),
    }));
    callback(data);
  });
}

export function subscribeToTransactions(callback: (txs: Transaction[]) => void) {
  return onSnapshot(transactionsCol, (snap) => {
    const data: Transaction[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Transaction, 'id'>),
    }));
    callback(data);
  });
}

// CRUD Operations
export async function saveCourse(course: Course): Promise<void> {
  const ref = doc(db, 'courses', course.id);
  await setDoc(ref, course, { merge: true });
}

export async function saveClient(client: ClientOrStudent): Promise<void> {
  const ref = doc(db, 'clients', client.id);
  await setDoc(ref, client, { merge: true });
}

export async function saveTask(task: Task): Promise<void> {
  const ref = doc(db, 'tasks', task.id);
  await setDoc(ref, task, { merge: true });
}

export async function updateTaskStatus(taskId: string, column: Task['column']): Promise<void> {
  const ref = doc(db, 'tasks', taskId);
  await updateDoc(ref, { column });
}

export async function saveInvoice(invoice: Invoice): Promise<void> {
  const ref = doc(db, 'invoices', invoice.id);
  await setDoc(ref, invoice, { merge: true });
}

export async function updateInvoiceStatus(invoiceId: string, status: Invoice['status']): Promise<void> {
  const ref = doc(db, 'invoices', invoiceId);
  await updateDoc(ref, { status });
}

export async function saveTransaction(tx: Transaction): Promise<void> {
  const ref = doc(db, 'transactions', tx.id);
  await setDoc(ref, tx, { merge: true });
}

export async function updateWalletBalance(walletId: string, newBalance: number): Promise<void> {
  const ref = doc(db, 'wallets', walletId);
  await updateDoc(ref, { balance: newBalance });
}

/**
 * Dynamically update the currency field for all wallets in Firestore
 */
export async function updateAllWalletsCurrency(newCurrency: string, wallets: Wallet[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    wallets.forEach((w) => {
      const ref = doc(db, 'wallets', w.id);
      batch.update(ref, { currency: newCurrency });
    });
    await batch.commit();
  } catch (error) {
    console.error('Error batch updating wallet currencies:', error);
  }
}

export async function deleteTask(taskId: string): Promise<void> {
  await deleteDoc(doc(db, 'tasks', taskId));
}

export async function saveInstallment(inst: Installment): Promise<void> {
  const ref = doc(db, 'installments', inst.id);
  await setDoc(ref, inst, { merge: true });
}

export async function updateInstallmentStatus(
  instId: string,
  status: Installment['status'],
  paidAmount: number,
  remainingAmount: number
): Promise<void> {
  const ref = doc(db, 'installments', instId);
  await updateDoc(ref, {
    status,
    paidAmount,
    remainingAmount,
    lastPaymentDate: new Date().toISOString().split('T')[0],
  });
}

