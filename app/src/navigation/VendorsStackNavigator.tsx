import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import VendorsScreen from "./screens/VendorsScreen";
import VendorDetailsScreen from "./screens/VendorDetails";

export type PartnersStackParamList = {
  Partners: undefined;
  VendorDetails: { id: number };
};

const Stack = createStackNavigator<PartnersStackParamList>();

const VendorsStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={VendorsScreen}
        name="Partners"
        options={{ title: "Partners" }}
      />
      <Stack.Screen
        name="VendorDetails"
        component={VendorDetailsScreen}
        options={() => {
          return {
            title: "",
            headerBackTitle: "Back"
          };
        }}
      />
    </Stack.Navigator>
  );
};

export default VendorsStackNavigator;
