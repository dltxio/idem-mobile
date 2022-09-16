import { ethers } from "ethers";
import React, { useState } from "react";
import { Alert } from "react-native";
import OpenPGP from "react-native-fast-openpgp";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
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
    privateKey: string | undefined,
    email: string
  ) => Promise<void>;
  verifyPublicKey: (email: string | undefined) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  importPrivateKeyFileFromDevice: () => Promise<string | undefined>;
  pgp: PGP | undefined;
};

const usePgp = (): Hooks => {
  const api = useApi();
  const [pgp, setPgp] = useState<PGP | undefined>(undefined);
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
      setPgp(pgp);
      await uploadPublicKey(email, publicKey);
      Alert.alert(
        AlertTitle.Success,
        `Your PGP key has been created with the password ${password} and uploaded, please check your email to confirm.`
      );
    } catch (error) {
      Alert.alert(
        AlertTitle.Error,
        "There was a problem generating your PGP Key. Please try again."
      );
    }
  };

  const generateKeyPairFromPrivateKey = async (
    privateKey: string | undefined,
    email: string
  ) => {
    try {
      if (!privateKey || !email) return;
      const publicKey = await OpenPGP.convertPrivateKeyToPublicKey(privateKey);
      const meta = await OpenPGP.getPrivateKeyMetadata(privateKey);
      const pgp = {
        privateKey: privateKey,
        publicKey: publicKey,
        fingerPrint: meta.fingerprint
      } as PGP;

      setPgp(pgp);
      await pgpLocalStorage.save(pgp);
      await uploadPublicKey(email, publicKey);
      Alert.alert(
        AlertTitle.Success,
        "Your PGP key has been saved and uploaded, please check your email to confirm."
      );
    } catch (error: any) {
      throw new Error(
        `There was a problem generating your public key.\n > ${error.message}`
      );
    }
  };

  const uploadPublicKey = async (email: string, publicKey: string) => {
    const formattedEmail = email.trim().toLowerCase();
    await api
      .uploadPublicKey({
        hashEmail: ethers.utils.hashMessage(formattedEmail),
        publicKeyArmored: publicKey
      })
      .catch((error) => {
        Alert.alert(AlertTitle.Error, error.message);
        throw error;
      });
  };

  const resendVerificationEmail = async (email: string) => {
    const formattedEmail = email.trim().toLowerCase();
    await api
      .resendVerificationEmail({
        hashedEmail: ethers.utils.hashMessage(formattedEmail)
      })
      .then((response) => {
        if (response)
          Alert.alert(
            "Email Sent",
            "IDEM has sent another verification email."
          );
      })
      .catch((error) => {
        Alert.alert(AlertTitle.Error, error.message);
        throw error;
      });
  };

  const verifyPublicKey = React.useCallback(
    async (email: string | undefined) => {
      if (!email) {
        Alert.alert(AlertTitle.Error, `No email claim found.`);
        return;
      }
      await api
        .getUser(email)
        .then(async (result: UsersResponse) => {
          if (result.emailVerified) {
            await updateClaim(
              ClaimTypeConstants.EmailCredential,
              { email },
              [],
              true
            );
            {
              Alert.alert(
                AlertTitle.Success,
                "Your PGP key has been successfully verified by IDEM."
              );
            }
          } else {
            Alert.alert(
              `Warning`,
              `Please check your email for a verification link and verify with IDEM once complete.`
            );
          }
        })
        .catch((error) => {
          Alert.alert(AlertTitle.Error, error.message);
        });
    },
    [updateClaim]
  );

  const importPrivateKeyFileFromDevice = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ["*/*"]
    });
    if (res.type === "cancel") return;
    const isCorrectFileType =
      res.name.endsWith(".asc") || res.name.endsWith(".key");
    if (!isCorrectFileType) {
      throw new Error("Invalid file type : expecting .asc or .key");
    }
    const fileContent = await FileSystem.readAsStringAsync(res.uri);
    return fileContent;
  };
  return {
    generateKeyPair,
    generateKeyPairFromPrivateKey,
    verifyPublicKey,
    resendVerificationEmail,
    importPrivateKeyFileFromDevice,
    pgp
  };
};

export default usePgp;
