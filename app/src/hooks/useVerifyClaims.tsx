import { Alert } from "react-native";
import axios from "axios";
import { VerifyOnProxy } from "../types/general";

type Hooks = {
  verifyClaims: (proxyBody: VerifyOnProxy) => Promise<void>;
};

const useVerifyClaims = (): Hooks => {
  const verifyClaims = async (proxyBody: VerifyOnProxy) => {
    const body = JSON.stringify(proxyBody);
    try {
      if (body) {
        const response = await axios.post(
          body,
          "https://proxy.idem.com.au/user/verify"
        );
        console.log(response);
      }
      Alert.alert(
        "Success!",
        "Your name, date of birth, email, and address have been verified!"
      );
    } catch (error) {
      console.log(error);
    }
  };

  return {
    verifyClaims
  };
};

export default useVerifyClaims;
