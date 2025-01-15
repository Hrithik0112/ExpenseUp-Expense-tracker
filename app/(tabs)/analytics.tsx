import { useState } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { LineChart, PieChart } from "react-native-chart-kit";
import { useExpenses } from "@/contexts/ExpenseContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { CATEGORIES } from "./categories";

const screenWidth = Dimensions.get("window").width;

// Define an array of colors for categories
const CHART_COLORS = [
  "#FF6384", // red
  "#36A2EB", // blue
  "#FFCE56", // yellow
  "#4BC0C0", // teal
  "#9966FF", // purple
  "#FF9F40", // orange
  "#2ECC71", // green
  "#E74C3C", // dark red
  "#3498DB", // light blue
  "#F1C40F", // gold
];

// Add this emoji mapping constant
const CATEGORY_EMOJIS: { [key: string]: string } = Object.fromEntries(
  CATEGORIES.map((category) => [category.name, category.emoji])
);

export default function AnalyticsScreen() {
  const { expenses } = useExpenses();
  const { isDark } = useTheme();
  const [selectedChart, setSelectedChart] = useState("category"); // 'category', 'monthly', 'trend'
  const [showDropdown, setShowDropdown] = useState(false);

  // Category-wise data for pie chart
  const categoryData = expenses.reduce((acc: any, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {});

  const pieChartData = Object.keys(categoryData).map((category, index) => ({
    name: category,
    amount: categoryData[category],
    color: CHART_COLORS[index % CHART_COLORS.length], // cycle through colors
    legendFontColor: isDark ? "#fff" : "#000",
  }));

  // Monthly data for line chart
  const monthlyData = expenses.reduce((acc: any, expense) => {
    const month = new Date(expense.date).getMonth();
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += expense.amount;
    return acc;
  }, {});

  const chartConfig = {
    backgroundGradientFrom: isDark ? "#000" : "#fff",
    backgroundGradientTo: isDark ? "#000" : "#fff",
    color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`, // bright blue
    strokeWidth: 2,
    barPercentage: 0.5,
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#36A2EB",
    },
    propsForBackgroundLines: {
      strokeDasharray: "", // solid grid lines
      stroke: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
    },
    fillShadowGradient: "#36A2EB", // gradient fill color
    fillShadowGradientOpacity: 0.3,
  };

  const lineChartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        data: Array.from({ length: 12 }, (_, i) => monthlyData[i] || 0),
        color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const renderCategoryBreakdown = () => {
    const totalExpenses = Object.values(categoryData).reduce(
      (sum: number, amount: any): number => sum + Number(amount),
      0
    );

    return (
      <View style={styles.categoryBreakdown}>
        {Object.entries(categoryData).map(([category, amount]) => (
          <View key={category} style={styles.categoryItem}>
            <View style={styles.categoryHeader}>
              <ThemedText style={styles.categoryText}>
                {CATEGORY_EMOJIS[category] || "📍"} {category}
              </ThemedText>
              <ThemedText>{(amount as number).toFixed(2)}</ThemedText>
            </View>
            <View style={styles.loadingBarBg}>
              <View
                style={[
                  styles.loadingBarFill,
                  {
                    width: `${(Number(amount) / totalExpenses) * 100}%`,
                    backgroundColor:
                      CHART_COLORS[
                        Object.keys(categoryData).indexOf(category) %
                          CHART_COLORS.length
                      ],
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderMonthlyBreakdown = () => {
    const totalMonthly = Object.values(monthlyData).reduce(
      (sum: number, amount: any): number => sum + Number(amount),
      0
    );

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return (
      <View style={styles.categoryBreakdown}>
        {months.map((month, index) => {
          const amount = monthlyData[index] || 0;
          return (
            <View key={month} style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <ThemedText style={styles.categoryText}>📅 {month}</ThemedText>
                <ThemedText>{amount.toFixed(2)}</ThemedText>
              </View>
              <View style={styles.loadingBarBg}>
                <View
                  style={[
                    styles.loadingBarFill,
                    {
                      width: `${(amount / totalMonthly) * 100}%`,
                      backgroundColor:
                        CHART_COLORS[index % CHART_COLORS.length],
                    },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderSelectedChart = () => {
    switch (selectedChart) {
      case "category":
        return (
          <>
            <PieChart
              data={pieChartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
            />
            {renderCategoryBreakdown()}
          </>
        );
      case "monthly":
        return (
          <>
            <LineChart
              data={lineChartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
            />
            {renderMonthlyBreakdown()}
          </>
        );
      case "trend":
        return (
          <>
            <LineChart
              data={lineChartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              withDots={false}
              withShadow
            />
            {renderMonthlyBreakdown()}
          </>
        );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <ThemedText type="title">
            {selectedChart === "category"
              ? "Category Breakdown"
              : selectedChart === "monthly"
              ? "Monthly Expenses"
              : "Expense Trend"}
          </ThemedText>
          <Ionicons
            name={showDropdown ? "chevron-up" : "chevron-down"}
            size={24}
            color={isDark ? Colors.dark.text : Colors.light.text}
          />
        </TouchableOpacity>

        {showDropdown && (
          <ThemedView style={styles.dropdownMenu}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedChart("category");
                setShowDropdown(false);
              }}
            >
              <ThemedText>Category Breakdown</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedChart("monthly");
                setShowDropdown(false);
              }}
            >
              <ThemedText>Monthly Expenses</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedChart("trend");
                setShowDropdown(false);
              }}
            >
              <ThemedText>Expense Trend</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}
      </ThemedView>

      <ThemedView style={styles.section}>{renderSelectedChart()}</ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
    zIndex: 1,
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  dropdownMenu: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  section: {
    marginBottom: 30,
    alignItems: "center",
  },
  categoryBreakdown: {
    width: "100%",
    marginTop: 25,
    gap: 20,
  },
  categoryItem: {
    width: "100%",
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 16,
  },
  loadingBarBg: {
    width: "100%",
    height: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    overflow: "hidden",
  },
  loadingBarFill: {
    height: "100%",
    borderRadius: 10,
    opacity: 0.85,
  },
});
