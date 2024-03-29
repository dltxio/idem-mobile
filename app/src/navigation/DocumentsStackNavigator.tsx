import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ViewFile from "./screens/ViewFileScreen";
import DocumentTypesScreen from "./screens/DocumentTypesScreen";
import DocumentDetailScreen from "./screens/DocumentDetailScreen";
import { Document } from "../types/document";

export type DocumentsStackParamList = {
  "Documents": undefined;
  ViewFile: {
    fileId: string;
  };
  DocumentDetail: {
    document: Document;
  };
};

const Stack = createStackNavigator<DocumentsStackParamList>();

const DocumentsStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Documents">
      <Stack.Screen name="Documents" component={DocumentTypesScreen} />
      <Stack.Screen
        name="ViewFile"
        options={() => {
          return {
            title: "Document Details"
          };
        }}
        component={ViewFile}
      />
      <Stack.Screen
        name="DocumentDetail"
        component={DocumentDetailScreen}
        options={({ route }) => ({ title: route.params.document.title })}
      />
    </Stack.Navigator>
  );
};

export default DocumentsStackNavigator;
