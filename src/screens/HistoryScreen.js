import { useState, useCallback } from "react";
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  colors,
  spacing,
  typography,
  font,
  borderRadius,
  cardStyle,
} from "../theme";
import { getAllSessions } from "../db/sessions";
import { groupSessionsByWeek } from "../utils/calculations";
import { formatElapsed, formatShortDate } from "../utils/formatTime";
import EmptyState from "../components/EmptyState";
import { Animated } from "react-native";
import useFadeIn from "../hooks/useFadeIn";
import Loader from "../components/Loader";

const FILTERS = ["All", "This week", "This month"];

export default function HistoryScreen({ navigation }) {
  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getAllSessions()
        .then(setSessions)
        .finally(() => setLoading(false));
    }, []),
  );

  function applyFilter(data) {
    const now = new Date();
    if (filter === "This week") {
      return data.filter((s) => {
        const diff = (now - new Date(s.startedAt)) / (1000 * 60 * 60 * 24);
        return diff < 7;
      });
    }
    if (filter === "This month") {
      return data.filter((s) => {
        const d = new Date(s.startedAt);
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      });
    }
    return data;
  }

  const sections = groupSessionsByWeek(applyFilter(sessions));
  const { opacity, translateY } = useFadeIn();

  if (loading) return <Loader />;

  return (
    <Animated.View
      style={[styles.screen, { opacity, transform: [{ translateY }] }]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <Text style={styles.sub}>Your past sessions</Text>
      </View>

      <View style={styles.filters}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.pill, filter === f && styles.pillActive]}
          >
            <Text
              style={[styles.pillLabel, filter === f && styles.pillLabelActive]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="calendar-outline"
            title="No sessions yet"
            subtitle="Complete a workout to see your history here"
          />
        }
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionLabel}>{section.title}</Text>
        )}
        renderItem={({ item }) => {
          const { day, month } = formatShortDate(item.startedAt);
          return (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate("SessionDetail", { sessionId: item.id })
              }
            >
              <View style={styles.dateBlock}>
                <Text style={styles.dateDay}>{day}</Text>
                <Text style={styles.dateMonth}>{month}</Text>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.cardName}>{item.templateName}</Text>
                <Text style={styles.cardMeta}>
                  {formatElapsed(item.durationSeconds ?? 0)}
                  {"  ·  "}
                  {item.totalSets} sets
                  {"  ·  "}
                  {Math.round(item.totalVolume)} kg
                </Text>
              </View>

              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          );
        }}
      />
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
  filters: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillLabel: {
    ...font("medium"),
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  pillLabelActive: {
    color: colors.background,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  sectionLabel: {
    ...font("bold"),
    fontSize: typography.xs,
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  card: {
    ...cardStyle,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  dateBlock: {
    width: 44,
    height: 44,
    backgroundColor: colors.primaryMuted,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  dateDay: { ...font("bold"), fontSize: typography.md, color: colors.primary },
  dateMonth: {
    ...font("regular"),
    fontSize: typography.xs,
    color: colors.primary,
  },
  cardBody: { flex: 1, gap: 4 },
  cardName: {
    ...font("bold"),
    fontSize: typography.md,
    color: colors.textPrimary,
  },
  cardMeta: {
    ...font("regular"),
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  chevron: { fontSize: typography.xl, color: colors.textMuted },
});
