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
import { useIncomes } from "@/contexts/IncomeContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { CATEGORIES } from "./categories";

const screenWidth = Dimensions.get("window").width;

// Define an array of colors for categories
const CHART_COLORS = [
  "rgba(255, 99, 132, 0.7)", // pastel red
  "rgba(54, 162, 235, 0.7)", // pastel blue
  "rgba(255, 206, 86, 0.7)", // pastel yellow
  "rgba(75, 192, 192, 0.7)", // pastel teal
  "rgba(153, 102, 255, 0.7)", // pastel purple
  "rgba(255, 159, 64, 0.7)", // pastel orange
  "rgba(46, 204, 113, 0.7)", // pastel green
  "rgba(231, 76, 60, 0.7)", // pastel dark red
  "rgba(52, 152, 219, 0.7)", // pastel light blue
  "rgba(241, 196, 15, 0.7)", // pastel gold
];

// Add this emoji mapping constant
const CATEGORY_EMOJIS: { [key: string]: string } = Object.fromEntries(
  CATEGORIES.map((category) => [category.name, category.emoji])
);

export default function AnalyticsScreen() {
  const { expenses } = useExpenses();
  const { incomes } = useIncomes();
  const { isDark } = useTheme();
  const [selectedChart, setSelectedChart] = useState("category"); // 'category', 'monthly', 'income', 'comparison'
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
    color: CHART_COLORS[index % CHART_COLORS.length],
    legendFontColor: Colors.light.text,
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
    backgroundGradientFrom: Colors.light.background,
    backgroundGradientTo: Colors.light.background,
    color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#36A2EB",
    },
    propsForBackgroundLines: {
      strokeDasharray: "", // solid grid lines
      stroke: "rgba(0,0,0,0.1)",
    },
    fillShadowGradient: "#36A2EB",
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

  // Monthly income data
  const monthlyIncome = incomes.reduce((acc: any, income) => {
    const month = new Date(income.date).getMonth();
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += income.amount;
    return acc;
  }, {});

  // Income vs Expense comparison data
  const comparisonData = {
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
        data: Array.from({ length: 12 }, (_, i) => monthlyIncome[i] || 0),
        color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`, // Green for income
        strokeWidth: 2,
      },
      {
        data: Array.from({ length: 12 }, (_, i) => monthlyData[i] || 0),
        color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`, // Red for expenses
        strokeWidth: 2,
      },
    ],
    legend: ["Income", "Expenses"],
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
              <ThemedText>₹{(amount as number).toFixed(2)}</ThemedText>
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
                <ThemedText>₹{amount.toFixed(2)}</ThemedText>
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

  const renderMonthlyIncomeBreakdown = () => {
    const totalMonthly = Object.values(monthlyIncome).reduce(
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
          const amount = monthlyIncome[index] || 0;
          return (
            <View key={month} style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <ThemedText style={styles.categoryText}>💰 {month}</ThemedText>
                <ThemedText>₹{amount.toFixed(2)}</ThemedText>
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
      case "income":
        return (
          <>
            <LineChart
              data={{
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
                    data: Array.from(
                      { length: 12 },
                      (_, i) => monthlyIncome[i] || 0
                    ),
                    color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
                    strokeWidth: 2,
                  },
                ],
              }}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
              }}
              bezier
            />
            {renderMonthlyIncomeBreakdown()}
          </>
        );
      case "comparison":
        return (
          <>
            <LineChart
              data={comparisonData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
            />
            <ThemedView style={styles.comparisonLegend}>
              <ThemedView style={styles.legendItem}>
                <View
                  style={[
                    styles.legendColor,
                    { backgroundColor: "rgba(46, 204, 113, 0.7)" },
                  ]}
                />
                <ThemedText>Income</ThemedText>
              </ThemedView>
              <ThemedView style={styles.legendItem}>
                <View
                  style={[
                    styles.legendColor,
                    { backgroundColor: "rgba(231, 76, 60, 0.7)" },
                  ]}
                />
                <ThemedText>Expenses</ThemedText>
              </ThemedView>
            </ThemedView>
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
              : selectedChart === "income"
              ? "Monthly Income"
              : "Income vs Expenses"}
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
                setSelectedChart("income");
                setShowDropdown(false);
              }}
            >
              <ThemedText>Monthly Income</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedChart("comparison");
                setShowDropdown(false);
              }}
            >
              <ThemedText>Income vs Expenses</ThemedText>
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
  },
  header: {
    zIndex: 1,
    padding: 20,
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    width: "100%",
  },
  dropdownMenu: {
    position: "absolute",
    width: "100%",
    top: 50,
    left: "5%",
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
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  section: {
    marginBottom: 30,
    alignItems: "center",
    padding: 20,
  },
  categoryBreakdown: {
    width: "100%",
    marginTop: 25,
    gap: 20,
    padding: 20,
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
    height: 24,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    overflow: "hidden",
  },
  loadingBarFill: {
    height: "100%",
    borderRadius: 8,
    opacity: 0.65,
  },
  comparisonLegend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 16,
    padding: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
});
