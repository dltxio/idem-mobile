import { Alert } from "react-native";
import { getClaimFromType } from "../utils/claim-utils";
import axios from "axios";

type Hooks = {
  verifyClaims: () => Promise<void>;
};

const useVerifyClaims = (): Hooks => {
  const name = getClaimFromType("FullNameCredential");
  const birthday = getClaimFromType("DateOfBirthCredential");
  const email = getClaimFromType("EmailCredential");
  const address = getClaimFromType("AddressCredential");

  const documentsBody = {
    name: name,
    birthday: birthday,
    email: email,
    address: address
  };

  const verifyClaims = async () => {
    const body = JSON.stringify(documentsBody);
    try {
      if (body) {
        const response = await axios.post(
          body,
          "https://proxy.idem.com.au/user/verify"
        );
        if (response.statusText === "true") {
          console.log("yay");
        }
      }
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
