import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import HeaderLeft from "../components/HeaderLeft";
import HeaderTitle from "../components/HeaderTitle";
import Claims from "../screens/claims";
import Claim from "../screens/claim";

const Stack = createStackNavigator();

const ClaimsStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Claims List"
        component={Claims}
        options={({ navigation }) => ({
          headerLeft: () => <HeaderLeft navigation={navigation} />,
          headerTitle: () => <HeaderTitle title="Claims" />,
        })}
      />
      <Stack.Screen
        name="Claim"
        component={Claim}
        options={({ navigation }) => ({
          headerLeft: () => <HeaderLeft navigation={navigation} />,
          headerTitle: () => <HeaderTitle title="Claim" />,
        })}
      />
    </Stack.Navigator>
  );
};

export default ClaimsStackNavigator;
