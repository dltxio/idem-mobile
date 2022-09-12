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
      .verifyClaims(verifyRequest)
      .then(async (response) => {
        await verificationStorage.save(response);
        if (expoToken) {
          await api.putUser(verifyRequest.hashEmail, {
            email: verifyRequest.hashEmail,
            expoToken: expoToken
          });
        }
      })
      .then(() => {
        Alert.alert(
          AlertTitle.Success,
          "Your name, date of birth, email, and address have been sent to IDEM to be verified!"
        );
      })
      .catch((error) => {
        Alert.alert(AlertTitle.Error, `${error.message}`);
      });
  };

  return {
    verifyClaims
  };
};

export default useVerifyClaims;
