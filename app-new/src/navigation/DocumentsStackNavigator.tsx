import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, View } from "react-native";

const Stack = createStackNavigator();

const DocumentsStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Setting"
        component={() => (
          <View>
            <Text>Documents</Text>
          </View>
        )}
      />
    </Stack.Navigator>
  );
};

export default DocumentsStackNavigator;
