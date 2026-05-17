import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  colors,
  spacing,
  typography,
  font,
  borderRadius,
  cardStyle,
} from "../theme";
import { getSessionWithSets } from "../db/sessions";
import { formatElapsed, formatDate } from "../utils/formatTime";
import { calculateVolume } from "../utils/calculations";

export default function SessionDetailScreen({ navigation, route }) {
  const { sessionId } = route.params;
  const [session, setSession] = useState(null);

  useEffect(() => {
    getSessionWithSets(sessionId).then(setSession);
  }, [sessionId]);

  if (!session) return null;

  // Group sets by exercise
  const byExercise = session.sets.reduce((acc, set) => {
    if (!acc[set.exerciseName]) acc[set.exerciseName] = [];
    acc[set.exerciseName].push(set);
    return acc;
  }, {});

  const totalVolume = calculateVolume(session.sets);

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>{session.templateName}</Text>
          <Text style={styles.date}>{formatDate(session.startedAt)}</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Summary stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {formatElapsed(session.durationSeconds ?? 0)}
          </Text>
          <Text style={styles.statLabel}>Duration</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{session.sets.length}</Text>
          <Text style={styles.statLabel}>Total Sets</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{Math.round(totalVolume)}</Text>
          <Text style={styles.statLabel}>Volume kg</Text>
        </View>
      </View>

      {/* Sets by exercise */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {Object.entries(byExercise).map(([exerciseName, sets]) => (
          <View key={exerciseName} style={styles.block}>
            <Text style={styles.exName}>{exerciseName}</Text>

            {/* Column headers */}
            <View style={styles.colRow}>
              <Text style={[styles.col, { width: 36 }]}>SET</Text>
              <Text style={[styles.col, { flex: 1 }]}>KG</Text>
              <Text style={[styles.col, { flex: 1 }]}>REPS</Text>
              <Text style={[styles.col, { flex: 1 }]}>VOL</Text>
            </View>

            {sets.map((s, i) => (
              <View key={i} style={styles.setRow}>
                <Text style={[styles.setCell, { width: 36 }]}>
                  {s.setNumber}
                </Text>
                <Text style={[styles.setCell, { flex: 1 }]}>{s.weightKg}</Text>
                <Text style={[styles.setCell, { flex: 1 }]}>{s.reps}</Text>
                <Text
                  style={[styles.setCell, { flex: 1, color: colors.primary }]}
                >
                  {Math.round(s.weightKg * s.reps)}
                </Text>
              </View>
            ))}
          </View>
        ))}
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
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
  headerCenter: { alignItems: "center", gap: 2 },
  title: {
    ...font("bold"),
    fontSize: typography.lg,
    color: colors.textPrimary,
  },
  date: {
    ...font("regular"),
    fontSize: typography.xs,
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: "row",
    padding: spacing.md,
    gap: spacing.sm,
  },
  statBox: {
    ...cardStyle,
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.md,
    gap: 4,
  },
  statValue: {
    ...font("bold"),
    fontSize: typography.xl,
    color: colors.primary,
  },
  statLabel: {
    ...font("regular"),
    fontSize: typography.xs,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  scroll: { padding: spacing.md },
  block: {
    ...cardStyle,
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  exName: {
    ...font("bold"),
    fontSize: typography.md,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  colRow: {
    flexDirection: "row",
    paddingHorizontal: spacing.xs,
    marginBottom: 4,
  },
  col: {
    ...font("medium"),
    fontSize: typography.xs,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  setRow: {
    flexDirection: "row",
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.cardElevated,
    marginBottom: 3,
  },
  setCell: {
    ...font("medium"),
    fontSize: typography.sm,
    color: colors.textPrimary,
    textAlign: "center",
  },
});
