import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  colors,
  spacing,
  typography,
  borderRadius,
  font,
  shadows,
} from "../theme";

export default function Button({
  label,
  onPress,
  variant = "primary", // 'primary' | 'ghost' | 'danger'
  size = "md", // 'md' | 'lg' | 'sm'
  loading = false,
  disabled = false,
  style,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[
        styles.base,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? colors.background : colors.primary}
        />
      ) : (
        <Text
          style={[
            styles.label,
            styles[`${variant}Label`],
            styles[`${size}Label`],
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.md,
  },

  // Variants
  primary: {
    backgroundColor: colors.primary,
    ...shadows.green,
  },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border,
  },
  danger: {
    backgroundColor: colors.danger + "22",
    borderWidth: 1,
    borderColor: colors.danger,
  },

  // Sizes
  sm: { paddingVertical: spacing.xs, paddingHorizontal: spacing.md },
  md: { paddingVertical: spacing.sm + 4, paddingHorizontal: spacing.lg },
  lg: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
  },

  // Labels
  label: { ...font("bold") },
  primaryLabel: { color: colors.background, fontSize: typography.md },
  ghostLabel: { color: colors.textPrimary, fontSize: typography.md },
  dangerLabel: { color: colors.danger, fontSize: typography.md },

  smLabel: { fontSize: typography.sm },
  mdLabel: { fontSize: typography.md },
  lgLabel: { fontSize: typography.lg },

  disabled: { opacity: 0.4 },
});
