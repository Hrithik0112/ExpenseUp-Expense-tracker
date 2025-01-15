import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";

export function AppHeader() {
  const { isDark, toggleTheme } = useTheme();
  const iconColor = isDark ? Colors.dark.text : Colors.light.text;

  return (
    <SafeAreaView edges={["top"]}>
      <ThemedView style={styles.header}>
        <View style={styles.leftContainer}>
          <Ionicons name="wallet" size={24} color={iconColor} />
          <ThemedText type="subtitle" style={styles.title}>
            ExpenseUp
          </ThemedText>
        </View>
        <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
          <ThemedText style={styles.themeText}>
            {isDark ? "Dark" : "Light"}
          </ThemedText>
          <Ionicons
            name={isDark ? "sunny" : "moon"}
            size={24}
            color={iconColor}
          />
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    marginLeft: 8,
  },
  themeToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  themeText: {
    fontSize: 14,
  },
});
