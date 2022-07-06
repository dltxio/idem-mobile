import { Alert } from "react-native";
import { findNames } from "../utils/formatters";
import { exchangeLocalStorage } from "../utils/local-storage";
import { createRandomPassword } from "../utils/randomPassword-utils";
import { getVendor } from "../utils/vendor";
import useApi from "./useApi";

type Hooks = {
  signup: (name: string, email: string, vendorId: number) => Promise<void>;
};

const useVendors = (): Hooks => {
  const api = useApi();

  const signup = async (name: string, email: string, vendorId: number) => {
    const vendor = getVendor(vendorId);
    const randomTempPassword = createRandomPassword();
    const splitName = findNames(name);
    if (
      splitName?.firstName &&
      splitName.lastName &&
      randomTempPassword &&
      vendor
    ) {
      api
        .vendorSignup({
          source: vendorId,
          firstName: splitName?.firstName,
          lastName: splitName?.lastName,
          email: email,
          password: randomTempPassword
        })
        .then(async () => {
          await exchangeLocalStorage.save({ vendor: vendor, signup: true });
          shareDetailsAlert(randomTempPassword);
        })
        .catch((error) => {
          Alert.alert(error.message);
        });
    }
  };

  const shareDetailsAlert = (randomTempPassword: string) => {
    Alert.alert(
      "Register",
      `Sign up successful, your temporary password is ${randomTempPassword}`,
      [
        {
          text: "OK",
          onPress: () => console.log(""),
          style: "destructive"
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ],
      {
        cancelable: true
      }
    );
  };

  return { signup };
};

export default useVendors;
