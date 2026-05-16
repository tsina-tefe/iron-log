import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProgressScreen from "../screens/ProgressScreen";

const Stack = createNativeStackNavigator();

export default function ProgressStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Progress" component={ProgressScreen} />
    </Stack.Navigator>
  );
}
