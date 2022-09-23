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
import PgpSection from "../../../components/PgpSection";
import usePgp from "../../../hooks/usePpg";

type Navigation = ProfileStackNavigation<"EmailClaim">;

const EmailClaimScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const { claim, userClaim } = getUserClaimByType(
    ClaimTypeConstants.EmailCredential
  );
  const [formState, setFormState] = React.useState<FormState>(
    userClaim?.value ?? {}
  );
  const [disableButton, setDisableButton] = React.useState(false);
  const [disabledEmailInput, setDisabledEmailInput] = React.useState(false);
  const { loading, onSave } = useBaseClaim();

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

  const [hasPgp, setHasPgp] = React.useState<boolean>(false);
  const {
    pgpKey,
    generateKeyPair,
    generateKeyPairFromPrivateKey,
    resendVerificationEmail,
    importPrivateKeyFileFromDevice
  } = usePgp();

  React.useEffect(() => {
    if (pgpKey) {
      setHasPgp(true);
    }
  }, [pgpKey]);

  const handleSave = async () => {
    await onSave(formState, claim.type, navigation);
    if (!hasPgp) {
      return Alert.alert(
        AlertTitle.Warning,
        "Your Email has been saved, please add a PGP key to verify your email."
      );
    }
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
        <PgpSection
          emailInput={formState["email"] as string}
          isEmailVerified={isEmailVerified}
          generateKeyPair={generateKeyPair}
          generateKeyPairFromPrivateKey={generateKeyPairFromPrivateKey}
          resendVerificationEmail={resendVerificationEmail}
          importPrivateKeyFileFromDevice={importPrivateKeyFileFromDevice}
        />
        <View
          style={{
            justifyContent: "flex-end",
            alignSelf: "stretch",
            marginTop: 20
          }}
        >
          <Button
            title={hasPgp ? "Verify" : "Save"}
            loading={loading}
            onPress={() => handleSave()}
            disabled={!canSave || disableButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default EmailClaimScreen;
