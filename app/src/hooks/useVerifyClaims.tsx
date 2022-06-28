import { Alert } from "react-native";
import axios, { AxiosResponse } from "axios";
import { Vendor, VerifyOnProxy } from "../types/general";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VerificationResponse } from "../interfaces/exchange-interface";

type Hooks = {
  verifyClaims: (proxyBody: VerifyOnProxy, vendor: Vendor) => Promise<void>;
  postTokenToProxy: (
    expoToken: string,
    vendor: Vendor
  ) => Promise<AxiosResponse<any, any> | undefined>;
};

const useVerifyClaims = (): Hooks => {
  const verifyClaims = async (proxyBody: VerifyOnProxy, vendor: Vendor) => {
    try {
      const response = await axios.post(
        "https://proxy.idem.com.au/user/verify",
        proxyBody,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      await AsyncStorage.setItem(vendor.name, JSON.stringify(response.data));
    } catch (error) {
      console.log(error);
      Alert.alert("Error!", `${error}`);
    }
  };

  const postTokenToProxy = async (expoToken: string, vendor: Vendor) => {
    const claim = await AsyncStorage.getItem(vendor.name);
    console.log(claim);
    if (claim) {
      const claimObject = JSON.parse(claim) as VerificationResponse;

      const body = JSON.stringify({ token: expoToken });
      try {
        const response = await axios.put(
          `https://proxy.idem.com.au/user/${claimObject.userId}/token`,
          body,
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        Alert.alert(
          "Success!",
          "Your name, date of birth, email, and address have been sent to IDEM to be verified!"
        );
        return response;
      } catch (error) {
        Alert.alert("Error!", `${error}`);
      }
    }
  };
  return {
    verifyClaims,
    postTokenToProxy
  };
};

export default useVerifyClaims;
