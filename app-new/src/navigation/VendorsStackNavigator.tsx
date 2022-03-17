import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, View } from "react-native";

const Stack = createStackNavigator();

const VendorsStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="3rd Party List"
        component={() => (
          <View>
            <Text>Third party list</Text>
          </View>
        )}
      />
    </Stack.Navigator>
  );
};

export default VendorsStackNavigator;
