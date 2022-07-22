import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "./screens/Home";
import ClaimScreen from "./screens/ClaimScreen";
import { ClaimType } from "../types/claim";
import { getClaimFromType } from "../utils/claim-utils";
import ViewFile from "./screens/ViewFileScreen";
import PGPScreen from "./screens/PGPScreen";
import VerifyOtpScreen from "./screens/VerifyOtpScreen";

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
        name="PGP"
        options={{ title: "Import Private Key" }}
        component={PGPScreen}
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
        name="VerifyOtp"
        options={{ title: "Verify OTP" }}
        component={VerifyOtpScreen}
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
