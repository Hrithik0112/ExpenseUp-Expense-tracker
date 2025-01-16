import { StyleSheet, Dimensions } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  runOnJS,
} from "react-native-reanimated";
import { useEffect } from "react";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";


type Props = {
  onAnimationComplete: () => void;
};

export function SplashScreen({ onAnimationComplete }: Props) {
  const { isDark } = useTheme();
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.3);

  useEffect(() => {
    scale.value = withSpring(1, { duration: 1000 });
    opacity.value = withSpring(1, { duration: 1000 });
    translateY.value = withSequence(
      withSpring(-20, { duration: 1000 }),
      withSpring(0, { duration: 800 })
    );

    // Trigger the exit animation after 2.5 seconds
    const timeout = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 500 }, () => {
        runOnJS(onAnimationComplete)();
      });
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <ThemedView style={styles.container}>
      <Animated.View style={[styles.content, animatedStyle]}>
        <Ionicons
          name="wallet"
          size={80}
          color={isDark ? Colors.dark.tint : Colors.light.tint}
        />
        <ThemedText type="title" style={styles.title}>
          ExpenseUp
        </ThemedText>
        <ThemedText style={styles.slogan}>
          Manage your expenses and budget
        </ThemedText>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  content: {
    alignItems: "center",
    gap: 16,
  },
  title: {
    fontFamily: "Outfit-Bold",
    fontSize: 42,
    paddingTop: 16,
  },
  slogan: {
    fontFamily: "Poppins-Regular",
    fontSize: 18,
    opacity: 0.8,
  },
});
