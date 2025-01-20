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
import { router } from "expo-router";
import { useIncomes } from "@/contexts/IncomeContext";

export default function AddIncomeModal() {
  const { isDark } = useTheme();
  const { addIncome } = useIncomes();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState("");

  const handleSubmit = () => {
    if (!amount || !description || !source) return;

    addIncome({
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
            { color: isDark ? Colors.dark.text : Colors.light.text },
          ]}
          value={source}
          onChangeText={setSource}
          placeholder="Income source"
          placeholderTextColor={isDark ? "#808080" : "#666666"}
        />

        <ThemedText style={styles.label}>Amount</ThemedText>
        <TextInput
          style={[
            styles.input,
            { color: isDark ? Colors.dark.text : Colors.light.text },
          ]}
          value={amount}
          onChangeText={setAmount}
          placeholder="₹0.00"
          keyboardType="numeric"
          placeholderTextColor={isDark ? "#808080" : "#666666"}
        />

        <ThemedText style={styles.label}>Description</ThemedText>
        <TextInput
          style={[
            styles.input,
            { color: isDark ? Colors.dark.text : Colors.light.text },
          ]}
          value={description}
          onChangeText={setDescription}
          placeholder="Add description"
          placeholderTextColor={isDark ? "#808080" : "#666666"}
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
            { opacity: !amount || !description || !source ? 0.5 : 1 },
          ]}
          onPress={handleSubmit}
          disabled={!amount || !description || !source}
        >
          <ThemedText style={styles.submitText}>Add Income</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  form: { padding: 20 },
  label: { marginBottom: 8 },
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
    backgroundColor: Colors.light.tint,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: {
    color: "#FFF",
    fontWeight: "600",
  },
});
