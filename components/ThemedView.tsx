import { View, type ViewProps } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/Colors";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const { isDark } = useTheme();
  const backgroundColor = isDark
    ? darkColor || Colors.dark.background
    : lightColor || Colors.light.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
