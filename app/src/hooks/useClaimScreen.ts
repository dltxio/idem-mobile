import { useState } from "react";
import { Alert } from "react-native";
import { useClaimsStore } from "../context/ClaimsStore";
import { check18Plus } from "../utils/birthday-utils";
import { claimsLocalStorage } from "../utils/local-storage";

type Hooks = {
  loading: boolean;
  saveAndCheckBirthday: () => void;
  onSelectFile: (fileId: string) => void;
  selectedFileIds: string[];
  setLoading: (loading: boolean) => void;
  setSelectedFileIds: (selectedFileIds: string[]) => void;
};
const useClaimScreen = (): Hooks => {
  const { addClaim } = useClaimsStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);

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
  const saveAndCheckBirthday = async () => {
    setLoading(true);
    const claims = await claimsLocalStorage.get();
    const findBirthday = claims?.map((claim) => {
      if (claim.type === "DateOfBirthCredential") {
        if (check18Plus(claim)) {
          Alert.alert(
            "18+ detected",
            "IDEM has detected that your are over 18. Would you like to update your 18+ claim accordingly?",
            [
              {
                text: "OK",
                onPress: save18Claim
              },
              {
                text: "Cancel",
                style: "cancel"
              }
            ],
            {
              cancelable: true
            }
          );
        }
      }
      return null;
    });
    setLoading(false);
    return findBirthday;
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
