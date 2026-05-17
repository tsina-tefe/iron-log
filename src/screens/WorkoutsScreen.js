// src/screens/WorkoutsScreen.js
import { View, Text } from "react-native";
import { colors } from "../theme";

export default function WorkoutsScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: colors.textPrimary }}>Workouts</Text>
    </View>
  );
}
