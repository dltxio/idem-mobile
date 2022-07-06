import { Alert } from "react-native";
import { Vendor } from "../types/general";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "./useApi";
import { UserVerifyRequest, VerificationResponse } from "../types/user";

type Hooks = {
  verifyClaims: (
    verifyRequest: UserVerifyRequest,
    vendor: Vendor
  ) => Promise<void>;
  postTokenToProxy: (expoToken: string, vendor: Vendor) => Promise<void>;
};

const useVerifyClaims = (): Hooks => {
  const api = useApi();
  const verifyClaims = async (
    verifyRequest: UserVerifyRequest,
    vendor: Vendor
  ) => {
    api
      .verify(verifyRequest)
      .then(async (response) => {
        await AsyncStorage.setItem(vendor.name, JSON.stringify(response));
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Error!", `${error}`);
      });
  };

  const postTokenToProxy = async (expoToken: string, vendor: Vendor) => {
    const claim = await AsyncStorage.getItem(vendor.name);
    if (claim) {
      const claimObject = JSON.parse(claim) as VerificationResponse;
      api
        .putExpoToken(claimObject.userId, { token: expoToken })
        .then(() => {
          Alert.alert(
            "Success!",
            "Your name, date of birth, email, and address have been sent to IDEM to be verified!"
          );
        })
        .catch((error) => {
          console.error(error);
          Alert.alert("Error!", `${error}`);
        });
    }
  };
  return {
    verifyClaims,
    postTokenToProxy
  };
};

export default useVerifyClaims;
