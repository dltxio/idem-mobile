import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Alert, ScrollView, StatusBar, View } from "react-native";
import { AlertTitle, ClaimTypeConstants } from "../../../constants/common";
import useBaseClaim from "../../../hooks/useBaseClaim";
import ClaimScreenStyles from "../../../styles/ClaimScreenStyles";
import { FormState } from "../../../types/claim";
import { ProfileStackNavigation } from "../../../types/navigation";
import {
  getUserClaimByType,
  keyboardTypeMap
} from "../../../utils/claim-utils";
import commonStyles from "../../../styles/styles";
import { Button, Input } from "@rneui/themed";
import { useClaimsStore } from "../../../context/ClaimsStore";
import isEmail from "validator/lib/isEmail";
import useApi from "../../../hooks/useApi";

type Navigation = ProfileStackNavigation<"EmailClaim">;

const EmailClaimScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const { usersClaims } = useClaimsStore();
  const { claim, userClaim } = getUserClaimByType(
    ClaimTypeConstants.EmailCredential,
    usersClaims
  );
  const [formState, setFormState] = React.useState<FormState>(
    userClaim?.value ?? {}
  );
  const [disableButton, setDisableButton] = React.useState(false);
  const [disabledEmailInput, setDisabledEmailInput] = React.useState(false);
  const { loading, onSave } = useBaseClaim();
  const api = useApi();

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

  const handleSave = async () => {
    if (!isEmail(formState.email as string)) {
      return Alert.alert(
        AlertTitle.Warning,
        "Please enter a valid email address."
      );
    }
    await onSave(formState, claim.type, navigation);
  };

  const handleVerify = async () => {
    if (!isEmail(formState.email as string)) {
      return Alert.alert(
        AlertTitle.Warning,
        "Please enter a valid email address."
      );
    }
    await api
      .createUser({
        email: formState.email as string
      })
      .then(() => {
        Alert.alert("Email Sent", "IDEM has sent a verification email.");
      })
      .catch((error) => {
        Alert.alert(AlertTitle.Error, error);
        throw error;
      });
  };

  return (
    <View style={commonStyles.screen}>
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
                  value={formState[field.id] as string}
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
          onPress={() => handleVerify()}
          disabled={!canSave || disableButton}
        />
      </View>
      <View style={ClaimScreenStyles.buttonWrapper}>
        <Button
          title={"Save"}
          loading={loading}
          onPress={() => handleSave()}
          disabled={!canSave || disableButton}
        />
      </View>
    </View>
  );
};

export default EmailClaimScreen;
