import { useState } from "react";
import { Alert } from "react-native";
import { AlertTitle, ClaimTypeConstants } from "../constants/common";
import { useClaimsStore } from "../context/ClaimsStore";
import { ClaimData, FormState } from "../types/claim";
import { check18Plus } from "../utils/birthday-utils";
import { claimsLocalStorage } from "../utils/local-storage";

type Hooks = {
  onSave: (
    formState: FormState,
    claimType: ClaimTypeConstants,
    navigation: any,
    files?: string[]
  ) => Promise<void>;
  loading: boolean;
  onSelectFile: (fileId: string) => void;
  setIsVerifying: (isVerifying: boolean) => void;
  isVerifying: boolean;
  selectedFileIds: string[];
  setSelectedFileIds: (selectedFileIds: string[]) => void;
};

const useBaseClaim = (): Hooks => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const { addClaim } = useClaimsStore();

  const onSave = async (
    formState: FormState,
    claimType: ClaimTypeConstants,
    navigation: any,
    files?: string[]
  ) => {
    setLoading(true);
    try {
      await addClaim(claimType, formState, files ?? []);
      const claims = await claimsLocalStorage.get();
      if (claimType === ClaimTypeConstants.BirthCredential)
        await saveAndCheckBirthday(claims);
    } catch (error) {
      setLoading(false);
      Alert.alert(
        AlertTitle.Error,
        "There was a problem saving your name claim. Please try again."
      );
    }
    setLoading(false);

    navigation.reset({
      routes: [{ name: "Home" }]
    });
  };

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
    onSave,
    loading,
    setIsVerifying,
    isVerifying,
    onSelectFile,
    selectedFileIds,
    setSelectedFileIds
  };
};

export default useBaseClaim;
