import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "./screens/Home";
import ClaimScreen from "./screens/ClaimScreen";
import { ClaimType } from "../types/claim";
import { getClaimFromType } from "../utils/claim-utils";
import { DocumentId } from "../types/document";
import { getDocumentFromDocumentId } from "../utils/document-utils";
import DocumentScreen from "./screens/DocumentScreen";

export type ProfileStackParamList = {
  Home: undefined;
  Claim: { claimType: ClaimType };
  Document: {
    documentId: DocumentId;
    onSelect: () => void;
  };
};

const Stack = createStackNavigator<ProfileStackParamList>();

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false
      }}
    >
      <Stack.Screen
        name="Home"
        options={() => ({
          headerShown: false
        })}
        component={ProfileScreen}
      />
      <Stack.Screen
        name="Claim"
        options={props => {
          const claim = getClaimFromType(props.route.params.claimType);
          return {
            title: claim.title
          };
        }}
        component={ClaimScreen}
      />
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

export default ProfileStackNavigator;
