import { Alert } from "react-native";
import { AlertTitle } from "../constants/common";
import { findNames } from "../utils/formatters";
import {
  exchangeLocalStorage,
  verificationStorage
} from "../utils/local-storage";
import { createRandomPassword } from "../utils/randomPassword-utils";
import { getVendor } from "../utils/vendor";
import useApi from "./useApi";

type UserInfo = {
  name: string;
  email: string;
  mobile?: string;
  dob?: string;
};

type Hooks = {
  signup: (userInfo: UserInfo, vendorId: number) => Promise<void>;
};

const useVendors = (): Hooks => {
  const api = useApi();

  const signup = async (userInfo: UserInfo, vendorId: number) => {
    const { name, email, mobile, dob } = userInfo;
    try {
      const verification = await verificationStorage.get();
      if (!verification) {
        throw new Error(
          "Claims not verified. Please verify your claims on the profile page"
        );
      }

      const vendor = getVendor(vendorId);
      if (!vendor) throw new Error("Vendor not found");

      const splitName = findNames(name);
      const hasFullName = splitName?.firstName && splitName.lastName;
      if (!hasFullName) throw new Error("Missing Full Name");

      const randomTempPassword = createRandomPassword();

      const response = await api.vendorSignup(
        {
          source: vendorId,
          firstName: splitName?.firstName,
          lastName: splitName?.lastName,
          email,
          mobile,
          password: randomTempPassword,
          dob
        },
        verification
      );
      let tempPassword;
      let userId;
      if (vendorId === 5) {
        const { token, password } = response as any;
        userId = token;
        tempPassword = password;
      } else {
        userId = response;
        tempPassword = randomTempPassword;
      }
      await exchangeLocalStorage.save({
        vendor: vendor,
        signup: true,
        userId
      });
      shareDetailsAlert(tempPassword);
    } catch (error: any) {
      Alert.alert(error?.message);
    }
  };

  const shareDetailsAlert = (randomTempPassword: string) => {
    Alert.alert(
      AlertTitle.Success,
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
