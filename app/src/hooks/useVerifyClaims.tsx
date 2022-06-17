import { Alert } from "react-native";
import axios, { AxiosResponse } from "axios";
import { VerifyOnProxy } from "../types/general";
import { claimsLocalStorage } from "../utils/local-storage";

type Hooks = {
  verifyClaims: (proxyBody: VerifyOnProxy) => Promise<void>;
  postTokenToProxy: (
    expoToken: string
  ) => Promise<AxiosResponse<any, any> | undefined>;
};

const useVerifyClaims = (): Hooks => {
  const verifyClaims = async (proxyBody: VerifyOnProxy) => {
    try {
      const response = await axios.post(
        "https://proxy.idem.com.au/user/verify",
        proxyBody
      );
      await claimsLocalStorage.save(response.data);
    } catch (error) {
      console.log(error);
      Alert.alert("Error!", `${error}`);
    }
  };

  const postTokenToProxy = async (expoToken: string) => {
    const claims = await claimsLocalStorage.get();
    const body = JSON.stringify({ token: expoToken });
    try {
      const response = await axios.post(
        `https://proxy.idem.com.au/user/${claims}/token`,
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
      console.log(response.data, "TOKEN RESPONSE");
      return response;
    } catch (error) {
      Alert.alert("Error!", `${error}`);
      console.log(error, "Boooooooooo");
    }
  };
  return {
    verifyClaims,
    postTokenToProxy
  };
};

export default useVerifyClaims;
