import React from "react";
import { useState } from "react";
import { Alert } from "react-native";
import { useClaimsStore } from "../context/ClaimsStore";
import { ClaimData } from "../types/claim";
import { check18Plus } from "../utils/birthday-utils";
import { pgpLocalStorage } from "../utils/local-storage";
import { verifyPublicKey } from "../utils/pgp-utils";

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

  const saveAndCheckBirthday = async (claims: ClaimData[] | null) => {
    setLoading(true);
    claims?.map((claim) => {
      const findAge = claims.find((c) => c.type === "AdultCredential");
      if (claim.type === "BirthCredential") {
        if (check18Plus(claim)) {
          save18Claim();
        }
        if (findAge?.value.over18 === "true" && !check18Plus(claim)) {
          addClaim("AdultCredential", "false", selectedFileIds);
        }
      }
    });
    setLoading(false);
    return true;
  };

  const save18Claim = async () => {
    await addClaim("AdultCredential", "true", selectedFileIds);
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
    const pgp = await pgpLocalStorage.get();

    if (!pgp || pgp.publicKey === null) {
      Alert.alert(
        `ERROR`,
        `Please go to your profile and import your PGP private key first!`,
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

    const result = await verifyPublicKey(pgp.publicKey);

    if (result) {
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
