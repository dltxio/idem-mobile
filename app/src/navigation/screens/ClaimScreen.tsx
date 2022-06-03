import * as React from "react";
import moment from "moment";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  Keyboard,
  Text,
  Alert,
  ScrollView
} from "react-native";
import { Input, Switch } from "react-native-elements";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import commonStyles from "../../styles/styles";
import {
  ProfileStackNavigation,
  ProfileStackNavigationRoute
} from "../../types/navigation";
import { getClaimFromType } from "../../utils/claim-utils";
import { Claim, UploadPGPKeyResponse, VerifyEmail } from "../../types/claim";
import { FileList, Button } from "../../components";
import { useClaimsStore } from "../../context/ClaimsStore";
import { useDocumentStore } from "../../context/DocumentStore";
import { pgpLocalStorage } from "../../utils/local-storage";
import axios, { AxiosError } from "axios";
import { getDocumentFromDocumentId } from "../../utils/document-utils";

type Navigation = ProfileStackNavigation<"Claim">;

const ClaimScreen: React.FC = () => {
  const route = useRoute<ProfileStackNavigationRoute<"Claim">>();
  const claim = getClaimFromType(route.params.claimType);
  const { addClaim, usersClaims } = useClaimsStore();

  const userClaim = usersClaims.find((c) => c.type === claim.type);

  const navigation = useNavigation<Navigation>();
  const [formState, setFormState] = React.useState<{ [key: string]: string }>(
    userClaim?.value || {}
  );
  const dateRefs = React.useRef<{ [key: string]: any }>({});
  const [showDatePickerForFieldId, setShowDatePickerForFieldId] =
    React.useState<string>();
  const [isVerifying, setIsVerifying] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedFileIds, setSelectedFileIds] = React.useState<string[]>([]);
  const [verifyEmailRequest, setVerifyEmailRequest] =
    React.useState<VerifyEmail>();

  const showDatePickerFor = (fieldId: string) => {
    Keyboard.dismiss();
    dateRefs.current[fieldId].blur();
    setShowDatePickerForFieldId(fieldId);
  };

  const hideDatePicker = () => {
    setShowDatePickerForFieldId(undefined);
    Keyboard.dismiss();
  };

  const onDateSelect = (date: Date) => {
    if (showDatePickerForFieldId) {
      setFormState((previous) => ({
        ...previous,
        [showDatePickerForFieldId]: moment(date).format("DD/MM/YYYY")
      }));
    }

    hideDatePicker();
  };

  const onSave = async () => {
    setLoading(true);
    await addClaim(claim.type, formState, selectedFileIds);
    navigation.reset({
      routes: [{ name: "Home" }]
    });
    setLoading(false);
  };

  const onSelectFile = (fileId: string) => {
    if (!selectedFileIds.includes(fileId)) {
      setSelectedFileIds([...selectedFileIds, fileId]);
    } else {
      setSelectedFileIds(selectedFileIds.filter((id) => id !== fileId));
    }
  };

  const verifyEmail = async (email: string) => {
    const armoredKey = await pgpLocalStorage.get();
    try {
      const uploadResponse = await axios.post<UploadPGPKeyResponse>(
        "https://keys.openpgp.org/vks/v1/upload",
        armoredKey,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      setVerifyEmailRequest({
        token: uploadResponse.data.token,
        addresses: [email]
      });
      try {
        const body = JSON.stringify(verifyEmailRequest);
        await axios.post(
          "https://keys.openpgp.org/vks/v1/request-verify",
          body,
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        Alert.alert(
          `EMAIL SENT`,
          `Please check your email for instructions from keys.openpgp.org on how to verify your claim.`,
          [
            {
              text: "OK",
              onPress: () => console.log(""),
              style: "cancel"
            }
          ]
        );
      } catch (error) {
        const err = error as AxiosError;
        console.error(err?.response?.data || error);
      }
    } catch (error) {
      const err = error as AxiosError;
      console.error(err?.response?.data || error);
    }
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
    <ScrollView style={[commonStyles.screen, commonStyles.screenContent]}>
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
                value={formState[field.id]}
                onChangeText={onChange}
                clearButtonMode="always"
              />
              {field.id === "email" ? (
                <Text
                  onPress={() => verifyEmail(formState[field.id])}
                  style={{ paddingBottom: 10 }}
                >
                  Verify your email
                </Text>
              ) : (
                <Text></Text>
              )}
            </View>
          );
        }

        if (field.type === "date") {
          return (
            <Input
              key={field.id}
              label={field.title}
              value={formState[field.id]}
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
                onValueChange={(value) => onChange(value ? "true" : "false")}
              />
            </View>
          );
        }

        if (field.type === "date") {
          return (
            <Input
              key={field.id}
              label={field.title}
              value={formState[field.id]}
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
                onValueChange={(value) => onChange(value ? "true" : "false")}
              />
            </View>
          );
        }
      })}
      {showDatePickerForFieldId && (
        <DateTimePickerModal
          isVisible={true}
          mode="date"
          onConfirm={onDateSelect}
          onCancel={hideDatePicker}
        />
      )}
      {documentList}
      <Button
        title={isVerifying ? "Save & Verify" : "Save"}
        disabled={!canSave}
        onPress={onSave}
        loading={loading}
        style={styles.verifyButton}
      />
    </ScrollView>
  );
};

export default ClaimScreen;

const styles = StyleSheet.create({
  introText: {
    marginBottom: 10
  },
  verifyButton: {
    marginTop: 20,
    marginBottom: 20,
    paddingBottom: 20
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
    claim.verificationDocuments.includes(file.documentId)
  );

  const filesWithSelected = filesThatCanBeUsedToVerify.map((file) => ({
    ...file,
    selected: selectedFileIds.includes(file.id)
  }));

  const validDocumentNames = claim.verificationDocuments.map((document) => {
    return `\n- ${getDocumentFromDocumentId(document).title}`;
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
  }, [isVerifying]);

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
        <Text>I would like to verify my claim</Text>
      </View>
      {isVerifying ? (
        <>
          <Text style={styles.introText}>
            The following documents can be used to verify your{" "}
            {claim.title.toLowerCase()} claim.
          </Text>
          <FileList
            files={filesWithSelected}
            onFilePress={onSelectFile}
            isCheckList={true}
          />
        </>
      ) : null}
    </View>
  );
};
