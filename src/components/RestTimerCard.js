import { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import {
  colors,
  spacing,
  typography,
  borderRadius,
  font,
  cardStyle,
} from "../theme";

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const TOTAL_SECONDS = 90;

export default function RestTimerCard({ secondsLeft, onSkip }) {
  const animatedValue = useRef(new Animated.Value(secondsLeft)).current;

  useEffect(() => {
    animatedValue.setValue(secondsLeft);
  }, [secondsLeft]);

  const strokeDashoffset =
    CIRCUMFERENCE - (secondsLeft / TOTAL_SECONDS) * CIRCUMFERENCE;
  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  if (secondsLeft <= 0) return null;

  return (
    <View style={styles.card}>
      <View style={styles.ring}>
        <Svg width={100} height={100} viewBox="0 0 100 100">
          {/* Track */}
          <Circle
            cx="50"
            cy="50"
            r={RADIUS}
            stroke={colors.cardElevated}
            strokeWidth="6"
            fill="none"
          />
          {/* Progress */}
          <Circle
            cx="50"
            cy="50"
            r={RADIUS}
            stroke={colors.primary}
            strokeWidth="6"
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin="50, 50"
          />
        </Svg>
        <View style={styles.ringCenter}>
          <Text style={styles.countdown}>
            {minutes}:{seconds}
          </Text>
        </View>
      </View>

      <View style={styles.right}>
        <Text style={styles.label}>Rest timer</Text>
        <Text style={styles.sub}>Take a breather</Text>
        <TouchableOpacity onPress={onSkip}>
          <Text style={styles.skip}>Skip →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...cardStyle,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    borderColor: colors.primary,
    marginBottom: spacing.md,
  },
  ring: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  ringCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  countdown: {
    ...font("bold"),
    fontSize: typography.xl,
    color: colors.primary,
  },
  right: {
    flex: 1,
    gap: spacing.xs,
  },
  label: {
    ...font("bold"),
    fontSize: typography.lg,
    color: colors.textPrimary,
  },
  sub: {
    ...font("regular"),
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  skip: {
    ...font("medium"),
    fontSize: typography.sm,
    color: colors.primary,
    marginTop: spacing.xs,
  },
});
