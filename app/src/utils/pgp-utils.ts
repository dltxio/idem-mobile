import axios, { AxiosError } from "axios";
import * as openpgp from "openpgp";
import { UploadPGPKeyResponse } from "../types/general";
import type { PGP } from "../types/wallet";

export const generateKeyPair = async (
  password: string,
  name: string,
  email: string
): Promise<PGP> => {
  const { privateKey, publicKey } = await openpgp.generateKey({
    type: "ecc", // Type of the key, defaults to ECC
    curve: "curve25519", // ECC curve name, defaults to curve25519
    userIDs: [{ name: name, email: email }], // you can pass multiple user IDs
    passphrase: password,
    format: "armored" // output key format, defaults to 'armored' (other options: 'binary' or 'object')
  });

  const pgp: PGP = {
    privateKey: privateKey,
    publicKey: publicKey
  };

  console.log(pgp);

  return pgp;
};

export const createPublicKey = async (privateKey: string): Promise<PGP> => {
  const result: openpgp.Key = await openpgp.readKey({ armoredKey: privateKey });
  const publicKey = result.toPublic();

  const pgp: PGP = {
    privateKey: privateKey,
    publicKey: publicKey.armor()
  };

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
export const verifyKeyByEmail = async (email: string) : Promise<Boolean> => {
  try {
    await axios.get(encodeURI(`https://keys.openpgp.org/vks/v1/by-email/${email}`));
    // Alert.alert(
    //   `Email Verified`,
    //   `Email has been verified with keys.openpgp.org`
    // );

    return true;
  } catch (error) {
    const err = error as AxiosError;
    console.error(err?.response?.data || error);
    // Alert.alert("UH-OH", "Could not verify email.");

    return false;
  }
};

export const publishPublicKey = async (email: string, publicKey: string) => {
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
    // Alert.alert(
    //   `Email Sent`,
    //   `Please check your email for instructions from keys.openpgp.org on how to verify your claim.`
    // );
  } catch (error) {
    const err = error as AxiosError;
    console.error(err?.response?.data || error);
  }
};

// create get signature function here too
