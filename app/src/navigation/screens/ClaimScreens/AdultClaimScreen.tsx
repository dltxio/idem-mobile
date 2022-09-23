import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, StatusBar, View, Text } from "react-native";
import { ClaimTypeConstants } from "../../../constants/common";
import useBaseClaim from "../../../hooks/useBaseClaim";
import useClaimScreen from "../../../hooks/useClaimScreen";
import ClaimScreenStyles from "../../../styles/ClaimScreenStyles";
import { FormState } from "../../../types/claim";
import { ProfileStackNavigation } from "../../../types/navigation";
import { getUserClaimByType } from "../../../utils/claim-utils";
import commonStyles from "../../../styles/styles";
import { Button, Switch } from "@rneui/themed";
import VerificationFiles from "../../../components/VerificationFiles";

type Navigation = ProfileStackNavigation<"AdultClaim">;

const AdultClaimScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const { claim, userClaim } = getUserClaimByType(
    ClaimTypeConstants.AdultCredential
  );
  const [formState, setFormState] = React.useState<FormState>(
    userClaim?.value ?? {}
  );

  const { loading, onSave } = useBaseClaim();
  const [isVerifying, setIsVerifying] = React.useState<boolean>(false);

  const isDocumentUploadVerifyAction =
    claim.verificationAction === "document-upload";

  const { onSelectFile, selectedFileIds, setSelectedFileIds } =
    useClaimScreen();

  const canSave =
    claim.fields.filter((field) => formState[field.id]).length ===
      claim.fields.length &&
    ((isVerifying && selectedFileIds.length > 0) || !isVerifying);

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
              <View key={field.id} style={{ paddingVertical: 20 }}>
                <Text style={{ marginBottom: 20 }}>{field.title}</Text>
                <Switch
                  value={formState[field.id] === "true"}
                  onValueChange={(value) => {
                    onChange(value ? "true" : "false");
                  }}
                />
              </View>
            );
          })}
          {isDocumentUploadVerifyAction && (
            <VerificationFiles
              claim={claim}
              isVerifying={isVerifying}
              setIsVerifying={(newValue) => {
                setIsVerifying(newValue);
                setSelectedFileIds([]);
              }}
              selectedFileIds={selectedFileIds}
              onSelectFile={onSelectFile}
            />
          )}
        </View>
      </ScrollView>
      <View style={ClaimScreenStyles.buttonWrapper}>
        <Button
          title={"Save"}
          loading={loading}
          onPress={() => onSave(formState, claim.type, navigation)}
          disabled={!canSave}
        />
      </View>
    </View>
  );
};

export default AdultClaimScreen;
