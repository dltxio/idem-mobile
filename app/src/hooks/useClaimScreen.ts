import axios, { AxiosError } from "axios";
import React from "react";
import { useState } from "react";
import { Alert } from "react-native";
import { useClaimsStore } from "../context/ClaimsStore";
import { ClaimData, UploadPGPKeyResponse, VerifyEmail } from "../types/claim";
import { check18Plus } from "../utils/birthday-utils";
import { pgpLocalStorage } from "../utils/local-storage";

type Hooks = {
  loading: boolean;
  saveAndCheckBirthday: (claims: ClaimData[] | null) => void;
  onSelectFile: (fileId: string) => void;
  selectedFileIds: string[];
  setLoading: (loading: boolean) => void;
  setSelectedFileIds: (selectedFileIds: string[]) => void;
  verifyEmail: (email: string) => void;
};

const useClaimScreen = (): Hooks => {
  const { addClaim } = useClaimsStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [, setIsVerifying] = React.useState<boolean>(false);
  const [, setVerifyEmailRequest] = React.useState<VerifyEmail>();

  const saveAndCheckBirthday = async (claims: ClaimData[] | null) => {
    setLoading(true);
    claims?.map((claim) => {
      const findAge = claims.find((c) => c.type === "18+");
      if (claim.type === "DateOfBirthCredential") {
        if (check18Plus(claim)) {
          save18Claim();
        }
        if (findAge?.value.over18 === "true" && !check18Plus(claim)) {
          addClaim("18+", "false", selectedFileIds);
        }
      }
    });
    setLoading(false);
    return true;
  };

  const save18Claim = async () => {
    setLoading(true);
    await addClaim("18+", "true", selectedFileIds);
    Alert.alert(
      `Over 18`,
      `Your claim for being over 18 years of age has been saved.`,
      [
        {
          text: "OK",
          onPress: () => console.log(""),
          style: "cancel"
        }
      ]
    );
    setLoading(false);
  };

  const onSelectFile = (fileId: string) => {
    if (!selectedFileIds.includes(fileId)) {
      setSelectedFileIds([...selectedFileIds, fileId]);
    } else {
      setSelectedFileIds(selectedFileIds.filter((id) => id !== fileId));
    }
  };

  const verifyEmail = async (email: string) => {
    setIsVerifying(true);
    const armoredKey = await pgpLocalStorage.get();
    if (!armoredKey || armoredKey === null) {
      Alert.alert(
        `ERROR`,
        `Please go to your profile and import your private key first!`,
        [
          {
            text: "Ok",
            onPress: () => console.log("invalid pgp"),
            style: "cancel"
          }
        ]
      );
      return;
    }
    try {
      const uploadResponse = await axios.post<UploadPGPKeyResponse>(
        "https://keys.openpgp.org/vks/v1/upload",
        armoredKey,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      setVerifyEmailRequest({
        token: uploadResponse.data.token,
        addresses: [email]
      });
      try {
        await axios.post("https://keys.openpgp.org/vks/v1/upload", armoredKey, {
          headers: {
            "Content-Type": "application/json"
          }
        });
        Alert.alert(
          `Email Sent`,
          `Please check your email for instructions from keys.openpgp.org on how to verify your claim.`,
          [
            {
              text: "OK",
              onPress: () => console.log(""),
              style: "cancel"
            }
          ]
        );
      } catch (error) {
        const err = error as AxiosError;
        console.error(err?.response?.data || error);
      }
    } catch (error) {
      const err = error as AxiosError;
      console.error(err?.response?.data || error);
    }
    setIsVerifying(false);
  };

  return {
    loading,
    saveAndCheckBirthday,
    onSelectFile,
    verifyEmail,
    selectedFileIds,
    setLoading,
    setSelectedFileIds
  };
};

export default useClaimScreen;
