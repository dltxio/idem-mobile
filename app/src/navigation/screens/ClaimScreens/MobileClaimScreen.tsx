import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, StatusBar, View, Text } from "react-native";
import { ClaimTypeConstants } from "../../../constants/common";
import ClaimScreenStyles from "../../../styles/ClaimScreenStyles";
import { FormState, PhoneType } from "../../../types/claim";
import { ProfileStackNavigation } from "../../../types/navigation";
import { getUserClaimByType } from "../../../utils/claim-utils";
import commonStyles from "../../../styles/styles";
import { Button, Input } from "@rneui/themed";
import useMobileClaim from "../../../hooks/useMobileClaim";
import Dialog from "react-native-dialog";
import { useClaimsStore } from "../../../context/ClaimsStore";

export type Navigation = ProfileStackNavigation<"MobileClaim">;

const MobileClaimScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const { usersClaims } = useClaimsStore();
  const { claim, userClaim } = getUserClaimByType(
    ClaimTypeConstants.MobileCredential,
    usersClaims
  );
  const [formState, setFormState] = React.useState<FormState>(
    userClaim?.value ?? {}
  );

  const {
    loading,
    showOtpDialog,
    openVerifyOtpScreen,
    setShowOtpDialog,
    verifyOtp
  } = useMobileClaim();

  const formatMobileNumberState = () => {
    const mobileState = formState["mobileNumber"];
    const newMobileState = {
      countryCode: mobileState.countryCode.trim() ?? "+61",
      number: mobileState.number.replace(/^0/, "")
    };
    setFormState((previous) => ({
      ...previous,
      ["mobileNumber"]: newMobileState
    }));
    return newMobileState;
  };

  const requestOtp = async () => {
    const newMobileState = formatMobileNumberState();
    await openVerifyOtpScreen(newMobileState);
  };
  return (
    <View style={commonStyles.screen}>
      <OtpDialog
        showDialog={showOtpDialog}
        onCancel={() => setShowOtpDialog(false)}
        onSubmit={(otpCode) => {
          verifyOtp(otpCode, formState, navigation, claim.type).then(() => {
            setShowOtpDialog(false);
          });
        }}
      />
      <ScrollView style={commonStyles.screenContent}>
        <View style={ClaimScreenStyles.content}>
          <StatusBar hidden={false} />
          <Text style={ClaimScreenStyles.mobileWarningText}>
            Only Australian mobile numbers are supported, denoted by the +61
            country code.
          </Text>

          {claim.fields.map((field) => {
            const onChange = (value: string | PhoneType) => {
              setFormState((previous) => ({
                ...previous,
                [field.id]: value
              }));
            };
            const phone = (formState[field.id] as PhoneType) ?? {};
            return (
              <View key={field.id}>
                <Input
                  label="Country code"
                  keyboardType="phone-pad"
                  value={phone.countryCode}
                  defaultValue={"+61"}
                  onChangeText={(value) => {
                    onChange({ ...phone, countryCode: value });
                  }}
                  editable={false}
                />

                <Input
                  label={field.title}
                  keyboardType="phone-pad"
                  value={phone.number}
                  onChangeText={(value) => {
                    onChange({
                      countryCode: phone.countryCode ?? "+61",
                      number: value
                    });
                  }}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View style={ClaimScreenStyles.buttonWrapper}>
        <Button
          title="Verify"
          disabled={userClaim?.verified}
          onPress={async () => {
            await requestOtp();
          }}
          loading={loading}
        />
      </View>
    </View>
  );
};

export default MobileClaimScreen;

const OtpDialog: React.FC<{
  showDialog: boolean;
  onCancel: () => void;
  onSubmit: (otpCode?: string) => void;
}> = ({ showDialog, onCancel, onSubmit }) => {
  const [otpCode, setOtpCode] = React.useState<string>();

  return (
    <Dialog.Container visible={showDialog} onBackdropPress={onCancel}>
      <Dialog.Title>Enter your verification code</Dialog.Title>
      <Dialog.Input
        onChangeText={setOtpCode}
        autoFocus={true}
        keyboardType={"number-pad"}
      ></Dialog.Input>
      <Dialog.Button
        onPress={onCancel}
        label="Cancel"
        bold={true}
        color="#007ff9"
      />
      <Dialog.Button
        onPress={() => {
          onSubmit(otpCode);
        }}
        label="OK"
        color="#007ff9"
      />
    </Dialog.Container>
  );
};
