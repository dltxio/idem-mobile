import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import VendorsScreen from "./screens/VendorsScreen";

const Stack = createStackNavigator();

const VendorsStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="3rd Party List" component={VendorsScreen} />
    </Stack.Navigator>
  );
};

export default VendorsStackNavigator;
