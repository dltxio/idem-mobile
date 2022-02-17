import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import HeaderLeft from "../components/HeaderLeft";
import HeaderTitle from "../components/HeaderTitle";
import Settings from "../screens/settings";
import Setting from "../screens/setting/index";

const Stack = createStackNavigator();

const SettingsStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Settings List"
        component={Settings}
        options={({ navigation }) => ({
          headerLeft: () => <HeaderLeft navigation={navigation} />,
          headerTitle: () => <HeaderTitle title="Settings" />,
        })}
      />
      <Stack.Screen
        name="Setting"
        component={Setting}
        options={({ navigation }) => ({
          headerLeft: () => <HeaderLeft navigation={navigation} />,
          headerTitle: () => <HeaderTitle title="Setting" />,
        })}
      />
    </Stack.Navigator>
  );
};

export default SettingsStackNavigator;
