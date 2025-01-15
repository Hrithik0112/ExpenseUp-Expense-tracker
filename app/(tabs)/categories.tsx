import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function CategoriesScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Categories</ThemedText>
      <ThemedText>Your expense categories will appear here</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
