import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  VictoryLine,
  VictoryChart,
  VictoryArea,
  VictoryAxis,
  VictoryScatter,
} from "victory-native";
import {
  colors,
  spacing,
  typography,
  font,
  borderRadius,
  cardStyle,
} from "../theme";
import { getAllExercises } from "../db/exercises";
import { getProgressForExercise, getAllPersonalRecords } from "../db/sets";
import { getAllSessions } from "../db/sessions";
import { calculateStreak } from "../utils/calculations";
import { formatDate } from "../utils/formatTime";
import StatBox from "../components/StatBox";
import EmptyState from "../components/EmptyState";
import { Animated } from "react-native";
import useFadeIn from "../hooks/useFadeIn";

export default function ProgressScreen() {
  const [exercises, setExercises] = useState([]);
  const [selectedEx, setSelectedEx] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [prs, setPrs] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [thisMonth, setThisMonth] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadAll();
    }, []),
  );

  async function loadAll() {
    const [allEx, allSessions, allPrs] = await Promise.all([
      getAllExercises(),
      getAllSessions(),
      getAllPersonalRecords(),
    ]);

    const loggedIds = new Set(allPrs.map((p) => p.exerciseId));
    const loggedExercises = allEx.filter((e) => loggedIds.has(e.id));

    const now = new Date();
    const monthCount = allSessions.filter((s) => {
      const d = new Date(s.startedAt);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    }).length;

    setExercises(loggedExercises);
    setSessions(allSessions);
    setPrs(allPrs);
    setThisMonth(monthCount);

    if (loggedExercises.length > 0 && !selectedEx) {
      handleSelectExercise(loggedExercises[0]);
    }
  }

  async function handleSelectExercise(ex) {
    setSelectedEx(ex);
    const progress = await getProgressForExercise(ex.id);
    const shaped = progress.map((p, i) => ({
      x: i + 1,
      y: p.maxWeight,
      date: formatDate(p.date),
    }));
    setChartData(shaped);
  }

  const streak = calculateStreak(sessions);
  const { opacity, translateY } = useFadeIn();

  return (
    <Animated.View
      style={[styles.screen, { opacity, transform: [{ translateY }] }]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Progress</Text>
        <Text style={styles.sub}>Track your gains</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.statsRow}>
          <StatBox label="Total Sessions" value={String(sessions.length)} />
          <StatBox label="This Month" value={String(thisMonth)} accent />
          <StatBox label="Best Streak" value={`${streak}🔥`} />
        </View>

        <Text style={styles.sectionLabel}>LIFT PROGRESS</Text>

        {exercises.length === 0 ? (
          <View
            style={[cardStyle, { alignItems: "center", padding: spacing.xl }]}
          >
            <EmptyState
              icon="stats-chart-outline"
              title="No data yet"
              subtitle="Complete a session to start tracking progress"
            />
          </View>
        ) : (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pickerRow}
            >
              {exercises.map((ex) => (
                <TouchableOpacity
                  key={ex.id}
                  onPress={() => handleSelectExercise(ex)}
                  style={[
                    styles.pickerPill,
                    selectedEx?.id === ex.id && styles.pickerPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.pickerLabel,
                      selectedEx?.id === ex.id && styles.pickerLabelActive,
                    ]}
                  >
                    {ex.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.chartCard}>
              {chartData.length < 2 ? (
                <View style={styles.chartEmpty}>
                  <Text style={styles.chartEmptyText}>
                    Log {selectedEx?.name} in at least 2 sessions to see your
                    trend
                  </Text>
                </View>
              ) : (
                <VictoryChart
                  height={220}
                  padding={{ top: 20, bottom: 40, left: 50, right: 20 }}
                  domainPadding={{ x: 10, y: 10 }}
                >
                  <VictoryAxis
                    style={{
                      axis: { stroke: colors.border },
                      tickLabels: {
                        fill: colors.textMuted,
                        fontSize: 10,
                        fontFamily: "Inter_400Regular",
                      },
                      grid: { stroke: "transparent" },
                    }}
                    tickFormat={() => ""}
                  />
                  <VictoryAxis
                    dependentAxis
                    style={{
                      axis: { stroke: colors.border },
                      tickLabels: {
                        fill: colors.textMuted,
                        fontSize: 10,
                        fontFamily: "Inter_400Regular",
                      },
                      grid: {
                        stroke: colors.cardElevated,
                        strokeDasharray: "4",
                      },
                    }}
                    tickFormat={(v) => `${v}kg`}
                  />
                  <VictoryArea
                    data={chartData}
                    style={{
                      data: {
                        fill: colors.primary,
                        fillOpacity: 0.08,
                        stroke: "transparent",
                      },
                    }}
                    interpolation="monotoneX"
                  />
                  <VictoryLine
                    data={chartData}
                    style={{
                      data: {
                        stroke: colors.primary,
                        strokeWidth: 2.5,
                      },
                    }}
                    interpolation="monotoneX"
                  />
                  <VictoryScatter
                    data={chartData}
                    size={4}
                    style={{
                      data: {
                        fill: colors.primary,
                        stroke: colors.background,
                        strokeWidth: 2,
                      },
                    }}
                  />
                </VictoryChart>
              )}
            </View>
          </>
        )}

        <Text style={styles.sectionLabel}>PERSONAL RECORDS</Text>

        {prs.length === 0 ? (
          <EmptyState
            icon="trophy-outline"
            title="No PRs yet"
            subtitle="Your personal records will appear here"
          />
        ) : (
          prs.map((pr) => {
            const isRecent =
              new Date() - new Date(pr.achievedAt) < 1000 * 60 * 60 * 24 * 30;
            return (
              <View key={pr.exerciseId} style={styles.prCard}>
                <View style={styles.prLeft}>
                  <Text style={styles.prName}>{pr.exerciseName}</Text>
                  <Text style={styles.prDate}>{formatDate(pr.achievedAt)}</Text>
                </View>
                <View style={styles.prRight}>
                  {isRecent && (
                    <View style={styles.newBadge}>
                      <Text style={styles.newBadgeLabel}>NEW</Text>
                    </View>
                  )}
                  <Text style={styles.prWeight}>{pr.bestWeight} kg</Text>
                </View>
              </View>
            );
          })
        )}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    ...font("bold"),
    fontSize: typography.xxl,
    color: colors.textPrimary,
  },
  sub: {
    ...font("regular"),
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  scroll: { padding: spacing.md, gap: spacing.md },
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  sectionLabel: {
    ...font("bold"),
    fontSize: typography.xs,
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  pickerRow: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  pickerPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  pickerPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pickerLabel: {
    ...font("medium"),
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  pickerLabelActive: {
    color: colors.background,
  },
  chartCard: {
    ...cardStyle,
    padding: 0,
    overflow: "hidden",
    backgroundColor: colors.card,
  },
  chartEmpty: {
    padding: spacing.xl,
    alignItems: "center",
  },
  chartEmptyText: {
    ...font("regular"),
    fontSize: typography.sm,
    color: colors.textMuted,
    textAlign: "center",
  },
  prCard: {
    ...cardStyle,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  prLeft: { gap: 3 },
  prName: {
    ...font("bold"),
    fontSize: typography.md,
    color: colors.textPrimary,
  },
  prDate: {
    ...font("regular"),
    fontSize: typography.xs,
    color: colors.textSecondary,
  },
  prRight: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  prWeight: { ...font("bold"), fontSize: typography.xl, color: colors.primary },
  newBadge: {
    backgroundColor: colors.primaryMuted,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  newBadgeLabel: {
    ...font("bold"),
    fontSize: typography.xs,
    color: colors.primary,
    letterSpacing: 0.6,
  },
});
