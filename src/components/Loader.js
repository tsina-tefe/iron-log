import { View, ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "../theme";

export default function Loader() {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
