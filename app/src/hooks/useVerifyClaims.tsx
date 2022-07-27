import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "./useApi";
import { UserVerifyRequest } from "../types/user";
import { AlertTitle } from "../constants/common";

type Hooks = {
  verifyClaims: (
    verifyRequest: UserVerifyRequest,
    expoToken: string | undefined
  ) => Promise<void>;
};

const useVerifyClaims = (): Hooks => {
  const api = useApi();
  const verifyClaims = async (
    verifyRequest: UserVerifyRequest,
    expoToken: string | undefined
  ) => {
    api
      .verify(verifyRequest)
      .then(async (response) => {
        await AsyncStorage.setItem("idemVerify", JSON.stringify(response));
        if (response.userId && expoToken) {
          await api.putExpoToken(response.userId, { token: expoToken });
        }
      })
      .then(() => {
        Alert.alert(
          AlertTitle.Success,
          "Your name, date of birth, email, and address have been sent to IDEM to be verified!"
        );
      })
      .catch((error) => {
        console.log(error);
        Alert.alert(AlertTitle.Error, `${error}`);
      });
  };

  return {
    verifyClaims
  };
};

export default useVerifyClaims;
