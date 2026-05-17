import { View, Text, StyleSheet } from "react-native";
import {
  colors,
  spacing,
  typography,
  borderRadius,
  font,
  cardStyle,
} from "../theme";

export default function StatBox({ label, value, accent = false }) {
  return (
    <View style={[styles.box, accent && styles.accented]}>
      <Text style={[styles.value, accent && styles.accentValue]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    ...cardStyle,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  accented: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  value: {
    ...font("bold"),
    fontSize: typography.xxl,
    color: colors.textPrimary,
  },
  accentValue: {
    color: colors.primary,
  },
  label: {
    ...font("regular"),
    fontSize: typography.xs,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
});
