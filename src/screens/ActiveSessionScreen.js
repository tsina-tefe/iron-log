import { useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import * as Haptics from "expo-haptics";
import {
  colors,
  spacing,
  typography,
  font,
  borderRadius,
  cardStyle,
} from "../theme";
import useActiveSessionStore from "../store/useActiveSessionStore";
import { createSession } from "../db/sessions";
import SetRow from "../components/SetRow";
import RestTimerCard from "../components/RestTimerCard";
import Button from "../components/Button";
import { formatElapsed } from "../utils/formatTime";

export default function ActiveSessionScreen({ navigation }) {
  const {
    templateId,
    templateName,
    startedAt,
    elapsedSeconds,
    exercises,
    restSecondsLeft,
    tickElapsed,
    tickRest,
    skipRest,
    addSet,
    updateSet,
    completeSet,
    resetSession,
    getCompletedSets,
  } = useActiveSessionStore();

  // Elapsed timer
  const elapsedRef = useRef(null);
  useEffect(() => {
    elapsedRef.current = setInterval(tickElapsed, 1000);
    return () => clearInterval(elapsedRef.current);
  }, []);

  // Rest timer
  const restRef = useRef(null);
  useEffect(() => {
    if (restSecondsLeft > 0) {
      restRef.current = setInterval(tickRest, 1000);
    } else {
      clearInterval(restRef.current);
    }
    return () => clearInterval(restRef.current);
  }, [restSecondsLeft]);

  async function handleCompleteSet(exerciseId, setIndex) {
    const exercise = exercises.find((ex) => ex.exerciseId === exerciseId);
    const set = exercise?.sets[setIndex];

    const weight = parseFloat(set?.weightKg);
    const reps = parseInt(set?.reps);

    if (!weight || weight <= 0) {
      Alert.alert(
        "Missing weight",
        "Enter a weight greater than 0 before completing this set.",
      );
      return;
    }

    if (!reps || reps <= 0) {
      Alert.alert(
        "Missing reps",
        "Enter reps greater than 0 before completing this set.",
      );
      return;
    }

    completeSet(exerciseId, setIndex);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  async function handleAddSet(exerciseId) {
    addSet(exerciseId);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function handleEndSession() {
    Alert.alert("End Session", "Are you sure you want to end this workout?", [
      { text: "Cancel", style: "cancel" },
      { text: "End", style: "destructive", onPress: saveSession },
    ]);
  }

  async function saveSession() {
    try {
      const finishedAt = new Date().toISOString();
      const durationSeconds = elapsedSeconds;
      const completedSets = getCompletedSets();

      if (completedSets.length === 0) {
        Alert.alert(
          "No sets logged",
          "Complete at least one set before saving.",
        );
        return;
      }

      await createSession(
        templateId,
        templateName,
        startedAt,
        finishedAt,
        durationSeconds,
        completedSets,
      );

      // Reset AFTER successful DB write
      resetSession();
      navigation.navigate("PickTemplate");
    } catch (err) {
      console.error("Save session failed:", err);
      Alert.alert(
        "Error",
        "Failed to save session. Your workout data is safe — try again.",
      );
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.screen}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.planName}>{templateName}</Text>
            <Text style={styles.elapsed}>{formatElapsed(elapsedSeconds)}</Text>
          </View>
          <TouchableOpacity onPress={handleEndSession} style={styles.endBtn}>
            <Text style={styles.endLabel}>End</Text>
          </TouchableOpacity>
        </View>

        {/* Rest timer */}
        {restSecondsLeft > 0 && (
          <View style={{ paddingHorizontal: spacing.md }}>
            <RestTimerCard secondsLeft={restSecondsLeft} onSkip={skipRest} />
          </View>
        )}

        {/* Exercises */}
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {exercises.map((ex) => (
            <View key={ex.exerciseId} style={styles.exerciseBlock}>
              {/* Exercise header */}
              <View style={styles.exHeader}>
                <Text style={styles.exName}>{ex.exerciseName}</Text>
                <Text style={styles.exMeta}>
                  {ex.sets.filter((s) => s.completed).length}/{ex.sets.length}{" "}
                  sets
                </Text>
              </View>

              {/* Column labels */}
              <View style={styles.colLabels}>
                <Text style={[styles.colLabel, { width: 28 }]}>SET</Text>
                <Text style={[styles.colLabel, { flex: 1 }]}>KG</Text>
                <Text style={[styles.colLabel, { flex: 1 }]}>REPS</Text>
                <Text style={[styles.colLabel, { width: 36 }]}> </Text>
              </View>

              {/* Set rows */}
              {ex.sets.map((s, index) => (
                <SetRow
                  key={index}
                  setNumber={s.setNumber}
                  weightKg={s.weightKg}
                  reps={s.reps}
                  completed={s.completed}
                  onChangeWeight={(val) =>
                    updateSet(ex.exerciseId, index, "weightKg", val)
                  }
                  onChangeReps={(val) =>
                    updateSet(ex.exerciseId, index, "reps", val)
                  }
                  onComplete={() => handleCompleteSet(ex.exerciseId, index)}
                />
              ))}

              {/* Add set */}
              <TouchableOpacity
                style={styles.addSet}
                onPress={() => handleAddSet(ex.exerciseId)}
              >
                <Text style={styles.addSetLabel}>+ Add Set</Text>
              </TouchableOpacity>
            </View>
          ))}

          <View style={{ height: spacing.xxl }} />
        </ScrollView>

        {/* Save button */}
        <View style={styles.footer}>
          <Button
            label="SAVE SESSION"
            onPress={saveSession}
            size="lg"
            style={{ width: "100%" }}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  planName: {
    ...font("bold"),
    fontSize: typography.xl,
    color: colors.textPrimary,
  },
  elapsed: {
    ...font("medium"),
    fontSize: typography.sm,
    color: colors.primary,
    marginTop: 2,
  },
  endBtn: {
    backgroundColor: colors.danger + "22",
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  endLabel: {
    ...font("bold"),
    fontSize: typography.sm,
    color: colors.danger,
  },
  scroll: {
    padding: spacing.md,
    gap: spacing.md,
  },
  exerciseBlock: {
    ...cardStyle,
    gap: spacing.xs,
  },
  exHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  exName: {
    ...font("bold"),
    fontSize: typography.md,
    color: colors.textPrimary,
  },
  exMeta: {
    ...font("regular"),
    fontSize: typography.xs,
    color: colors.textSecondary,
  },
  colLabels: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: 4,
  },
  colLabel: {
    ...font("medium"),
    fontSize: typography.xs,
    color: colors.textMuted,
    textAlign: "center",
    letterSpacing: 0.6,
  },
  addSet: {
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
    marginTop: spacing.xs,
  },
  addSetLabel: {
    ...font("medium"),
    fontSize: typography.sm,
    color: colors.primary,
  },
  footer: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
});
