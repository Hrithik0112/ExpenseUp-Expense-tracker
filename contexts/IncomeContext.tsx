import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Income, IncomeStorage } from "@/utils/storage";

type IncomeContextType = {
  incomes: Income[];
  addIncome: (income: Omit<Income, "id" | "createdAt">) => void;
  updateIncome: (
    id: string,
    updates: Partial<Omit<Income, "id" | "createdAt">>
  ) => void;
  deleteIncome: (id: string) => void;
  isLoading: boolean;
};

const IncomeContext = createContext<IncomeContextType | undefined>(undefined);

export function IncomeProvider({ children }: { children: React.ReactNode }) {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadIncomes = () => {
      const storedIncomes = IncomeStorage.getAll();
      setIncomes(storedIncomes);
      setIsLoading(false);
    };
    loadIncomes();
  }, []);

  const addIncome = useCallback((income: Omit<Income, "id" | "createdAt">) => {
    const newIncome = IncomeStorage.add(income);
    setIncomes((prev) => [newIncome, ...prev]);
  }, []);

  const updateIncome = useCallback(
    (id: string, updates: Partial<Omit<Income, "id" | "createdAt">>) => {
      IncomeStorage.update(id, updates);
      setIncomes((prev) =>
        prev.map((income) =>
          income.id === id ? { ...income, ...updates } : income
        )
      );
    },
    []
  );

  const deleteIncome = useCallback((id: string) => {
    IncomeStorage.delete(id);
    setIncomes((prev) => prev.filter((income) => income.id !== id));
  }, []);

  return (
    <IncomeContext.Provider
      value={{
        incomes,
        addIncome,
        updateIncome,
        deleteIncome,
        isLoading,
      }}
    >
      {children}
    </IncomeContext.Provider>
  );
}

export const useIncomes = () => {
  const context = useContext(IncomeContext);
  if (!context) {
    throw new Error("useIncomes must be used within an IncomeProvider");
  }
  return context;
};
