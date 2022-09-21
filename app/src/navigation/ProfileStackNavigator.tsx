import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "./screens/Home";
import ClaimScreen from "./screens/ClaimScreen";
import { ClaimType } from "../types/claim";
import { getClaimFromType } from "../utils/claim-utils";
import ViewFile from "./screens/ViewFileScreen";
import NameClaimScreen from "./screens/ClaimScreens/NameClaimScreen";
import BirthClaimScreen from "./screens/ClaimScreens/BirthClaimScreen";
import MobileClaimScreen from "./screens/ClaimScreens/MobileClaimScreen";

export type ProfileStackParamList = {
  Home: undefined;
  Claim: { claimType: ClaimType };
  VerifyOtp: { mobileNumber: string };
  ViewFile: {
    fileId: string;
    onSelect: () => void;
  };
  Mnemonic: undefined;
  PGP: undefined;
  NameClaim: undefined;
  BirthClaim: undefined;
  MobileClaim: undefined;
};

const Stack = createStackNavigator<ProfileStackParamList>();

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false
      }}
      initialRouteName={"Home"}
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

      <Stack.Screen
        name="NameClaim"
        options={() => {
          return {
            title: "Full Name"
          };
        }}
        component={NameClaimScreen}
      />

      <Stack.Screen
        name="BirthClaim"
        options={() => {
          return {
            title: "Date of Birth"
          };
        }}
        component={BirthClaimScreen}
      />

      <Stack.Screen
        name="MobileClaim"
        options={() => {
          return { title: "Mobile Number" };
        }}
        component={MobileClaimScreen}
      />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
