import React from "react";
import { ScrollView, View, StatusBar, Keyboard } from "react-native";
import { ClaimTypeConstants } from "../../../constants/common";
import { FormState } from "../../../types/claim";
import { getUserClaimByType } from "../../../utils/claim-utils";
import commonStyles from "../../../styles/styles";
import ClaimScreenStyles from "../../../styles/ClaimScreenStyles";
import { Input } from "@rneui/themed";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";
import useBaseClaim from "../../../hooks/useBaseClaim";
import { Button } from "@rneui/base";
import { useNavigation } from "@react-navigation/native";
import { ProfileStackNavigation } from "../../../types/navigation";
import VerificationFiles from "../../../components/VerificationFiles";
import { useClaimsStore } from "../../../context/ClaimsStore";

type Navigation = ProfileStackNavigation<"BirthClaim">;

const BirthClaimScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const { usersClaims } = useClaimsStore();
  const { claim, userClaim } = getUserClaimByType(
    ClaimTypeConstants.BirthCredential,
    usersClaims
  );
  const [formState, setFormState] = React.useState<FormState>(
    userClaim?.value ?? {}
  );
  const dateRefs = React.useRef<{ [key: string]: any }>({});
  const [showDatePickerForFieldId, setShowDatePickerForFieldId] =
    React.useState<string>();

  const { loading, onSave, onSelectFile, selectedFileIds, setSelectedFileIds } =
    useBaseClaim();

  const showDatePickerFor = (fieldId: string) => {
    Keyboard.dismiss();
    dateRefs.current[fieldId].blur();
    setShowDatePickerForFieldId(fieldId);
  };

  const [rawDate, setRawDate] = React.useState<Date>();

  const hideDatePicker = () => {
    setShowDatePickerForFieldId(undefined);
    Keyboard.dismiss();
  };

  const onDateSelect = (date: Date | undefined) => {
    if (showDatePickerForFieldId) {
      hideDatePicker();
      setRawDate(date);
      setFormState((previous) => ({
        ...previous,
        [showDatePickerForFieldId]: moment(date).format("DD/MM/YYYY")
      }));
    }
  };

  const canSave = formState["dob"];

  const [isVerifying, setIsVerifying] = React.useState<boolean>(false);

  const isDocumentUploadVerifyAction =
    claim.verificationAction === "document-upload";

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
            return (
              <View key={field.id}>
                <Input
                  value={formState[field.id] as string}
                  key={field.id}
                  label={field.title}
                  ref={(ref: any) =>
                    (dateRefs.current = {
                      [field.id]: ref
                    })
                  }
                  onFocus={() => showDatePickerFor(field.id)}
                />
              </View>
            );
          })}
          {showDatePickerForFieldId && (
            <DateTimePicker
              onChange={(_event, date) => onDateSelect(date)}
              value={rawDate ?? new Date()}
            />
          )}
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

export default BirthClaimScreen;
