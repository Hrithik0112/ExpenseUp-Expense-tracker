import { StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useExpenses } from "@/contexts/ExpenseContext";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/Colors";
import { formatDistanceToNow } from "date-fns";
import { Expense } from "@/utils/storage";

export default function RecordsScreen() {
  const { expenses, isLoading } = useExpenses();
  const { isDark } = useTheme();

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <ThemedView style={styles.expenseItem}>
      <ThemedView style={styles.expenseHeader}>
        <ThemedText type="defaultSemiBold">{item.description}</ThemedText>
        <ThemedText type="defaultSemiBold">₹{item.amount}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.expenseFooter}>
        <ThemedText style={styles.category}>{item.category}</ThemedText>
        <ThemedText style={styles.date}>
          {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      {isLoading ? (
        <ThemedText>Loading...</ThemedText>
      ) : expenses.length === 0 ? (
        <ThemedView style={styles.emptyState}>
          <Ionicons
            name="receipt-outline"
            size={64}
            color={isDark ? Colors.dark.text : Colors.light.text}
          />
          <ThemedText type="subtitle">No expenses yet</ThemedText>
          <ThemedText>Start adding your expenses!</ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={expenses}
          renderItem={renderExpenseItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[
          styles.fab,
          { backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint },
        ]}
        onPress={() => {
          // TODO: Navigate to add expense screen
          console.log("Add expense");
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
  list: {
    padding: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  expenseItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  expenseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  expenseFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  category: {
    fontSize: 14,
    opacity: 0.7,
  },
  date: {
    fontSize: 14,
    opacity: 0.7,
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
