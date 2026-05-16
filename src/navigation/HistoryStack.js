import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HistoryScreen from "../screens/HistoryScreen";
import SessionDetailScreen from "../screens/SessionDetailScreen";

const Stack = createNativeStackNavigator();

export default function HistoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="SessionDetail" component={SessionDetailScreen} />
    </Stack.Navigator>
  );
}
