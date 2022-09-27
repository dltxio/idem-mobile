import { ScrollView, View, StatusBar } from "react-native";
import ClaimScreenStyles from "../../../styles/ClaimScreenStyles";
import commonStyles from "../../../styles/styles";
import { getUserClaimByType } from "../../../utils/claim-utils";
import { ClaimTypeConstants } from "../../../constants/common";
import { Input } from "@rneui/themed";
import React, { useEffect } from "react";
import { FormState } from "../../../types/claim";
import { Button } from "@rneui/base";
import useBaseClaim from "../../../hooks/useBaseClaim";
import { ProfileStackNavigation } from "../../../types/navigation";
import { useNavigation } from "@react-navigation/native";
import VerificationFiles from "../../../components/VerificationFiles";
import { useClaimsStore } from "../../../context/ClaimsStore";

type Navigation = ProfileStackNavigation<"NameClaim">;

const NameClaimScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const { usersClaims } = useClaimsStore();
  const { claim, userClaim } = getUserClaimByType(
    ClaimTypeConstants.NameCredential,
    usersClaims
  );
  const [formState, setFormState] = React.useState<FormState>(
    userClaim?.value ?? {}
  );

  const {
    loading,
    onSave,
    setIsVerifying,
    isVerifying,
    onSelectFile,
    selectedFileIds,
    setSelectedFileIds
  } = useBaseClaim();

  const isDocumentUploadVerifyAction =
    claim.verificationAction === "document-upload";

  const canSave = formState["firstName"] && formState["lastName"];

  useEffect(() => {
    setSelectedFileIds(userClaim?.files ?? []);
    if ((userClaim?.files?.length ?? 0) > 0) setIsVerifying(true);
  }, []);

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
                  autoCapitalize="none"
                  value={formState[field.id] as string}
                  onChangeText={onChange}
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
          onPress={() =>
            onSave(formState, claim.type, navigation, selectedFileIds)
          }
          disabled={!canSave}
        />
      </View>
    </View>
  );
};

export default NameClaimScreen;
