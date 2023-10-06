import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Alert, ScrollView, StatusBar, View } from "react-native";
import { AlertTitle, ClaimTypeConstants } from "../../../constants/common";
import ClaimScreenStyles from "../../../styles/ClaimScreenStyles";
import { FormState } from "../../../types/claim";
import { ProfileStackNavigation } from "../../../types/navigation";
import {
  getUserClaimByType,
  keyboardTypeMap
} from "../../../utils/claim-utils";
import commonStyles from "../../../styles/styles";
import { Button, Input } from "@rneui/themed";
import debounce from "lodash.debounce";
import { useClaimsStore } from "../../../context/ClaimsStore";
import isEmail from "validator/lib/isEmail";
import useApi from "../../../hooks/useApi";
import Dialog from "react-native-dialog";

type Navigation = ProfileStackNavigation<"EmailClaim">;

const EmailClaimScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const { usersClaims, addClaim, updateClaim } = useClaimsStore();
  const { claim, userClaim } = getUserClaimByType(
    ClaimTypeConstants.EmailCredential,
    usersClaims
  );
  const [formState, setFormState] = React.useState<FormState>(
    userClaim?.value ?? {}
  );
  const [disableButton, setDisableButton] = React.useState(false);
  const [disabledEmailInput, setDisabledEmailInput] = React.useState(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const api = useApi();

  const [showVerifyEmailDialog, setShowVerifyEmailDialog] =
    React.useState(false);

  const isEmailVerified =
    userClaim?.type === "EmailCredential" && userClaim.verified;

  React.useEffect(() => {
    if (isEmailVerified) {
      setDisableButton(true);
      setDisabledEmailInput(true);
    }
  }, [userClaim]);

  const canSave =
    claim.fields.filter((field) => formState[field.id]).length ===
    claim.fields.length;

  const handleVerifyRequest = async () => {
    if (!isEmail(formState.email)) {
      return Alert.alert(
        AlertTitle.Warning,
        "Please enter a valid email address."
      );
    }
    setLoading(true);
    await api
      .createUser({
        email: formState.email
      })
      .then(() => {
        setShowVerifyEmailDialog(true);
      })
      .catch((error) => {
        Alert.alert(AlertTitle.Error, error.message);
      });
    setLoading(false);
  };

  const handleSubmitVerificationCode = async (
    verificationCode: string | undefined
  ) => {
    if (!verificationCode) return;
    try {
      const isSuccess = await api.verifyEmail({
        email: formState.email,
        verificationCode
      });
      if (isSuccess) {
        await addClaim(claim.type, formState, [], true);
        Alert.alert("Your email has been verified.");
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

  const debouncedUpdateClaim = React.useCallback(
    debounce(async (formState, claim, userClaim) => {
      if (!userClaim) {
        await addClaim(claim.type, formState, [], false);
      } else {
        await updateClaim(claim.type, formState, [], false);
      }
    }, 500),
    []
  );

  React.useEffect(() => {
    debouncedUpdateClaim(formState, claim, userClaim);
  }, [formState]);

  return (
    <View style={commonStyles.screen}>
      <VerifyEmailDialog
        showDialog={showVerifyEmailDialog}
        onCancel={() => setShowVerifyEmailDialog(false)}
        onSubmit={handleSubmitVerificationCode}
      />
      <ScrollView style={commonStyles.screenContent}>
        <View style={ClaimScreenStyles.content}>
          <StatusBar hidden={false} />

          {claim.fields.map((field) => {
            const onChange = (value: string) => {
              setFormState((previous) => ({
                ...previous,
                [field.id]: value
              }));
            };

            return (
              <View key={field.id}>
                <Input
                  label={field.title}
                  clearButtonMode="always"
                  keyboardType={keyboardTypeMap["email"]}
                  autoCapitalize="none"
                  value={formState[field.id]}
                  onChangeText={onChange}
                  disabled={disabledEmailInput}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View style={ClaimScreenStyles.buttonWrapper}>
        <Button
          title={"Verify Email"}
          loading={loading}
          onPress={() => handleVerifyRequest()}
          disabled={!canSave || disableButton}
        />
      </View>
    </View>
  );
};

export default EmailClaimScreen;

const VerifyEmailDialog: React.FC<{
  showDialog: boolean;
  onCancel: () => void;
  onSubmit: (otpCode?: string) => void;
}> = ({ showDialog, onCancel, onSubmit }) => {
  const [input, setInput] = React.useState<string>();

  return (
    <Dialog.Container visible={showDialog} onBackdropPress={onCancel}>
      <Dialog.Title>Enter the verification code</Dialog.Title>
      <Dialog.Input
        onChangeText={setInput}
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
          onSubmit(input);
        }}
        label="OK"
        color="#007ff9"
      />
    </Dialog.Container>
  );
};
