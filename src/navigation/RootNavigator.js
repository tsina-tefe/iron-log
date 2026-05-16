import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import WorkoutsStack from "./WorkoutsStack";
import LogStack from "./LogStack";
import HistoryStack from "./HistoryStack";
import ProgressStack from "./ProgressStack";

const Tab = createBottomTabNavigator();

const TAB_CONFIG = [
  {
    name: "WorkoutsTab",
    component: WorkoutsStack,
    label: "Workouts",
    icon: "barbell-outline",
  },
  {
    name: "LogTab",
    component: LogStack,
    label: "Log",
    icon: "add-circle-outline",
  },
  {
    name: "HistoryTab",
    component: HistoryStack,
    label: "History",
    icon: "calendar-outline",
  },
  {
    name: "ProgressTab",
    component: ProgressStack,
    label: "Progress",
    icon: "stats-chart-outline",
  },
];

export default function RootNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#1C1C1E",
            borderTopColor: "#2C2C2E",
            borderTopWidth: 0.5,
            paddingBottom: insets.bottom,
            height: 56 + insets.bottom,
          },
          tabBarActiveTintColor: "#D0FD3E",
          tabBarInactiveTintColor: "#555558",
          tabBarLabelStyle: { fontSize: 11, marginBottom: 4 },
          tabBarIcon: ({ color, size }) => {
            const tab = TAB_CONFIG.find((t) => t.name === route.name);
            return <Ionicons name={tab.icon} size={22} color={color} />;
          },
          tabBarLabel: TAB_CONFIG.find((t) => t.name === route.name)?.label,
        })}
      >
        {TAB_CONFIG.map((tab) => (
          <Tab.Screen
            key={tab.name}
            name={tab.name}
            component={tab.component}
          />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
