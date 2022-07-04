import { VenderEnum } from "./../types/user";
import { Alert } from "react-native";
import { createRandomPassword } from "../utils/randomPassword-utils";
import useApi from "./useApi";

type Hooks = {
  makeEasyCryptoUser(
    email: string,
    firstName: string,
    lastName: string
  ): Promise<void>;
};

const useEasyCrypto = (): Hooks => {
  const api = useApi();

  const makeEasyCryptoUser = async (
    email: string,
    firstName: string,
    lastName: string
  ) => {
    const randomTempPassword = createRandomPassword();
    try {
      await api.vendorSignup({
        source: VenderEnum.EasyCrypto,
        email: email,
        password: randomTempPassword,
        firstName: firstName,
        lastName: lastName
      });
      Alert.alert(
        "Success!",
        `You have signed up to Easy Crypto successfully. Your temporary password is ${randomTempPassword}`
      );
    } catch (error: any) {
      console.log(error);
      Alert.alert(error.response.data);
    }
  };
  return {
    makeEasyCryptoUser
  };
};
export default useEasyCrypto;
