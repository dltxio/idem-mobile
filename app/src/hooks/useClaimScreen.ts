import { useState } from "react";
import { Alert } from "react-native";
import { ClaimTypeConstants } from "../constants/common";
import { useClaimsStore } from "../context/ClaimsStore";
import { ClaimData } from "../types/claim";
import { check18Plus } from "../utils/birthday-utils";

type Hooks = {
  loading: boolean;
  saveAndCheckBirthday: (claims: ClaimData[] | null) => Promise<void>;
  onSelectFile: (fileId: string) => void;
  selectedFileIds: string[];
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

    if (!claim) {
      setLoading(false);
      return;
    }

    const eighteenPlus = check18Plus(claim);

    await addClaim(
      ClaimTypeConstants.AdultCredential,
      { over18: eighteenPlus.toString() },
      selectedFileIds
    );
    if (eighteenPlus) {
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
  };

  const onSelectFile = (fileId: string) => {
    if (!selectedFileIds.includes(fileId)) {
      setSelectedFileIds([...selectedFileIds, fileId]);
    } else {
      setSelectedFileIds(selectedFileIds.filter((id) => id !== fileId));
    }
  };

  return {
    loading,
    saveAndCheckBirthday,
    onSelectFile,
    selectedFileIds,
    setLoading,
    setSelectedFileIds
  };
};

export default useClaimScreen;
