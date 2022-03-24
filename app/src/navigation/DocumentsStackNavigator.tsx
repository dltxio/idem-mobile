import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DocumentsScreen from "./screens/DocumentsScreen";
import DocumentScreen from "./screens/DocumentScreen";
import { DocumentId } from "../types/document";
import { getDocumentFromDocumentId } from "../utils/document-utils";

export type DocumentsStackParamList = {
  Documents: undefined;
  Document: {
    documentId: DocumentId;
  };
};

const Stack = createStackNavigator<DocumentsStackParamList>();

const DocumentsStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Documents" component={DocumentsScreen} />
      <Stack.Screen
        name="Document"
        options={props => {
          const document = getDocumentFromDocumentId(
            props.route.params.documentId
          );
          return {
            title: document.title
          };
        }}
        component={DocumentScreen}
      />
    </Stack.Navigator>
  );
};

export default DocumentsStackNavigator;
