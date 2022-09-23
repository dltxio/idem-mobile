import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SettingsScreen from "./SettingsScreen";

export type SettingsStackParamList = {
  SettingScreen: undefined;
};

const Stack = createStackNavigator<SettingsStackParamList>();

const SettingsStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SettingScreen" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default SettingsStackNavigator;
