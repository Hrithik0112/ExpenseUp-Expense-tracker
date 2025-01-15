import React, { createContext, useContext, useState, useCallback } from "react";
import { useColorScheme as useNativeColorScheme } from "react-native";

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps = {
  children: React.ReactNode | ((props: ThemeContextType) => React.ReactNode);
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const deviceTheme = useNativeColorScheme();
  const [isDark, setIsDark] = useState(deviceTheme === "dark");

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const value = { isDark, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      {typeof children === "function" ? children(value) : children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
