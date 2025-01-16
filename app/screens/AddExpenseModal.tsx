import { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TextInput } from "react-native";
import { useExpenses } from "@/contexts/ExpenseContext";
import { router } from "expo-router";
import { CATEGORIES } from "../(tabs)/categories";

export default function AddExpenseModal() {
  const { isDark } = useTheme();
  const { addExpense } = useExpenses();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = () => {
    if (!description || !amount || !category) {
      // Add validation logic here
      return;
    }

    addExpense({
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
          <ThemedText type="subtitle">Add Expense</ThemedText>
          <TouchableOpacity onPress={handleSubmit}>
            <ThemedText
              style={{ color: isDark ? Colors.dark.tint : Colors.light.tint }}
            >
              Save
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ScrollView style={styles.form}>
          <ThemedText style={styles.label}>Description</ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                color: isDark ? Colors.dark.text : Colors.light.text,
                borderColor: isDark ? "#404040" : "#e0e0e0",
              },
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder="What did you spend on?"
            placeholderTextColor={isDark ? "#808080" : "#666666"}
          />

          <ThemedText style={styles.label}>Amount</ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                color: isDark ? Colors.dark.text : Colors.light.text,
                borderColor: isDark ? "#404040" : "#e0e0e0",
              },
            ]}
            value={amount}
            onChangeText={setAmount}
            placeholder="₹0.00"
            keyboardType="numeric"
            placeholderTextColor={isDark ? "#808080" : "#666666"}
          />

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

          <ThemedText style={styles.label}>Date and Time</ThemedText>
          <TouchableOpacity
            style={[
              styles.dateButton,
              { borderColor: isDark ? "#404040" : "#e0e0e0" },
            ]}
            onPress={() => {
              if (Platform.OS === "android") {
                setShowDatePicker(true);
              } else {
                setShowDatePicker(true);
              }
            }}
          >
            <ThemedText>{date.toLocaleString()}</ThemedText>
          </TouchableOpacity>

          {Platform.OS === "ios" ? (
            <DateTimePicker
              value={date}
              mode="datetime"
              display="inline"
              onChange={(event, selectedDate) => {
                if (selectedDate) setDate(selectedDate);
              }}
            />
          ) : (
            <>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      setDate(selectedDate);
                      setShowTimePicker(true);
                    }
                  }}
                />
              )}
              {showTimePicker && (
                <DateTimePicker
                  value={date}
                  mode="time"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowTimePicker(false);
                    if (selectedDate) setDate(selectedDate);
                  }}
                />
              )}
            </>
          )}
        </ScrollView>
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
  },
  label: {
    marginBottom: 8,
    opacity: 0.7,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
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
