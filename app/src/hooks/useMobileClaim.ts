import { useState } from "react";
import { Alert } from "react-native";
import { AlertTitle, ClaimTypeConstants } from "../constants/common";
import { useClaimsStore } from "../context/ClaimsStore";
import { Navigation } from "../navigation/screens/ClaimScreens/MobileClaimScreen";
import { FormState, RequestOptResponse } from "../types/claim";
import useApi from "./useApi";

type Hooks = {
  loading: boolean;
  showOtpDialog: boolean;
  openVerifyOtpScreen: (mobileNumber: string) => Promise<void>;
  setShowOtpDialog: (show: boolean) => void;
  verifyOtp: (
    otpCode: string | undefined,
    formState: FormState,
    navigation: Navigation,
    claimType: ClaimTypeConstants
  ) => Promise<void>;
};

const useMobileClaim = (): Hooks => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showOtpDialog, setShowOtpDialog] = useState<boolean>(false);
  const [otpContext, setOtpContext] = useState<RequestOptResponse>();

  const api = useApi();
  const { updateClaim } = useClaimsStore();

  const openVerifyOtpScreen = async (mobileNumber: string) => {
    setLoading(true);

    if (!mobileNumber.startsWith("+61") && !mobileNumber.startsWith("0")) {
      Alert.alert(
        AlertTitle.Error,
        "IDEM only supports Australian numbers for mobile claims/verification."
      );
      setLoading(false);
      return;
    }

    try {
      const otpResponse = await api.requestOtp({
        mobileNumber
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
    claimType: ClaimTypeConstants
  ) => {
    if (!otpCode || !otpContext) return;
    const { hash, expiryTimestamp } = otpContext;
    const mobileNumber = formState["mobileNumber"];
    try {
      const verifyOtp = await api.verifyOtp({
        hash,
        code: otpCode,
        expiryTimestamp,
        mobileNumber
      });

      if (verifyOtp) {
        await updateClaim(claimType, formState, [], true);
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
