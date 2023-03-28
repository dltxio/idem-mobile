import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import PartnersScreen from "./screens/PartnersScreen";
import VendorDetailsScreen from "./screens/VendorDetailsScreen";

export type PartnersStackParamList = {
  Partners: undefined;
  VendorDetails: { id: number };
};

const Stack = createStackNavigator<PartnersStackParamList>();

const PartnersStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={PartnersScreen}
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

export default PartnersStackNavigator;
