import { View, ScrollView, StyleSheet } from "react-native";
import { colors, spacing } from "../theme";
import Button from "../components/Button";
import WorkoutCard from "../components/WorkoutCard";
import StatBox from "../components/StatBox";
import SetRow from "../components/SetRow";
import EmptyState from "../components/EmptyState";

export default function WorkoutsScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}
    >
      <View style={{ flexDirection: "row", gap: spacing.sm }}>
        <StatBox label="Total Sessions" value="12" />
        <StatBox label="This Month" value="4" accent />
      </View>
      <WorkoutCard
        name="Push Day"
        exerciseCount={6}
        color="#D0FD3E"
        onPress={() => {}}
      />
      <WorkoutCard
        name="Pull Day"
        exerciseCount={5}
        color="#0A84FF"
        onPress={() => {}}
      />
      <SetRow
        setNumber={1}
        weightKg="80"
        reps="8"
        completed={false}
        onComplete={() => {}}
      />
      <SetRow
        setNumber={2}
        weightKg="80"
        reps="6"
        completed
        onComplete={() => {}}
      />
      <Button label="Save Session" onPress={() => {}} />
      <Button label="Ghost Button" variant="ghost" onPress={() => {}} />
      <Button label="End Session" variant="danger" onPress={() => {}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
});
