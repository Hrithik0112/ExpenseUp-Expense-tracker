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

export type Income = {
  id: string;
  amount: number;
  source: string;
  description: string;
  date: string; // ISO string
  createdAt: string; // ISO string
};

export const StorageKeys = {
  EXPENSES: "expenses",
  INCOMES: "incomes",
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

// Helper functions for income storage
export const IncomeStorage = {
  getAll: (): Income[] => {
    const incomes = storage.getString(StorageKeys.INCOMES);
    return incomes ? JSON.parse(incomes) : [];
  },

  add: (income: Omit<Income, "id" | "createdAt">) => {
    const newIncome = {
      ...income,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const incomes = IncomeStorage.getAll();
    storage.set(StorageKeys.INCOMES, JSON.stringify([newIncome, ...incomes]));
    return newIncome;
  },

  update: (id: string, updates: Partial<Omit<Income, "id" | "createdAt">>) => {
    const incomes = IncomeStorage.getAll();
    const updatedIncomes = incomes.map((income) =>
      income.id === id ? { ...income, ...updates } : income
    );
    storage.set(StorageKeys.INCOMES, JSON.stringify(updatedIncomes));
  },

  delete: (id: string) => {
    const incomes = IncomeStorage.getAll();
    const filteredIncomes = incomes.filter((income) => income.id !== id);
    storage.set(StorageKeys.INCOMES, JSON.stringify(filteredIncomes));
  },
};
