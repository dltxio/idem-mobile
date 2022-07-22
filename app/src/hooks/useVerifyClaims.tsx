import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "./useApi";
import { UserVerifyRequest, VerificationResponse } from "../types/user";
import { AlertTitle } from "../constants/common";

type Hooks = {
  verifyClaims: (verifyRequest: UserVerifyRequest) => Promise<void>;
  postTokenToProxy: (expoToken: string) => Promise<void>;
};

const useVerifyClaims = (): Hooks => {
  const api = useApi();
  const verifyClaims = async (verifyRequest: UserVerifyRequest) => {
    api
      .verify(verifyRequest)
      .then(async (response) => {
        await AsyncStorage.setItem("idemVerify", JSON.stringify(response));
      })
      .catch((error) => {
        console.log(error);
        Alert.alert(AlertTitle.Error, `${error}`);
      });
  };

  const postTokenToProxy = async (expoToken: string) => {
    const claim = await AsyncStorage.getItem("idemVerify");
    if (claim) {
      const claimObject = JSON.parse(claim) as VerificationResponse;
      api
        .putExpoToken(claimObject.userId, { token: expoToken })
        .then(() => {
          Alert.alert(
            AlertTitle.Success,
            "Your name, date of birth, email, and address have been sent to IDEM to be verified!"
          );
        })
        .catch((error) => {
          console.error(error);
          Alert.alert(AlertTitle.Error, `${error}`);
        });
    }
  };
  return {
    verifyClaims,
    postTokenToProxy
  };
};

export default useVerifyClaims;
