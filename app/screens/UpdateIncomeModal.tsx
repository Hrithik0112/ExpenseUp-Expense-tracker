import { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useIncomes } from "@/contexts/IncomeContext";
import { Income } from "@/utils/storage";

export default function UpdateIncomeModal() {
  const { isDark } = useTheme();
  const { updateIncome } = useIncomes();
  const income = useLocalSearchParams() as unknown as Income;

  const [amount, setAmount] = useState(income?.amount.toString() || "");
  const [description, setDescription] = useState(income?.description || "");
  const [source, setSource] = useState(income?.source || "");

  const handleSubmit = () => {
    if (!amount || !description || !source) return;

    updateIncome(income.id, {
      amount: parseFloat(amount),
      description,
      source,
      date: new Date().toISOString(),
    });

    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.form}>
        <ThemedText style={styles.label}>Source</ThemedText>
        <TextInput
          style={[
            styles.input,
            {
              color: isDark ? Colors.dark.text : Colors.light.text,
              backgroundColor: isDark ? "#1c1c1c" : "#ffffff",
            },
          ]}
          value={source}
          onChangeText={setSource}
          placeholder="Enter income source"
          placeholderTextColor={isDark ? "#666" : "#999"}
        />

        <ThemedText style={styles.label}>Amount</ThemedText>
        <TextInput
          style={[
            styles.input,
            {
              color: isDark ? Colors.dark.text : Colors.light.text,
              backgroundColor: isDark ? "#1c1c1c" : "#ffffff",
            },
          ]}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="Enter amount"
          placeholderTextColor={isDark ? "#666" : "#999"}
        />

        <ThemedText style={styles.label}>Description</ThemedText>
        <TextInput
          style={[
            styles.input,
            {
              color: isDark ? Colors.dark.text : Colors.light.text,
              backgroundColor: isDark ? "#1c1c1c" : "#ffffff",
            },
          ]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
          placeholderTextColor={isDark ? "#666" : "#999"}
        />
      </ScrollView>

      <ThemedView style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="close"
            size={24}
            color={isDark ? Colors.dark.text : Colors.light.text}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint },
          ]}
          onPress={handleSubmit}
        >
          <ThemedText style={styles.submitText}>Update Income</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
  },
  cancelButton: {
    padding: 12,
  },
  submitButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: {
    color: "#FFF",
    fontWeight: "600",
  },
});
