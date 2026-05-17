import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, borderRadius, font } from "../theme";

export default function SetRow({
  setNumber,
  weightKg,
  reps,
  completed = false,
  onChangeWeight,
  onChangeReps,
  onComplete,
}) {
  return (
    <View style={[styles.row, completed && styles.rowCompleted]}>
      {/* Set number */}
      <Text style={styles.setNum}>{setNumber}</Text>

      {/* Weight input */}
      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          value={weightKg}
          onChangeText={onChangeWeight}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={colors.textMuted}
          editable={!completed}
        />
        <Text style={styles.unit}>kg</Text>
      </View>

      {/* Reps input */}
      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          value={reps}
          onChangeText={onChangeReps}
          keyboardType="number-pad"
          placeholder="0"
          placeholderTextColor={colors.textMuted}
          editable={!completed}
        />
        <Text style={styles.unit}>reps</Text>
      </View>

      {/* Complete checkbox */}
      <TouchableOpacity
        onPress={onComplete}
        style={[styles.check, completed && styles.checkDone]}
      >
        {completed && (
          <Ionicons name="checkmark" size={16} color={colors.background} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.cardElevated,
    marginBottom: spacing.xs,
  },
  rowCompleted: {
    opacity: 0.6,
    backgroundColor: colors.primaryMuted,
  },
  setNum: {
    ...font("bold"),
    fontSize: typography.sm,
    color: colors.textMuted,
    width: 20,
    textAlign: "center",
  },
  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    gap: 4,
  },
  input: {
    ...font("medium"),
    flex: 1,
    fontSize: typography.md,
    color: colors.textPrimary,
    textAlign: "center",
  },
  unit: {
    ...font("regular"),
    fontSize: typography.xs,
    color: colors.textMuted,
  },
  check: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
