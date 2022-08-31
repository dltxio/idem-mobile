import { Alert } from "react-native";
import useApi from "./useApi";
import { UserVerifyRequest } from "../types/user";
import { AlertTitle } from "../constants/common";
import { verificationStorage } from "../utils/local-storage";

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
        await verificationStorage.save(response);
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
        Alert.alert(AlertTitle.Error, `${error.message}`);
      });
  };

  return {
    verifyClaims
  };
};

export default useVerifyClaims;
