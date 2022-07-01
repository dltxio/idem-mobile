import axios from "axios";
import { Alert } from "react-native";
import { stuff } from "../interfaces/exchange-interface";
import { claimsLocalStorage } from "../utils/local-storage";
import { createRandomPassword } from "../utils/randomPassword-utils";

type Hooks = {
  makeEasyCryptoUser(bod: stuff): Promise<void>;
};

const useEasyCrypto = (): Hooks => {
  const makeEasyCryptoUser = async (bod: stuff) => {
    const randomTempPassword = createRandomPassword();
    const getData = claimsLocalStorage.get();
    console.log(getData);
    const bodyEasyCrypto = JSON.stringify({
      email: bod.email,
      password: randomTempPassword,
      returnSecureToken: true
    });
    try {
      const checkUserAuthEasyCrypto = await axios.post(
        "https://api.easycrypto.com.au/api/user.php",
        bodyEasyCrypto,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      if (checkUserAuthEasyCrypto.status === 200) {
        const jwtEasy = checkUserAuthEasyCrypto.data.token;
        const potato = getData.map(
          (name: { firstName: string }) => name.firstName === bod.firstName
        );
        console.log(potato);
        const updatedEasyBody = {
          firstName: potato.firstName,
          lastName: potato.lastName,
          yob: Number(potato.yob),
          mobile: potato.mobileNumber,
          extraIdNumber: null,
          action: "checkExisting",
          version: 2,
          siteVersion: "8.16.3"
        };
        const updateUserInfo = await axios.post(
          `https://api.easycrypto.com.au/apiv2/verify.php`,
          updatedEasyBody,
          {
            headers: {
              Authorization: `Bearer ${jwtEasy}`
            }
          }
        );
        if (updateUserInfo.status === 200) {
          Alert.alert(
            "Success!",
            `You have signed up to Easy Crypto successfully. Your temporary password is ${randomTempPassword}`
          );
        }
      }
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
