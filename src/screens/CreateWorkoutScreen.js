import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
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
import { getAllExercises } from "../db/exercises";
import { createTemplate, getTemplateWithExercises } from "../db/templates";
import Button from "../components/Button";

const TEMPLATE_COLORS = [
  "#D0FD3E",
  "#0A84FF",
  "#FF9F0A",
  "#FF453A",
  "#BF5AF2",
  "#32D74B",
];

export default function CreateWorkoutScreen({ navigation, route }) {
  const existing = route.params?.template;

  const [name, setName] = useState(existing?.name ?? "");
  const [color, setColor] = useState(existing?.color ?? TEMPLATE_COLORS[0]);
  const [exercises, setExercises] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  useCallback(() => {
    getAllExercises().then(setAllExercises);
    if (existing) {
      getTemplateWithExercises(existing.id).then((t) =>
        setExercises(t.exercises),
      );
    }
  }, [])();

  const filtered = allExercises.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.muscleGroup.toLowerCase().includes(search.toLowerCase()),
  );

  function toggleExercise(ex) {
    setExercises((prev) => {
      const exists = prev.find((e) => e.id === ex.id);
      return exists ? prev.filter((e) => e.id !== ex.id) : [...prev, ex];
    });
  }

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert("Name required", "Give your workout plan a name.");
      return;
    }
    if (exercises.length === 0) {
      Alert.alert("No exercises", "Add at least one exercise.");
      return;
    }

    setSaving(true);
    try {
      await createTemplate(
        name.trim(),
        color,
        exercises.map((e) => e.id),
      );
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", "Failed to save plan. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.screen}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="chevron-back"
              size={24}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
          <Text style={styles.title}>
            {existing ? "Edit Plan" : "New Plan"}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>Plan Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Push Day"
            placeholderTextColor={colors.textMuted}
          />

          <Text style={styles.label}>Color</Text>
          <View style={styles.colorRow}>
            {TEMPLATE_COLORS.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setColor(c)}
                style={[
                  styles.colorDot,
                  { backgroundColor: c },
                  color === c && styles.colorDotActive,
                ]}
              />
            ))}
          </View>

          <View style={styles.exHeader}>
            <Text style={styles.label}>Exercises ({exercises.length})</Text>
            <TouchableOpacity onPress={() => setPickerVisible(true)}>
              <Text style={styles.addExLabel}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {exercises.length === 0 ? (
            <TouchableOpacity
              style={styles.emptyEx}
              onPress={() => setPickerVisible(true)}
            >
              <Ionicons
                name="add-circle-outline"
                size={28}
                color={colors.textMuted}
              />
              <Text style={styles.emptyExText}>Tap to add exercises</Text>
            </TouchableOpacity>
          ) : (
            exercises.map((ex, i) => (
              <View key={ex.id} style={styles.exRow}>
                <View style={styles.exRowLeft}>
                  <Text style={styles.exNum}>{i + 1}</Text>
                  <View>
                    <Text style={styles.exName}>{ex.name}</Text>
                    <Text style={styles.exMuscle}>{ex.muscleGroup}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => toggleExercise(ex)}>
                  <Ionicons
                    name="close-circle"
                    size={22}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            ))
          )}

          <View style={{ height: spacing.xl }} />
          <Button
            label="Save Plan"
            onPress={handleSave}
            loading={saving}
            size="lg"
          />
          <View style={{ height: spacing.xxl }} />
        </ScrollView>

        <Modal
          visible={pickerVisible}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Exercises</Text>
              <TouchableOpacity onPress={() => setPickerVisible(false)}>
                <Text style={styles.modalDone}>Done</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.search}
              value={search}
              onChangeText={setSearch}
              placeholder="Search exercises..."
              placeholderTextColor={colors.textMuted}
            />

            <FlatList
              data={filtered}
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={{ padding: spacing.md }}
              renderItem={({ item }) => {
                const selected = !!exercises.find((e) => e.id === item.id);
                return (
                  <TouchableOpacity
                    style={[
                      styles.pickerRow,
                      selected && styles.pickerRowSelected,
                    ]}
                    onPress={() => toggleExercise(item)}
                  >
                    <View style={styles.pickerLeft}>
                      <Text style={styles.pickerName}>{item.name}</Text>
                      <Text style={styles.pickerMuscle}>
                        {item.muscleGroup}
                      </Text>
                    </View>
                    {selected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color={colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
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
  title: {
    ...font("bold"),
    fontSize: typography.xl,
    color: colors.textPrimary,
  },
  scroll: { padding: spacing.md },
  label: {
    ...font("medium"),
    fontSize: typography.sm,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  input: {
    ...font("regular"),
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: spacing.md,
    fontSize: typography.md,
    color: colors.textPrimary,
  },
  colorRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  colorDot: {
    width: 34,
    height: 34,
    borderRadius: borderRadius.full,
  },
  colorDotActive: {
    borderWidth: 3,
    borderColor: colors.textPrimary,
  },
  exHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addExLabel: {
    ...font("medium"),
    fontSize: typography.sm,
    color: colors.primary,
  },
  emptyEx: {
    ...cardStyle,
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  emptyExText: {
    ...font("regular"),
    fontSize: typography.sm,
    color: colors.textMuted,
  },
  exRow: {
    ...cardStyle,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  exRowLeft: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  exNum: {
    ...font("bold"),
    fontSize: typography.sm,
    color: colors.textMuted,
    width: 20,
  },
  exName: {
    ...font("medium"),
    fontSize: typography.md,
    color: colors.textPrimary,
  },
  exMuscle: {
    ...font("regular"),
    fontSize: typography.xs,
    color: colors.textSecondary,
  },
  modal: { flex: 1, backgroundColor: colors.background },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
    paddingTop: spacing.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...font("bold"),
    fontSize: typography.xl,
    color: colors.textPrimary,
  },
  modalDone: {
    ...font("medium"),
    fontSize: typography.md,
    color: colors.primary,
  },
  search: {
    ...font("regular"),
    margin: spacing.md,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: spacing.md,
    fontSize: typography.md,
    color: colors.textPrimary,
  },
  pickerRow: {
    ...cardStyle,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  pickerRowSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  pickerLeft: { gap: 3 },
  pickerName: {
    ...font("medium"),
    fontSize: typography.md,
    color: colors.textPrimary,
  },
  pickerMuscle: {
    ...font("regular"),
    fontSize: typography.xs,
    color: colors.textSecondary,
  },
});
