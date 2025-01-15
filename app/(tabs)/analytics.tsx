import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function AnalyticsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Analytics</ThemedText>
      <ThemedText>Your expense analytics will appear here</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
