import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import VendorsScreen from "./screens/VendorsScreen";
import VendorDetailsScreen from "./screens/VendorDetails";

export type VendorStackParamList = {
  Back: undefined;
  VendorDetails: { id: number };
};

const Stack = createStackNavigator<VendorStackParamList>();

const VendorsStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Back"
        component={VendorsScreen}
        options={() => ({
          headerShown: false
        })}
      />
      <Stack.Screen
        name="VendorDetails"
        component={VendorDetailsScreen}
        options={() => {
          return {
            title: ""
          };
        }}
      />
    </Stack.Navigator>
  );
};

export default VendorsStackNavigator;
