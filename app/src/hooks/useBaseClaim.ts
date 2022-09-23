import { useState } from "react";
import { Alert } from "react-native";
import { AlertTitle } from "../constants/common";
import { useClaimsStore } from "../context/ClaimsStore";
import { ClaimType, FormState } from "../types/claim";
import { claimsLocalStorage } from "../utils/local-storage";
import useClaimScreen from "./useClaimScreen";
import usePgp from "./usePpg";

type Hooks = {
  onSave: (
    formState: FormState,
    claimType: ClaimType,
    navigation: any
  ) => Promise<void>;
  loading: boolean;
};

const useBaseClaim = (): Hooks => {
  const [loading, setLoading] = useState<boolean>(false);
  const { addClaim } = useClaimsStore();
  const { saveAndCheckBirthday } = useClaimScreen();
  const { verifyPublicKey } = usePgp();
  const onSave = async (
    formState: FormState,
    claimType: ClaimType,
    navigation: any
  ) => {
    setLoading(true);
    try {
      await addClaim(claimType, formState, []);
      const claims = await claimsLocalStorage.get();
      if (claimType === "BirthCredential") await saveAndCheckBirthday(claims);
      if (claimType === "EmailCredential") {
        const email = (formState.email as string).toLowerCase();
        await verifyPublicKey(email);
      }
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

  return {
    onSave,
    loading
  };
};

export default useBaseClaim;
