import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DocumentsScreen from "./screens/DocumentsScreen";
import ViewFile from "./screens/ViewFileScreen";

export type DocumentsStackParamList = {
  Documents: undefined;
  ViewFile: {
    fileId: string;
  };
};

const Stack = createStackNavigator<DocumentsStackParamList>();

const DocumentsStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Documents" component={DocumentsScreen} />
      <Stack.Screen
        name="ViewFile"
        options={() => {
          return {
            title: ""
          };
        }}
        component={ViewFile}
      />
    </Stack.Navigator>
  );
};

export default DocumentsStackNavigator;
