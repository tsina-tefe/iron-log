export const colors = {
  // Backgrounds
  background: "#121212",
  card: "#1C1C1E",
  cardElevated: "#2C2C2E",

  // Accent
  primary: "#D0FD3E",
  primaryMuted: "#D0FD3E26", // 15% opacity green for backgrounds

  // Text
  textPrimary: "#FFFFFF",
  textSecondary: "#8E8E93",
  textMuted: "#555558",

  // Semantic
  danger: "#FF453A",
  success: "#32D74B",
  warning: "#FFD60A",

  // Borders
  border: "#2C2C2E",
  borderLight: "#3A3A3C",

  templateColors: [
    "#D0FD3E",
    "#0A84FF",
    "#FF9F0A",
    "#FF453A",
    "#BF5AF2",
    "#32D74B",
  ],
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  // Sizes
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 22,
  xxl: 28,
  hero: 40,

  // Weights
  regular: "400",
  medium: "500",
  bold: "700",

  // Fonts
  fontRegular: "Inter_400Regular",
  fontMedium: "Inter_500Medium",
  fontBold: "Inter_700Bold",
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
};

export const shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5, // Android
  },
  green: {
    shadowColor: "#D0FD3E",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
};

// Convenience: full dark card style used everywhere
export const cardStyle = {
  backgroundColor: colors.card,
  borderRadius: borderRadius.lg,
  borderWidth: 0.5,
  borderColor: colors.border,
  padding: spacing.md,
};

export const font = (weight = "regular") => ({
  fontFamily:
    {
      regular: "Inter_400Regular",
      medium: "Inter_500Medium",
      bold: "Inter_700Bold",
    }[weight] ?? "Inter_400Regular",
});
