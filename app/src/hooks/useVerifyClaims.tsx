import { Alert } from "react-native";
import axios from "axios";
import { VerifyOnProxy } from "../types/general";

type Hooks = {
  verifyClaims: (proxyBody: VerifyOnProxy) => Promise<void>;
};

const useVerifyClaims = (): Hooks => {
  const verifyClaims = async (proxyBody: VerifyOnProxy) => {
    try {
      await axios.post("https://proxy.idem.com.au/user/verify", proxyBody);
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
