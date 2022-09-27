import { ScrollView, StatusBar, View } from "react-native";
import ClaimScreenStyles from "../../../styles/ClaimScreenStyles";
import { ProfileStackNavigation } from "../../../types/navigation";
import commonStyles from "../../../styles/styles";
import { useNavigation } from "@react-navigation/native";
import {
  getUserClaimByType,
  keyboardTypeMap
} from "../../../utils/claim-utils";
import { ClaimTypeConstants } from "../../../constants/common";
import { FormState } from "../../../types/claim";
import React from "react";
import { FieldType } from "../../../types/document";
import { Input } from "@rneui/themed";
import useBaseClaim from "../../../hooks/useBaseClaim";
import VerificationFiles from "../../../components/VerificationFiles";
import { Button } from "@rneui/base";
import { useClaimsStore } from "../../../context/ClaimsStore";

type Navigation = ProfileStackNavigation<"AddressClaim">;

const AddressClaimScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const { usersClaims } = useClaimsStore();
  const { claim, userClaim } = getUserClaimByType(
    ClaimTypeConstants.AddressCredential,
    usersClaims
  );

  const [formState, setFormState] = React.useState<FormState>(
    userClaim?.value ?? {}
  );

  const { loading, onSave, onSelectFile, selectedFileIds, setSelectedFileIds } =
    useBaseClaim();
  const [isVerifying, setIsVerifying] = React.useState<boolean>(false);

  const isDocumentUploadVerifyAction =
    claim.verificationAction === "document-upload";

  const canSave =
    claim.fields.filter((field) => formState[field.id]).length ===
      claim.fields.length &&
    ((isVerifying && selectedFileIds.length > 0) || !isVerifying);

  React.useEffect(() => {
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
            const possibleType = field.type as Extract<
              FieldType,
              "text" | "number" | "house"
            >; // array.includes doesn't discriminate field.type for us :(
            return (
              <View key={field.id}>
                <Input
                  label={field.title}
                  clearButtonMode="always"
                  keyboardType={keyboardTypeMap[possibleType]}
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
          onPress={() => onSave(formState, claim.type, navigation)}
          disabled={!canSave}
        />
      </View>
    </View>
  );
};

export default AddressClaimScreen;
