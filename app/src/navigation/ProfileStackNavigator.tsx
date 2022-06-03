import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "./screens/Home";
import ClaimScreen from "./screens/ClaimScreen";
import { ClaimType } from "../types/claim";
import { getClaimFromType } from "../utils/claim-utils";
import ViewFile from "./screens/ViewFileScreen";
import { useMnemonic } from "../context/Mnemonic";
import MnemonicScreen from "./screens/Mnemonic";
import PGPScreen from "./screens/PGPScreen";

export type ProfileStackParamList = {
  Home: undefined;
  Claim: { claimType: ClaimType };
  ViewFile: {
    fileId: string;
    onSelect: () => void;
  };
  Mnemonic: undefined;
  PGP: undefined;
};

const Stack = createStackNavigator<ProfileStackParamList>();

const ProfileStackNavigator = () => {
  const { mnemonic } = useMnemonic();
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false
      }}
      initialRouteName={mnemonic ? "Home" : "Mnemonic"}
    >
      <Stack.Screen
        name="Home"
        options={() => ({
          headerShown: false
        })}
        component={ProfileScreen}
      />
      <Stack.Screen
        name="PGP"
        options={() => ({
          headerShown: false
        })}
        component={PGPScreen}
      />
      <Stack.Screen
        name="Mnemonic"
        options={() => ({
          headerShown: false
        })}
        component={MnemonicScreen}
      />
      <Stack.Screen
        name="Claim"
        options={(props) => {
          const claim = getClaimFromType(props.route.params.claimType);
          return {
            title: claim.title
          };
        }}
        component={ClaimScreen}
      />
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

export default ProfileStackNavigator;
