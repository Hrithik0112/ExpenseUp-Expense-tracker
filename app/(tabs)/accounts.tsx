import { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  View,
  Modal,
  Dimensions,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { format } from "date-fns";
import { useIncomes } from "@/contexts/IncomeContext";
import { Income } from "@/utils/storage";
import { FinancialSummary } from "@/components/FinancialSummary";

const { width: screenWidth } = Dimensions.get("window");

export default function AccountsScreen() {
  const { isDark } = useTheme();
  const { incomes, isLoading } = useIncomes();
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);

  const renderIncomeItem = ({ item }: { item: Income }) => (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/screens/UpdateIncomeModal",
          params: item,
        });
      }}
    >
      <ThemedView style={styles.incomeItem}>
        <ThemedView style={styles.incomeHeader}>
          <ThemedView style={styles.sourceContainer}>
            <ThemedText style={styles.amount}>₹{item.amount}</ThemedText>
            <ThemedText style={styles.source}>{item.source}</ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView style={styles.incomeFooter}>
          <ThemedText style={styles.description}>{item.description}</ThemedText>
          <ThemedText style={styles.date}>
            {format(new Date(item.date), "MMM d, h:mm a")}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Accounts</ThemedText>
      </ThemedView>

      <FinancialSummary />

      {isLoading ? (
        <ThemedText>Loading...</ThemedText>
      ) : incomes.length === 0 ? (
        <ThemedView style={styles.emptyState}>
          <Ionicons
            name="wallet-outline"
            size={64}
            color={isDark ? Colors.dark.text : Colors.light.text}
          />
          <ThemedText type="subtitle">No income records yet</ThemedText>
          <ThemedText>Start adding your income!</ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={incomes}
          renderItem={renderIncomeItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity
        style={[
          styles.fab,
          { backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint },
        ]}
        onPress={() => {
          router.push({
            pathname: "/screens/AddIncomeModal",
          });
        }}
      >
        <Ionicons name="add" size={24} color="#FFF" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  list: {
    padding: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  incomeItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  incomeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  sourceContainer: {
    flexDirection: "column",
    gap: 4,
    backgroundColor: "transparent",
  },
  amount: {
    fontSize: 20,
    fontWeight: "600",
  },
  source: {
    fontSize: 16,
    opacity: 0.7,
  },
  incomeFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
  },
  date: {
    fontSize: 12,
    opacity: 0.5,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
