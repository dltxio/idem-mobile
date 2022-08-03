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

type Hooks = {
  signup: (name: string, email: string, vendorId: number) => Promise<void>;
  syncDetail: (
    name: string,
    password: string,
    email: string,
    dob: string,
    vendorId: number
  ) => Promise<void>;
};

const useVendors = (): Hooks => {
  const api = useApi();

  const signup = async (name: string, email: string, vendorId: number) => {
    try {
      const verification = await verificationStorage.get();
      if (!verification) {
        throw new Error("Verification not found");
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
          email: email,
          password: randomTempPassword
        },
        verification
      );
      await exchangeLocalStorage.save({
        vendor: vendor,
        signup: true,
        userId: response
      });
      shareDetailsAlert(randomTempPassword);
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

  const syncDetail = async (
    name: string,
    password: string,
    email: string,
    dob: string,
    vendorId: number
  ) => {
    if (name && password && email && dob) {
      const splitName = findNames(name);
      api
        .syncDetail({
          source: vendorId,
          email: email,
          password: password,
          firstName: splitName?.firstName ?? "",
          lastName: splitName?.lastName ?? "",
          dob: dob
        })
        .then(() => {
          Alert.alert(AlertTitle.Success, "Your detail sync successful", [
            {
              text: "OK",
              onPress: () => console.log(""),
              style: "destructive"
            }
          ]);
        })
        .catch(() => {
          Alert.alert(
            AlertTitle.Error,
            "Something wrong, please check your password",
            [
              {
                text: "OK",
                onPress: () => console.log(""),
                style: "destructive"
              }
            ]
          );
        });
    }
  };
  return { signup, syncDetail };
};

export default useVendors;
