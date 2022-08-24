import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { useState } from "react";
import { Alert } from "react-native";
import { ClaimTypeConstants } from "../constants/common";
import { useClaimsStore } from "../context/ClaimsStore";
import { ClaimData } from "../types/claim";
import { ProfileStackNavigationRoute } from "../types/navigation";
import { check18Plus } from "../utils/birthday-utils";
import { getClaimFromType } from "../utils/claim-utils";
import { claimsLocalStorage } from "../utils/local-storage";

type PhoneType = {
  countryCode: string;
  number: string;
};

type FormState = {
  [key: string]: string | PhoneType;
  mobileNumber: PhoneType;
};

type Hooks = {
  loading: boolean;
  saveAndCheckBirthday: (claims: ClaimData[] | null) => void;
  onSelectFile: (fileId: string) => void;
  selectedFileIds: string[];
  addingAClaim: () => void;
  setLoading: (loading: boolean) => void;
  setSelectedFileIds: (selectedFileIds: string[]) => void;
};

const useClaimScreen = (): Hooks => {
  const { addClaim } = useClaimsStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const saveAndCheckBirthday = async (claims: ClaimData[] | null) => {
    setLoading(true);
    const claim = claims?.find(
      (claim) => claim.type === ClaimTypeConstants.BirthCredential
    );

    if (claim && check18Plus(claim)) {
      await addClaim(
        ClaimTypeConstants.AdultCredential,
        { over18: "true" },
        selectedFileIds
      );
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
    }
    setLoading(false);
    return true;
  };

  const addingAClaim = async () => {
    const route = useRoute<ProfileStackNavigationRoute<"Claim">>();
    const { addClaim, usersClaims } = useClaimsStore();
    const userClaim = usersClaims.find((c) => c.type === claim.type);
    const [formState] = React.useState<FormState>(
      userClaim?.value ?? {}
    );
    const claim = getClaimFromType(route.params.claimType);
    await addClaim(claim.type, formState, selectedFileIds);
    const claims = await claimsLocalStorage.get();
    if (claim.type === "BirthCredential") saveAndCheckBirthday(claims);
  };

  const onSelectFile = (fileId: string) => {
    if (!selectedFileIds.includes(fileId)) {
      setSelectedFileIds([...selectedFileIds, fileId]);
    } else {
      setSelectedFileIds(selectedFileIds.filter((id) => id !== fileId));
    }
  };

  return {
    addingAClaim,
    loading,
    saveAndCheckBirthday,
    onSelectFile,
    selectedFileIds,
    setLoading,
    setSelectedFileIds
  };
};

export default useClaimScreen;
