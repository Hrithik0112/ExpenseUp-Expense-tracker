import { StyleSheet, TouchableOpacity, Animated } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { useExpenses } from "@/contexts/ExpenseContext";
import { useIncomes } from "@/contexts/IncomeContext";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useRef, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export function FinancialSummary() {
  const { expenses } = useExpenses();
  const { incomes } = useIncomes();
  const { isDark } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const balance = totalIncome - totalExpenses;
  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  useEffect(() => {
    Animated.spring(animatedHeight, {
      toValue: isExpanded ? 1 : 0,
      useNativeDriver: false,
      tension: 20,
      friction: 7,
    }).start();
  }, [isExpanded]);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => setIsExpanded(!isExpanded)}
    >
      <LinearGradient
        colors={isDark ? ["#1a1a1a", "#2d2d2d"] : ["#ffffff", "#f8f9fa"]}
        style={[
          styles.container,
          { borderColor: isDark ? "#404040" : "#e0e0e0" },
        ]}
      >
        <ThemedView style={styles.mainRow}>
          <ThemedView style={styles.balanceSection}>
            <ThemedText style={styles.balanceLabel}>Current Balance</ThemedText>
            <ThemedText
              style={[
                styles.balanceAmount,
                { color: balance >= 0 ? Colors.light.tint : "#dc3545" },
              ]}
            >
              ₹{balance.toFixed(2)}
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.indicator}>
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={24}
              color={isDark ? Colors.dark.text : Colors.light.text}
            />
          </ThemedView>
        </ThemedView>

        <Animated.View
          style={[
            styles.detailsContainer,
            {
              maxHeight: animatedHeight.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 200],
              }),
              opacity: animatedHeight,
            },
          ]}
        >
          <ThemedView style={styles.row}>
            <LinearGradient
              colors={isDark ? ["#1e4620", "#2d6a31"] : ["#e3f5e1", "#c8e6c9"]}
              style={styles.summaryItem}
            >
              <ThemedText style={styles.label}>Income</ThemedText>
              <ThemedText style={[styles.amount, styles.incomeText]}>
                ₹{totalIncome.toFixed(2)}
              </ThemedText>
              <ThemedView style={styles.iconContainer}>
                <Ionicons
                  name="arrow-up-outline"
                  size={20}
                  color={isDark ? "#4caf50" : Colors.light.tint}
                />
              </ThemedView>
            </LinearGradient>
            <LinearGradient
              colors={isDark ? ["#621e1e", "#842929"] : ["#ffe3e3", "#ffcdd2"]}
              style={styles.summaryItem}
            >
              <ThemedText style={styles.label}>Expenses</ThemedText>
              <ThemedText style={[styles.amount, styles.expenseText]}>
                ₹{totalExpenses.toFixed(2)}
              </ThemedText>
              <ThemedView style={styles.iconContainer}>
                <Ionicons name="arrow-down-outline" size={20} color="#dc3545" />
              </ThemedView>
            </LinearGradient>
          </ThemedView>

          <LinearGradient
            colors={isDark ? ["#1e3a62", "#2d5492"] : ["#e3f2fd", "#bbdefb"]}
            style={styles.savingsContainer}
          >
            <ThemedText style={styles.label}>Savings Rate</ThemedText>
            <ThemedView style={styles.savingsRow}>
              <ThemedText
                style={[
                  styles.savingsRate,
                  { color: savingsRate >= 0 ? Colors.light.tint : "#dc3545" },
                ]}
              >
                {savingsRate.toFixed(1)}%
              </ThemedText>
              <ThemedView
                style={[
                  styles.savingsBar,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)",
                  },
                ]}
              >
                <Animated.View
                  style={[
                    styles.savingsProgress,
                    {
                      width: `${Math.max(0, Math.min(savingsRate, 100))}%`,
                      backgroundColor:
                        savingsRate >= 0 ? Colors.light.tint : "#dc3545",
                    },
                  ]}
                />
              </ThemedView>
            </ThemedView>
          </LinearGradient>
        </Animated.View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
  },
  mainRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  balanceSection: {
    flex: 1,
    backgroundColor: "transparent",
  },
  balanceLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: "600",
  },
  indicator: {
    padding: 4,
    backgroundColor: "transparent",
  },
  detailsContainer: {
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  summaryItem: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    position: "relative",
  },
  iconContainer: {
    position: "absolute",
    top: 12,
    right: 12,
    opacity: 0.7,
    backgroundColor: "transparent",
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  amount: {
    fontSize: 20,
    fontWeight: "600",
  },
  incomeText: {
    color: "#4caf50",
  },
  expenseText: {
    color: "#dc3545",
  },
  savingsContainer: {
    padding: 16,
    borderRadius: 12,
  },
  savingsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "transparent",
  },
  savingsRate: {
    fontSize: 20,
    fontWeight: "600",
    width: 80,
  },
  savingsBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  savingsProgress: {
    height: "100%",
    borderRadius: 4,
  },
});
