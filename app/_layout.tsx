import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { SplashScreen } from "@/components/SplashScreen";

export default function RootLayout() {
  const [loaded] = useFonts({
    "Outfit-Bold": require("../assets/fonts/Outfit-Bold.ttf"),
    "Outfit-SemiBold": require("../assets/fonts/Outfit-SemiBold.ttf"),
    "Outfit-Medium": require("../assets/fonts/Outfit-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  const [showSplash, setShowSplash] = useState(true);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        {({ isDark }) => (
          <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
            {showSplash && (
              <SplashScreen onAnimationComplete={() => setShowSplash(false)} />
            )}
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </NavigationThemeProvider>
        )}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
