import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, font, borderRadius } from "../theme";
import { getAllTemplates, deleteTemplate } from "../db/templates";
import WorkoutCard from "../components/WorkoutCard";
import EmptyState from "../components/EmptyState";
import { Animated } from "react-native";
import useFadeIn from "../hooks/useFadeIn";

export default function WorkoutsScreen({ navigation }) {
  const [templates, setTemplates] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getAllTemplates().then(setTemplates);
    }, []),
  );

  function handleDelete(template) {
    Alert.alert(
      "Delete Plan",
      `Delete "${template.name}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteTemplate(template.id);
            setTemplates((prev) => prev.filter((t) => t.id !== template.id));
          },
        },
      ],
    );
  }

  const { opacity, translateY } = useFadeIn();

  return (
    <Animated.View
      style={[styles.screen, { opacity, transform: [{ translateY }] }]}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Workouts</Text>
          <Text style={styles.sub}>{templates.length} plans</Text>
        </View>
        <TouchableOpacity
          style={styles.newBtn}
          onPress={() => navigation.navigate("CreateWorkout")}
        >
          <Ionicons name="add" size={20} color={colors.background} />
          <Text style={styles.newLabel}>New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={templates}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="barbell-outline"
            title="No plans yet"
            subtitle="Tap New to create your first workout plan"
          />
        }
        renderItem={({ item }) => (
          <WorkoutCard
            name={item.name}
            exerciseCount={item.exerciseCount}
            color={item.color}
            onPress={() =>
              navigation.navigate("CreateWorkout", { template: item })
            }
            onLongPress={() => handleDelete(item)}
          />
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    marginTop: 2,
  },
  newBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  newLabel: {
    ...font("bold"),
    fontSize: typography.sm,
    color: colors.background,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
});
