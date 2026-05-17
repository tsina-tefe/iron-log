import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  colors,
  spacing,
  typography,
  borderRadius,
  font,
  cardStyle,
} from "../theme";

export default function WorkoutCard({
  name,
  exerciseCount,
  color = colors.primary,
  onPress,
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.card}>
      <View style={[styles.iconCircle, { backgroundColor: color + "22" }]}>
        <Ionicons name="barbell-outline" size={20} color={color} />
      </View>
      <View style={styles.body}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.sub}>
          {exerciseCount} exercise{exerciseCount !== 1 ? "s" : ""}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    ...cardStyle,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
    gap: 3,
  },
  name: {
    ...font("bold"),
    fontSize: typography.md,
    color: colors.textPrimary,
  },
  sub: {
    ...font("regular"),
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
});
