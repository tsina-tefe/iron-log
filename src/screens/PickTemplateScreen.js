import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  colors,
  spacing,
  typography,
  font,
  borderRadius,
  cardStyle,
} from "../theme";
import { getAllTemplates, getTemplateWithExercises } from "../db/templates";
import useActiveSessionStore from "../store/useActiveSessionStore";
import EmptyState from "../components/EmptyState";
import { Animated } from "react-native";
import useFadeIn from "../hooks/useFadeIn";
import Loader from "../components/Loader";

export default function PickTemplateScreen({ navigation }) {
  const [templates, setTemplates] = useState([]);
  const { templateId: activeTemplateId, startSession } =
    useActiveSessionStore();
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getAllTemplates()
        .then(setTemplates)
        .finally(() => setLoading(false));
    }, []),
  );

  async function handlePick(template) {
    if (activeTemplateId) {
      Alert.alert(
        "Active Workout",
        `You have an active "${useActiveSessionStore.getState().templateName}" session. Resume it?`,
        [
          {
            text: "Resume",
            onPress: () => navigation.navigate("ActiveSession"),
          },
          { text: "Cancel", style: "cancel" },
        ],
      );
      return;
    }

    const fullTemplate = await getTemplateWithExercises(template.id);
    startSession(fullTemplate);
    navigation.navigate("ActiveSession");
  }
  const { opacity, translateY } = useFadeIn();
  if (loading) return <Loader />;

  return (
    <Animated.View
      style={[styles.screen, { opacity, transform: [{ translateY }] }]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Start Workout</Text>
        <Text style={styles.sub}>Choose a plan to begin</Text>
      </View>

      <FlatList
        data={templates}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="barbell-outline"
            title="No plans yet"
            subtitle="Create a workout plan in the Workouts tab first"
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => handlePick(item)}
          >
            <View style={[styles.dot, { backgroundColor: item.color + "33" }]}>
              <Ionicons name="barbell-outline" size={22} color={item.color} />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardName}>{item.name}</Text>
              <Text style={styles.cardSub}>{item.exerciseCount} exercises</Text>
            </View>
            <View style={[styles.startBtn, { backgroundColor: item.color }]}>
              <Text style={styles.startLabel}>Start</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
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
    marginTop: spacing.xs,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  card: {
    ...cardStyle,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  dot: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    flex: 1,
    gap: 3,
  },
  cardName: {
    ...font("bold"),
    fontSize: typography.md,
    color: colors.textPrimary,
  },
  cardSub: {
    ...font("regular"),
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  startBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
  },
  startLabel: {
    ...font("bold"),
    fontSize: typography.sm,
    color: colors.background,
  },
});
