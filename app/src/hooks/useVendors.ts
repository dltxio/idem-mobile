import { Vendor } from "../types/general";
import { Alert } from "react-native";
import { AlertTitle } from "../constants/common";
import { findNames } from "../utils/formatters";
import {
  exchangeLocalStorage
  // verificationStorage
} from "../utils/local-storage";
import { createRandomPassword } from "../utils/randomPassword-utils";
import { getPartner } from "../utils/partner";
import useApi from "./useApi";
import { UserInfo } from "../types/user";

type Hooks = {
  signup: (userInfo: UserInfo, vendor: Vendor) => Promise<void>;
};

const useVendors = (): Hooks => {
  const api = useApi();

  const signup = async (userInfo: UserInfo, vendor: Vendor) => {
    const { name, email, mobile, dob } = userInfo;
    try {
      let idVerification;
      // if (vendor.verifyClaims) {
      //   idVerification = await verificationStorage.get();
      //   if (!idVerification) {
      //     throw new Error(
      //       "The required claims have not been verified. Please verify these claims on the profile page first."
      //     );
      //   }
      // }

      const partnerName = getPartner(vendor.id);
      if (!partnerName) throw new Error("Partner not found");

      const splitName = findNames(name);
      console.log("splitName", splitName);
      const hasFullName = splitName?.firstName && splitName.lastName;
      if (!hasFullName) throw new Error("Missing Full Name!");

      let randomTempPassword = "";

      if (vendor.tempPassword) {
        randomTempPassword = createRandomPassword();
      }

      const response = await api.vendorSignup(
        {
          source: vendor.id,
          firstName: splitName?.firstName,
          lastName: splitName?.lastName,
          email,
          mobile: mobile?.replace(" ", ""),
          password: randomTempPassword,
          dob
        },
        idVerification
      );

      let tempPassword: string;
      let userId;

      if (vendor.id === 5) {
        userId = response.userId;
        tempPassword = response.password ?? randomTempPassword;
      } else {
        userId = response.userId;
        tempPassword = randomTempPassword;
      }

      await exchangeLocalStorage.save({
        vendor: partnerName,
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
        }
      ]
    );
  };

  return { signup };
};

export default useVendors;
