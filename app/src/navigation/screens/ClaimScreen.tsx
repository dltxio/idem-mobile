import * as React from "react";
import moment from "moment";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  Keyboard,
  Text,
  Alert,
  ScrollView,
  Dimensions
} from "react-native";
import { Input, Switch } from "@rneui/themed";
import DateTimePicker from "@react-native-community/datetimepicker";
import commonStyles from "../../styles/styles";
import {
  ProfileStackNavigation,
  ProfileStackNavigationRoute
} from "../../types/navigation";
import { getClaimFromType } from "../../utils/claim-utils";
import { Claim } from "../../types/claim";
import { FileList, Button } from "../../components";
import { useClaimsStore } from "../../context/ClaimsStore";
import { useDocumentStore } from "../../context/DocumentStore";
import { getDocumentFromDocumentType } from "../../utils/document-utils";
import BottomNavBarSpacer from "../../components/BottomNavBarSpacer";
import useClaimScreen from "../../hooks/useClaimScreen";

type Navigation = ProfileStackNavigation<"Claim">;

const ClaimScreen: React.FC = () => {
  const route = useRoute<ProfileStackNavigationRoute<"Claim">>();
  const claim = getClaimFromType(route.params.claimType);
  const { addClaim, usersClaims } = useClaimsStore();
  const userClaim = usersClaims.find((c) => c.type === claim.type);
  const [formState, setFormState] = React.useState<{ [key: string]: string }>(
    userClaim?.value || {}
  );

  const navigation = useNavigation<Navigation>();
  const dateRefs = React.useRef<{ [key: string]: any }>({});
  const [showDatePickerForFieldId, setShowDatePickerForFieldId] =
    React.useState<string>();
  const [isVerifying, setIsVerifying] = React.useState<boolean>(false);

  const [rawDate, setRawDate] = React.useState<Date>();

  const {
    loading,
    saveAndCheckBirthday,
    onSelectFile,
    verifyEmail,
    selectedFileIds,
    setLoading,
    setSelectedFileIds
  } = useClaimScreen();

  const showDatePickerFor = (fieldId: string) => {
    Keyboard.dismiss();
    dateRefs.current[fieldId].blur();
    setShowDatePickerForFieldId(fieldId);
  };

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

  const onSave = async () => {
    setLoading(true);
    await addClaim(claim.type, formState, selectedFileIds);
    if (claim.type === "BirthCredential") saveAndCheckBirthday();
    navigation.reset({
      routes: [{ name: "Home" }]
    });
    setLoading(false);
  };

  const documentList =
    claim.verificationAction === "document-upload" ? (
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
    ) : null;

  const canSave =
    claim.fields.filter((field) => formState[field.id]).length ===
      claim.fields.length &&
    ((isVerifying && selectedFileIds.length > 0) || !isVerifying);

  return (
    <View style={commonStyles.screen}>
      <ScrollView style={commonStyles.screenContent}>
        <View>
          {claim.fields.map((field) => {
            const onChange = (value: string) => {
              setFormState((previous) => ({
                ...previous,
                [field.id]: value
              }));
            };

            if (field.type === "text") {
              return (
                <View key={field.id}>
                  <Input
                    label={field.title}
                    clearButtonMode="always"
                    value={formState[field.id]}
                    onChangeText={onChange}
                  />
                  {field.id === "email" ? (
                    <View style={{ marginTop: 385 }}>
                      <Button
                        onPress={() => verifyEmail(formState[field.id])}
                        title="Verify Email Claim"
                      />
                    </View>
                  ) : (
                    <Text></Text>
                  )}
                </View>
              );
            }

            if (field.type === "date") {
              return (
                <Input
                  value={formState[field.id]}
                  key={field.id}
                  label={field.title}
                  ref={(ref) =>
                    (dateRefs.current = {
                      [field.id]: ref
                    })
                  }
                  onFocus={() => showDatePickerFor(field.id)}
                />
              );
            }

            if (field.type === "boolean") {
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
            }
          })}
          {showDatePickerForFieldId && (
            <DateTimePicker
              onChange={(_event, date) => onDateSelect(date)}
              value={rawDate ?? new Date()}
            />
          )}
          {documentList}
        </View>
        <BottomNavBarSpacer />
      </ScrollView>
      <View style={styles.buttonWrapper}>
        <Button
          title={isVerifying ? "Save & Verify" : "Save"}
          disabled={!canSave}
          onPress={onSave}
          loading={loading}
        />
      </View>
    </View>
  );
};

export default ClaimScreen;

const styles = StyleSheet.create({
  introText: {
    marginBottom: 10
  },
  buttonWrapper: {
    bottom: 0,
    width: Dimensions.get("window").width - 40,
    margin: 20
  },
  datePicker: {
    height: 500
  }
});

const VerificationFiles: React.FC<{
  claim: Claim;
  isVerifying: boolean;
  selectedFileIds: string[];
  setIsVerifying: (value: boolean) => void;
  onSelectFile: (fileId: string) => void;
}> = ({
  claim,
  isVerifying,
  selectedFileIds,
  onSelectFile,
  setIsVerifying
}) => {
  const { files } = useDocumentStore();

  const filesThatCanBeUsedToVerify = files.filter((file) =>
    claim.verificationDocuments.includes(file.documentType)
  );

  const filesWithSelected = filesThatCanBeUsedToVerify.map((file) => ({
    ...file,
    selected: selectedFileIds.includes(file.id)
  }));

  const validDocumentNames = claim.verificationDocuments.map((document) => {
    return `\n- ${getDocumentFromDocumentType(document).title}`;
  });

  React.useLayoutEffect(() => {
    if (isVerifying && filesThatCanBeUsedToVerify.length === 0) {
      setIsVerifying(false);
      Alert.alert(
        "No valid documents",
        `Please add one of the following: ${validDocumentNames}`,
        [
          {
            text: "OK",
            style: "destructive"
          }
        ],
        {
          cancelable: true
        }
      );
    }
  }, []);

  return (
    <View>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}
      >
        <Switch
          style={{ marginRight: 20 }}
          value={isVerifying}
          onValueChange={setIsVerifying}
        />
        <Text>Attach a document to this claim</Text>
      </View>
      {isVerifying ? (
        <>
          <Text style={styles.introText}>
            The following documents can be used to verify your{" "}
            {claim.title.toLowerCase()} claim:
          </Text>
          <FileList
            files={filesWithSelected}
            onFilePress={onSelectFile}
            isCheckList={true}
          />
          <BottomNavBarSpacer />
        </>
      ) : null}
    </View>
  );
};
