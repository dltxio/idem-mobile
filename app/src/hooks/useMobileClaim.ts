import { useState } from "react";
import { Alert } from "react-native";
import { AlertTitle } from "../constants/common";
import { useClaimsStore } from "../context/ClaimsStore";
import { Navigation } from "../navigation/screens/ClaimScreens/MobileClaimScreen";
import {
  ClaimType,
  FormState,
  MobileClaimFormState,
  RequestOptResponse
} from "../types/claim";
import useApi from "./useApi";

type Hooks = {
  loading: boolean;
  showOtpDialog: boolean;
  openVerifyOtpScreen: (formState: MobileClaimFormState) => Promise<void>;
  setShowOtpDialog: (show: boolean) => void;
  verifyOtp: (
    otpCode: string | undefined,
    formState: FormState,
    navigation: Navigation,
    claimType: ClaimType
  ) => Promise<void>;
};

const useMobileClaim = (): Hooks => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showOtpDialog, setShowOtpDialog] = useState<boolean>(false);
  const [otpContext, setOtpContext] = useState<RequestOptResponse>();

  const api = useApi();
  const { addClaim } = useClaimsStore();

  const openVerifyOtpScreen = async (newMobileState: MobileClaimFormState) => {
    setLoading(true);

    if (newMobileState.countryCode !== "+61") {
      Alert.alert(
        AlertTitle.Error,
        "IDEM only supports Australian numbers for mobile claims/verification."
      );
      setLoading(false);
      return;
    }

    try {
      const otpResponse = await api.requestOtp({
        mobileNumber: `${newMobileState.countryCode}${newMobileState.number}`
      });
      if (otpResponse.hash && otpResponse.expiryTimestamp) {
        setOtpContext(otpResponse);
        setShowOtpDialog(true);
      }
    } catch (error) {
      Alert.alert(AlertTitle.Error, "Something went wrong.");
    }
    setLoading(false);
  };

  const verifyOtp = async (
    otpCode: string | undefined,
    formState: FormState,
    navigation: Navigation,
    claimType: ClaimType
  ) => {
    if (!otpCode || !otpContext) return;
    const { hash, expiryTimestamp } = otpContext;
    const newMobileState = formState["mobileNumber"];
    try {
      const verifyOtp = await api.verifyOtp({
        hash,
        code: otpCode,
        expiryTimestamp,
        mobileNumber: `${newMobileState.countryCode}${newMobileState.number}`
      });

      if (verifyOtp) {
        await addClaim(claimType, formState, [], true);
        Alert.alert("Your mobile has been verified.");
        navigation.reset({
          routes: [{ name: "Home" }]
        });
      } else {
        Alert.alert("Please try again, verification code invalid.");
      }
    } catch (error: any) {
      Alert.alert(AlertTitle.Error, error?.message);
    }
  };

  return {
    loading,
    showOtpDialog,
    openVerifyOtpScreen,
    setShowOtpDialog,
    verifyOtp
  };
};

export default useMobileClaim;
