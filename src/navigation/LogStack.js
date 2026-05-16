import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PickTemplateScreen from "../screens/PickTemplateScreen";
import ActiveSessionScreen from "../screens/ActiveSessionScreen";

const Stack = createNativeStackNavigator();

export default function LogStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PickTemplate" component={PickTemplateScreen} />
      <Stack.Screen
        name="ActiveSession"
        component={ActiveSessionScreen}
        options={{ tabBarStyle: { display: "none" } }}
      />
    </Stack.Navigator>
  );
}
