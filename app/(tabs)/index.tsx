import { useState } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
  Modal,
  Dimensions,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useExpenses } from "@/contexts/ExpenseContext";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/Colors";
import { formatDistanceToNow, format } from "date-fns";
import { Expense } from "@/utils/storage";
import { router } from "expo-router";

const { width: screenWidth } = Dimensions.get("window");

export default function RecordsScreen() {
  const { expenses, isLoading, deleteExpense } = useExpenses();
  const { isDark } = useTheme();
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

  // Group expenses by date
  const groupedExpenses = expenses.reduce(
    (groups: { [key: string]: Expense[] }, expense) => {
      const date = format(new Date(expense.date), "yyyy-MM-dd");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(expense);
      return groups;
    },
    {}
  );

  // Calculate total for each day
  const getDayTotal = (expenses: Expense[]) => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <TouchableOpacity onPress={() => setSelectedExpense(item)}>
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
    </TouchableOpacity>
  );

  const renderDayGroup = ({
    item,
  }: {
    item: { date: string; expenses: Expense[] };
  }) => (
    <ThemedView style={styles.dayGroup}>
      <ThemedView style={styles.dayHeader}>
        <ThemedText type="subtitle">
          {format(new Date(item.date), "MMMM d, yyyy")}
        </ThemedText>
        <ThemedText type="defaultSemiBold">
          ₹{getDayTotal(item.expenses)}
        </ThemedText>
      </ThemedView>
      {item.expenses.map((expense) => (
        <View key={expense.id}>{renderExpenseItem({ item: expense })}</View>
      ))}
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
          data={Object.entries(groupedExpenses).map(([date, expenses]) => ({
            date,
            expenses,
          }))}
          renderItem={renderDayGroup}
          keyExtractor={(item) => item.date}
          contentContainerStyle={styles.list}
        />
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={selectedExpense !== null}
        onRequestClose={() => setSelectedExpense(null)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setSelectedExpense(null)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {selectedExpense && (
              <ThemedView
                style={[
                  styles.modal,
                  {
                    backgroundColor: isDark
                      ? Colors.dark.background
                      : Colors.light.background,
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedExpense(null)}
                >
                  <Ionicons
                    name="close"
                    size={24}
                    color={isDark ? Colors.dark.text : Colors.light.text}
                  />
                </TouchableOpacity>

                <ThemedView style={styles.modalContent}>
                  <ThemedView style={styles.row}>
                    <ThemedText type="defaultSemiBold" style={styles.amount}>
                      ₹{selectedExpense.amount}
                    </ThemedText>
                  </ThemedView>

                  <ThemedView style={styles.row}>
                    <ThemedText style={styles.label}>Description</ThemedText>
                    <ThemedText>{selectedExpense.description}</ThemedText>
                  </ThemedView>

                  <ThemedView style={styles.row}>
                    <ThemedText style={styles.label}>Category</ThemedText>
                    <ThemedText>{selectedExpense.category}</ThemedText>
                  </ThemedView>

                  <ThemedView style={styles.row}>
                    <ThemedText style={styles.label}>Date</ThemedText>
                    <ThemedText>
                      {format(new Date(selectedExpense.date), "PPpp")}
                    </ThemedText>
                  </ThemedView>

                  <ThemedView style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.editButton]}
                      onPress={() => {
                        setSelectedExpense(null);
                        router.push({
                          pathname: "/screens/UpdateExpenseModal",
                          params: {
                            id: selectedExpense.id,
                            amount: selectedExpense.amount.toString(),
                            description: selectedExpense.description,
                            category: selectedExpense.category,
                            date: selectedExpense.date,
                          },
                        });
                      }}
                    >
                      <Ionicons name="pencil" size={20} color="#FFF" />
                      <ThemedText style={styles.buttonText}>Edit</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => {
                        if (selectedExpense) {
                          setExpenseToDelete(selectedExpense.id);
                          setSelectedExpense(null);
                          setShowDeleteConfirm(true);
                        }
                      }}
                    >
                      <Ionicons name="trash" size={20} color="#FFF" />
                      <ThemedText style={styles.buttonText}>Delete</ThemedText>
                    </TouchableOpacity>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showDeleteConfirm}
        onRequestClose={() => setShowDeleteConfirm(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => {
            setShowDeleteConfirm(false);
            setExpenseToDelete(null);
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <ThemedView
              style={[
                styles.confirmModal,
                {
                  backgroundColor: isDark
                    ? Colors.dark.background
                    : Colors.light.background,
                },
              ]}
            >
              <Ionicons
                name="warning"
                size={32}
                color={isDark ? Colors.dark.text : Colors.light.text}
                style={styles.warningIcon}
              />
              <ThemedText type="subtitle" style={styles.confirmTitle}>
                Delete Expense
              </ThemedText>
              <ThemedText style={styles.confirmMessage}>
                Are you sure you want to delete this expense? This action cannot
                be undone.
              </ThemedText>

              <ThemedView style={styles.confirmButtons}>
                <TouchableOpacity
                  style={[styles.confirmButton, styles.cancelButton]}
                  onPress={() => {
                    setShowDeleteConfirm(false);
                    setExpenseToDelete(null);
                  }}
                >
                  <ThemedText style={styles.cancelButtonText}>
                    Cancel
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.confirmButton, styles.deleteConfirmButton]}
                  onPress={() => {
                    if (expenseToDelete) {
                      deleteExpense(expenseToDelete);
                      setShowDeleteConfirm(false);
                      setExpenseToDelete(null);
                      setSelectedExpense(null);
                    }
                  }}
                >
                  <ThemedText style={styles.deleteButtonText}>
                    Delete
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[
          styles.fab,
          { backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint },
        ]}
        onPress={() => {
          router.push({
            pathname: "/screens/AddExpenseModal",
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
  dayGroup: {
    marginBottom: 24,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "transparent",
  },
  overlay: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: screenWidth * 0.85,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContent: {
    gap: 20,
  },
  row: {
    gap: 8,
  },
  label: {
    opacity: 0.7,
  },
  amount: {
    fontSize: 24,
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    zIndex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  editButton: {
    backgroundColor: Colors.light.tint, // or your theme color
  },
  deleteButton: {
    backgroundColor: "#dc3545", // red color for delete
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
  },
  confirmModal: {
    width: screenWidth * 0.85,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  warningIcon: {
    marginBottom: 16,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  confirmMessage: {
    textAlign: "center",
    marginBottom: 24,
    opacity: 0.7,
  },
  confirmButtons: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#e0e0e0",
  },
  deleteConfirmButton: {
    backgroundColor: "#dc3545",
  },
  cancelButtonText: {
    fontWeight: "600",
  },
  deleteButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
});
