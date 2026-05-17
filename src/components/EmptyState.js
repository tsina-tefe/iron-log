import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, font } from "../theme";

export default function EmptyState({
  icon = "barbell-outline",
  title,
  subtitle,
}) {
  return (
    <View style={styles.wrap}>
      <Ionicons name={icon} size={48} color={colors.textMuted} />
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.sub}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  title: {
    ...font("bold"),
    fontSize: typography.lg,
    color: colors.textSecondary,
    textAlign: "center",
  },
  sub: {
    ...font("regular"),
    fontSize: typography.sm,
    color: colors.textMuted,
    textAlign: "center",
  },
});
