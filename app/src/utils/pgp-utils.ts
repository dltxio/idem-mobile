import axios, { AxiosError } from "axios";
import { UploadPGPKeyResponse } from "../types/general";
import type { PGP } from "../types/wallet";
import OpenPGP from "react-native-fast-openpgp";

export const generateKeyPair = async (
  password: string,
  name: string,
  email: string
): Promise<PGP> => {
  // const { privateKey, publicKey } = await OpenPGP.generate({
  //   email: email,
  //   name: name,
  //   passphrase: password
  // });

  const { privateKey, publicKey } = await OpenPGP.generate({
    email: email,
    name: name,
    passphrase: password
  });

  const pgp: PGP = {
    privateKey: privateKey,
    publicKey: publicKey
  };

  console.log(pgp);

  return pgp;
};

// export const verifyPublicKey = async (publicKey: string): Promise<Boolean> => {
//   try {
//     // https://keys.openpgp.org/about/api
//     const uploadResponse = await axios.post<UploadPGPKeyResponse>(
//       "https://keys.openpgp.org/vks/v1/upload",
//       {
//         keytext: publicKey,
//         headers: {
//           "Content-Type": "application/json"
//         }
//       }
//     );
//   } catch (error) {
//     //console.error(error?.response?.data || error);
//     return false;
//   }

//   return true;
// };

// TODO: change to fingerprint
export const verifyKeyByEmail = async (email: string): Promise<Boolean> => {
  try {
    await axios.get(
      encodeURI(`https://keys.openpgp.org/vks/v1/by-email/${email}`)
    );

    // Alert.alert(
    //   `Email Verified`,
    //   `Email has been verified with keys.openpgp.org`
    // );

    return true;
  } catch (error) {
    const err = error as AxiosError;
    console.error(err?.response?.data || error);

    return false;
  }
};

export const publishPublicKey = async (email: string, publicKey: string): Promise<Boolean> => {
  try {
    const uploadResponse = await axios.post<UploadPGPKeyResponse>(
      "https://keys.openpgp.org/vks/v1/upload",
      { keytext: publicKey },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    // change to sig
    console.log(uploadResponse.data);
    const verifyResponse = await axios.post(
      "https://keys.openpgp.org/vks/v1/request-verify",
      {
        token: uploadResponse.data.token,
        addresses: [email]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    console.log(verifyResponse.data);
    return true;
  } catch (error) {
    const err = error as AxiosError;
    console.error(err?.response?.data || error);
    return false;
  }
};

