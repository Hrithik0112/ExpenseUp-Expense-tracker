import { useState } from "react";
import { StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TextInput } from "react-native";
import { useExpenses } from "@/contexts/ExpenseContext";
import { router } from "expo-router";

export default function AddExpenseModal() {
  const { isDark } = useTheme();
  const { addExpense } = useExpenses();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
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
          placeholder="0.00"
          keyboardType="numeric"
          placeholderTextColor={isDark ? "#808080" : "#666666"}
        />

        <ThemedText style={styles.label}>Category</ThemedText>
        <TextInput
          style={[
            styles.input,
            {
              color: isDark ? Colors.dark.text : Colors.light.text,
              borderColor: isDark ? "#404040" : "#e0e0e0",
            },
          ]}
          value={category}
          onChangeText={setCategory}
          placeholder="e.g., Food, Transport"
          placeholderTextColor={isDark ? "#808080" : "#666666"}
        />

        <ThemedText style={styles.label}>Date and Time</ThemedText>
        <TouchableOpacity
          style={[
            styles.dateButton,
            { borderColor: isDark ? "#404040" : "#e0e0e0" },
          ]}
          onPress={() => setShowDatePicker(true)}
        >
          <ThemedText>{date.toLocaleString()}</ThemedText>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="datetime"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
          />
        )}
      </ScrollView>
    </ThemedView>
    </SafeAreaView>
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
});
