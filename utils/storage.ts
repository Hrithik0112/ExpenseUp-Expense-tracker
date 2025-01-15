import { MMKV } from "react-native-mmkv";

export const storage = new MMKV({
  id: "expense-app-storage",
});

export type Expense = {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string; // ISO string
  createdAt: string; // ISO string
};

export const StorageKeys = {
  EXPENSES: "expenses",
} as const;

// Helper functions for expense storage
export const ExpenseStorage = {
  // Get all expenses
  getAll: (): Expense[] => {
    const expenses = storage.getString(StorageKeys.EXPENSES);
    return expenses ? JSON.parse(expenses) : [];
  },

  // Add new expense
  add: (expense: Omit<Expense, "id" | "createdAt">) => {
    const expenses = ExpenseStorage.getAll();
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    storage.set(
      StorageKeys.EXPENSES,
      JSON.stringify([newExpense, ...expenses])
    );
    return newExpense;
  },

  // Update expense
  update: (id: string, updates: Partial<Omit<Expense, "id" | "createdAt">>) => {
    const expenses = ExpenseStorage.getAll();
    const updatedExpenses = expenses.map((expense) =>
      expense.id === id ? { ...expense, ...updates } : expense
    );
    storage.set(StorageKeys.EXPENSES, JSON.stringify(updatedExpenses));
  },

  // Delete expense
  delete: (id: string) => {
    const expenses = ExpenseStorage.getAll();
    const filteredExpenses = expenses.filter((expense) => expense.id !== id);
    storage.set(StorageKeys.EXPENSES, JSON.stringify(filteredExpenses));
  },
};
