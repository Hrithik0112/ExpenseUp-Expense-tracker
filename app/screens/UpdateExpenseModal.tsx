import { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useExpenses } from "@/contexts/ExpenseContext";
import { router, useLocalSearchParams } from "expo-router";
import { CATEGORIES } from "../(tabs)/categories";

const { width: screenWidth } = Dimensions.get("window");

export default function UpdateExpenseModal() {
  const { isDark } = useTheme();
  const { updateExpense } = useExpenses();
  const params = useLocalSearchParams();

  const [date, setDate] = useState(new Date(params.date as string));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [description, setDescription] = useState(params.description as string);
  const [amount, setAmount] = useState(params.amount as string);
  const [category, setCategory] = useState(params.category as string);

  const handleUpdate = () => {
    if (!description || !amount || !category) {
      // Add validation logic here
      return;
    }

    updateExpense(params.id as string, {
      description,
      amount: parseFloat(amount),
      category,
      date: date.toISOString(),
    });

    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              name="close"
              size={24}
              color={isDark ? Colors.dark.text : Colors.light.text}
            />
          </TouchableOpacity>
          <ThemedText type="subtitle">Update Expense</ThemedText>
          <TouchableOpacity onPress={handleUpdate}>
            <ThemedText
              style={{ color: isDark ? Colors.dark.tint : Colors.light.tint }}
            >
              Save
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.form}>
          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Amount</ThemedText>
            <TextInput
              style={[
                styles.input,
                { color: isDark ? Colors.dark.text : Colors.light.text },
              ]}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="₹0.00"
              placeholderTextColor={isDark ? "#808080" : "#666666"}
            />
          </ThemedView>

          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Description</ThemedText>
            <TextInput
              style={[
                styles.input,
                { color: isDark ? Colors.dark.text : Colors.light.text },
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder="What did you spend on?"
              placeholderTextColor={isDark ? "#808080" : "#666666"}
            />
          </ThemedView>

          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Category</ThemedText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
            >
              <ThemedView style={styles.categoryList}>
                {CATEGORIES.map((cat: any) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryItem,
                      category === cat.name && styles.selectedCategory,
                      { borderColor: isDark ? "#404040" : "#e0e0e0" },
                    ]}
                    onPress={() => setCategory(cat.name)}
                  >
                    <ThemedText style={styles.categoryEmoji}>
                      {cat.emoji}
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.categoryText,
                        category === cat.name && styles.selectedCategoryText,
                      ]}
                    >
                      {cat.name}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ThemedView>
            </ScrollView>
          </ThemedView>

          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Date</ThemedText>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={[
                styles.dateButton,
                { borderColor: isDark ? "#404040" : "#e0e0e0" },
              ]}
            >
              <ThemedText>{date.toLocaleDateString()}</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          )}
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  form: {
    padding: 20,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    opacity: 0.7,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  categoryScroll: {
    marginBottom: 20,
  },
  categoryList: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 4,
  },
  categoryItem: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    minWidth: 100,
  },
  selectedCategory: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  categoryEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
  },
  selectedCategoryText: {
    color: "#FFF",
  },
});
