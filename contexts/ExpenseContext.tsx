import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Expense, ExpenseStorage } from "@/utils/storage";

type ExpenseContextType = {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, "id" | "createdAt">) => void;
  updateExpense: (
    id: string,
    updates: Partial<Omit<Expense, "id" | "createdAt">>
  ) => void;
  deleteExpense: (id: string) => void;
  isLoading: boolean;
};

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial expenses
  useEffect(() => {
    const loadExpenses = () => {
      const storedExpenses = ExpenseStorage.getAll();
      setExpenses(storedExpenses);
      setIsLoading(false);
    };
    loadExpenses();
  }, []);

  const addExpense = useCallback(
    (expense: Omit<Expense, "id" | "createdAt">) => {
      const newExpense = ExpenseStorage.add(expense);
      setExpenses((prev) => [newExpense, ...prev]);
    },
    []
  );

  const updateExpense = useCallback(
    (id: string, updates: Partial<Omit<Expense, "id" | "createdAt">>) => {
      ExpenseStorage.update(id, updates);
      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === id ? { ...expense, ...updates } : expense
        )
      );
    },
    []
  );

  const deleteExpense = useCallback((id: string) => {
    ExpenseStorage.delete(id);
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  }, []);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        isLoading,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return context;
}
