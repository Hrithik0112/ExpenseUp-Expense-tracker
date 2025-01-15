import { StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/Colors";

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
          >
            <ThemedText style={styles.emoji}>{category.emoji}</ThemedText>
            <ThemedText style={styles.categoryName}>{category.name}</ThemedText>
          </TouchableOpacity>
          ))}
        </ThemedView>
      </ScrollView>
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
});
