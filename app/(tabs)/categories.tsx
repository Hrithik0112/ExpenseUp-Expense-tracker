import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/Colors";
import { useState } from "react";
import { useExpenses } from "@/contexts/ExpenseContext";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";

const screenHeight = Dimensions.get("window").height;

export const CATEGORIES = [
  { id: "1", name: "Food & Dining", emoji: "🍔" },
  { id: "2", name: "Transportation", emoji: "🚗" },
  { id: "3", name: "Shopping", emoji: "🛍️" },
  { id: "4", name: "Utilities", emoji: "💡" },
  { id: "5", name: "Entertainment", emoji: "🎮" },
  { id: "6", name: "Healthcare", emoji: "🏥" },
  { id: "7", name: "Groceries", emoji: "🛒" },
  { id: "8", name: "Travel", emoji: "✈️" },
  { id: "9", name: "Education", emoji: "📚" },
  { id: "10", name: "Housing", emoji: "🏠" },
  { id: "11", name: "Personal Care", emoji: "💅" },
  { id: "12", name: "Gifts", emoji: "🎁" },
];

export default function CategoriesScreen() {
  const { isDark } = useTheme();
  const { expenses } = useExpenses();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const getCategoryExpenses = (categoryName: string) => {
    return expenses.filter((expense) => expense.category === categoryName);
  };

  const getTotalAmount = (categoryName: string) => {
    return getCategoryExpenses(categoryName)
      .reduce((sum, expense) => sum + expense.amount, 0)
      .toFixed(2);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>
        Categories
      </ThemedText>

      <ScrollView>
        <ThemedView style={styles.categoryGrid}>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard,
                { borderColor: isDark ? "#404040" : "#e0e0e0" },
              ]}
              onPress={() => setSelectedCategory(category.name)}
            >
              <ThemedText style={styles.emoji}>{category.emoji}</ThemedText>
              <ThemedText style={styles.categoryName}>
                {category.name}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ScrollView>

      <Modal
        visible={!!selectedCategory}
        transparent
        animationType="none"
        onRequestClose={() => setSelectedCategory(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedCategory(null)}
        >
          <Animated.View
            entering={SlideInDown}
            exiting={SlideOutDown}
            style={styles.modalContent}
          >
            {selectedCategory && (
              <ThemedView style={styles.modalInner}>
                <ThemedView style={styles.modalHeader}>
                  <ThemedText type="title" style={styles.modalTitle}>
                    {CATEGORIES.find((c) => c.name === selectedCategory)?.emoji}{" "}
                    {selectedCategory}
                  </ThemedText>
                  <ThemedText type="subtitle">
                    ${getTotalAmount(selectedCategory)}
                  </ThemedText>
                </ThemedView>

                <ScrollView style={styles.expensesList}>
                  {getCategoryExpenses(selectedCategory).map((expense) => (
                    <ThemedView key={expense.id} style={styles.expenseItem}>
                      <ThemedText>{expense.description}</ThemedText>
                      <ThemedText>${expense.amount.toFixed(2)}</ThemedText>
                    </ThemedView>
                  ))}
                </ScrollView>
              </ThemedView>
            )}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryCard: {
    width: "47%",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginBottom: 4,
    position: "relative", // For badge positioning
  },
  emoji: {
    fontSize: 20,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    height: screenHeight * 0.7,
    width: "100%",
    backgroundColor: "transparent",
  },
  modalInner: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  modalTitle: {
    fontSize: 24,
  },
  expensesList: {
    flex: 1,
  },
  expenseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
});
