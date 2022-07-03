import axios, { AxiosError } from "axios";
import * as openpgp from "openpgp";
import { UploadPGPKeyResponse } from "../types/general";
import type { PGP } from "../types/wallet";

export const generatePGP = async (
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

export const verifyPublicKey = async (publicKey: string): Promise<Boolean> => {
  try {
    // https://keys.openpgp.org/about/api
    const uploadResponse = await axios.post<UploadPGPKeyResponse>(
      "https://keys.openpgp.org/vks/v1/upload",
      {
        keytext: publicKey,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    //console.error(error?.response?.data || error);
    return false;
  }

  return true;
};
