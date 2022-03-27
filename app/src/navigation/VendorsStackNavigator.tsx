import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View } from "react-native";
import { useDocumentStore } from "../context/DocumentStore";
import { useClaimsStore } from "../context/ClaimsStore";
import { Button } from "react-native-elements";

const Stack = createStackNavigator();

const VendorsStackNavigator = () => {
  const { reset: resetDocuments } = useDocumentStore();
  const { reset: resetClaims } = useClaimsStore();

  const onReset = () => {
    resetDocuments();
    resetClaims();
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="3rd Party List"
        component={() => (
          <View>
            {/* <Button title="Reset data" onPress={onReset} /> */}
          </View>
        )}
      />
    </Stack.Navigator>
  );
};

export default VendorsStackNavigator;
