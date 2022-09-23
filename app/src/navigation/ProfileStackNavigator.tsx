import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "./screens/Home";
import ViewFile from "./screens/ViewFileScreen";
import {
  AddressClaimScreen,
  AdultClaimScreen,
  BirthClaimScreen,
  EmailClaimScreen,
  MobileClaimScreen,
  NameClaimScreen
} from "./screens/ClaimScreens/index";

export type ProfileStackParamList = {
  Home: undefined;
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
  AddressClaim: undefined;
  AdultClaim: undefined;
  EmailClaim: undefined;
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

      <Stack.Screen
        name="AddressClaim"
        options={() => {
          return { title: "Address" };
        }}
        component={AddressClaimScreen}
      />

      <Stack.Screen
        name="AdultClaim"
        options={() => {
          return { title: "18+" };
        }}
        component={AdultClaimScreen}
      />

      <Stack.Screen
        name="EmailClaim"
        options={() => {
          return { title: "Email" };
        }}
        component={EmailClaimScreen}
      />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
