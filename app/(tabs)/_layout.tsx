import { Tabs } from "expo-router";
import React from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AppHeader } from "@/components/AppHeader";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <AppHeader />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Records",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "receipt" : "receipt-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: "Analytics",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "pie-chart" : "pie-chart-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="categories"
          options={{
            title: "Categories",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "grid" : "grid-outline"}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
