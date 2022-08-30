import { ethers } from "ethers";
import { Alert } from "react-native";
import OpenPGP from "react-native-fast-openpgp";
import { AlertTitle, ClaimTypeConstants } from "../constants/common";
import { useClaimsStore } from "../context/ClaimsStore";
import { UsersResponse } from "../types/user";
import { PGP } from "../types/wallet";
import { pgpLocalStorage } from "../utils/local-storage";
import { createRandomPassword } from "../utils/randomPassword-utils";
import useApi from "./useApi";

type Hooks = {
  generateKeyPair: (
    name: string | undefined,
    email: string | undefined
  ) => Promise<void>;
  generateKeyPairFromPrivateKey: (
    privateKey: string | undefined
  ) => Promise<void>;
  verifyPublicKey: (email: string | undefined) => Promise<void>;
};

const usePgp = (): Hooks => {
  const api = useApi();
  const { updateClaim } = useClaimsStore();
  const generateKeyPair = async (
    name: string | undefined,
    email: string | undefined
  ) => {
    if (!name || !email) return;

    try {
      const password = createRandomPassword();
      const { privateKey, publicKey } = await OpenPGP.generate({
        email: email,
        name: name,
        passphrase: password
      });
      const meta = await OpenPGP.getPublicKeyMetadata(publicKey);

      const pgp = {
        privateKey,
        publicKey,
        fingerPrint: meta.fingerprint
      } as PGP;

      await pgpLocalStorage.save(pgp);

      await uploadPublicKey(email, publicKey, password);
    } catch (error) {
      Alert.alert(
        AlertTitle.Error,
        "There was a problem generating your PGP Key. Please try again."
      );
    }
  };

  const generateKeyPairFromPrivateKey = async (
    privateKey: string | undefined
  ) => {
    try {
      if (!privateKey) return;
      const publicKey = await OpenPGP.convertPrivateKeyToPublicKey(privateKey);
      const meta = await OpenPGP.getPrivateKeyMetadata(privateKey);
      const pgp = {
        privateKey: privateKey,
        publicKey: publicKey,
        fingerPrint: meta.fingerprint
      } as PGP;

      await pgpLocalStorage.save(pgp);
      Alert.alert(AlertTitle.Success, "Your PGP key has been saved");
    } catch (error: any) {
      throw new Error(
        `There was a problem generating your public key.\n > ${error.message}`
      );
    }
  };

  const uploadPublicKey = async (
    email: string,
    publicKey: string,
    password: string
  ) => {
    const formattedEmail = email.trim().toLowerCase();
    api
      .uploadPublicKey({
        hashEmail: ethers.utils.hashMessage(formattedEmail),
        publicKeyArmored: publicKey
      })
      .then((result) => {
        if (result) {
          Alert.alert(
            AlertTitle.Success,
            `Your PGP key has been created with the password ${password} and uploaded, please check your email to confirm.`
          );
        } else {
          Alert.alert(AlertTitle.Error, "Your PGP key has not been uploaded");
        }
      })
      .catch((error) => {
        Alert.alert(AlertTitle.Error, error.message);
      });
  };

  const verifyPublicKey = async (email: string | undefined) => {
    if (!email) {
      Alert.alert(AlertTitle.Error, `No email claim found`);
      return;
    }
    api
      .getUser(email)
      .then(async (result: UsersResponse) => {
        if (result.emailVerified) {
          await updateClaim(
            ClaimTypeConstants.EmailCredential,
            { email: email },
            [],
            true
          );
          {
            Alert.alert(`Email Verified`, `Email has been verified`);
          }
        } else {
          Alert.alert(AlertTitle.Error, `Email has not been verified`);
        }
      })
      .catch((error) => {
        Alert.alert(AlertTitle.Error, error.message);
      });
  };
  return {
    generateKeyPair,
    generateKeyPairFromPrivateKey,
    verifyPublicKey
  };
};

export default usePgp;
