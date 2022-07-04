import axios from "axios";
import { Alert } from "react-native";
import { useClaimValue } from "../context/ClaimsStore";
import { stuff } from "../interfaces/exchange-interface";
import { findNames } from "../utils/formatters";
import { createRandomPassword } from "../utils/randomPassword-utils";

const dob = useClaimValue("BirthCredential");
const mobile = useClaimValue("MobileCredential");
const name = useClaimValue("NameCredential");
const splitName = findNames(name);
const address = useClaimValue("AddressCredential");

type Hooks = {
  makeEasyCryptoUser(bod: stuff): Promise<void>;
};

const useEasyCrypto = (): Hooks => {
  const makeEasyCryptoUser = async (body: stuff) => {
    const randomTempPassword = createRandomPassword();
    const bodyEasyCrypto = JSON.stringify({
      email: body.email,
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
        const updatedEasyBody = {
          firstName: splitName?.firstName,
          lastName: splitName?.lastName,
          dob: dob,
          mobile: mobile,
          extraIdNumber: null,
          action: null,
          version: null,
          siteVersion: null
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
          const NewjwtEasy = updateUserInfo.data.token;
          const changeUserInfo = {
            component: "Address",
            action: "updatePart",
            fields: { address: address },
            siteVersion: null,
            version: null
          };
          const newchangeUserInfo = await axios.post(
            `https://api.easycrypto.com.au/apiv2/verify.php`,
            changeUserInfo,
            {
              headers: {
                Authorization: `Bearer ${NewjwtEasy}`
              }
            }
          );
          if (newchangeUserInfo.status === 200) {
            Alert.alert(
              "Success!",
              `You have signed up to Easy Crypto successfully. Your temporary password is ${randomTempPassword}`
            );
          }
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
