import * as React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { View, StyleSheet, Text, Alert } from "react-native";

import {
  ProfileStackNavigation,
  ProfileStackNavigationRoute
} from "../../types/navigation";
import useApi from "../../hooks/useApi";

type Navigation = ProfileStackNavigation<"VerifyOtp">;

const VerifyOtpScreen: React.FC = () => {
  const route = useRoute<ProfileStackNavigationRoute<"VerifyOtp">>();
  const navigation = useNavigation<Navigation>();
  const api = useApi();
  const mobileNumber = route.params.mobileNumber;

  const sendOtp = React.useCallback(
    async (mobileNumber: string) => {
      const response = await api.requestOtp({ mobileNumber });
      Alert.alert("proxy response", JSON.stringify(response));
    },
    [api]
  );

  React.useEffect(() => {
    (async () => {
      await sendOtp(mobileNumber);
    })();
  }, []);

  return (
    <View>
      <Text>VERIFY OTP SCREEN</Text>
      <Text>Mobile Number : {mobileNumber}</Text>
    </View>
  );
};

export default VerifyOtpScreen;

const styles = StyleSheet.create({});
