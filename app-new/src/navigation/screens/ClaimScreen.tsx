import * as React from "react";
import moment from "moment";
import { useNavigation, useRoute } from "@react-navigation/native";
import { View, StyleSheet, Keyboard, Text } from "react-native";
import { Button, Input, Switch } from "react-native-elements";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import commonStyles from "../../styles/styles";
import {
  ProfileStackNavigation,
  ProfileStackNavigationRoute
} from "../../types/navigation";
import { getClaimFromType } from "../../utils/claim-utils";
import { DocumentId } from "../../types/document";
import { Claim } from "../../types/claim";
import { DocumentList } from "../../components";
import { useClaimsStore } from "../../context/ClaimsStore";

type Navigation = ProfileStackNavigation<"Claim">;

const ClaimScreen: React.FC = () => {
  const route = useRoute<ProfileStackNavigationRoute<"Claim">>();
  const claim = getClaimFromType(route.params.claimType);
  const navigation = useNavigation<Navigation>();
  const [formState, setFormState] = React.useState<{ [key: string]: string }>(
    {}
  );
  const { onClaim } = useClaimsStore();
  let dateRefs = React.useRef<{ [key: string]: any }>({});
  const [showDatePickerForFieldId, setShowDatePickerForFieldId] =
    React.useState<string>();
  const [isVerifying, setIsVerifying] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedDocumentId, setSelectedDocumentId] =
    React.useState<DocumentId>();

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
      setFormState(previous => ({
        ...previous,
        [showDatePickerForFieldId]: moment(date).format("DD/MM/YYYY")
      }));
    }

    hideDatePicker();
  };

  const onSubmit = async () => {
    setLoading(true);
    await onClaim(claim.type, formState, undefined);
    navigation.reset({
      routes: [{ name: "Home" }]
    });
    setLoading(false);
  };

  const navigateToDocument = (documentId: DocumentId) => {
    navigation.navigate("Document", {
      documentId,
      onSelect: () => setSelectedDocumentId(documentId)
    });
  };

  const documentList =
    claim.verificationAction === "document-upload" ? (
      <VerificationDocuments
        claim={claim}
        isVerifying={isVerifying}
        setIsVerifying={newValue => {
          setIsVerifying(newValue);
          setSelectedDocumentId(undefined);
        }}
        navigateToDocument={navigateToDocument}
        selectedDocumentId={selectedDocumentId}
      />
    ) : null;

  const canSubmit =
    claim.fields.filter(field => formState[field.id]).length ===
      claim.fields.length &&
    ((isVerifying && selectedDocumentId) || !isVerifying);

  return (
    <View style={[commonStyles.screen, commonStyles.screenContent]}>
      {claim.fields.map(field => {
        const onChange = (value: string) => {
          setFormState(previous => ({
            ...previous,
            [field.id]: value
          }));
        };

        if (field.type === "text") {
          return (
            <Input
              key={field.id}
              label={field.title}
              value={formState[field.id]}
              onChangeText={onChange}
              clearButtonMode="always"
            />
          );
        }

        if (field.type === "date") {
          return (
            <Input
              key={field.id}
              label={field.title}
              value={formState[field.id]}
              ref={ref =>
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
                onValueChange={value => onChange(value ? "true" : "false")}
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
        title={isVerifying ? "Submit & verify" : "Submit"}
        disabled={!canSubmit}
        onPress={onSubmit}
        loading={loading}
        style={styles.verifyButton}
      />
    </View>
  );
};

export default ClaimScreen;

const styles = StyleSheet.create({
  introText: {
    marginBottom: 10
  },
  verifyButton: {
    marginTop: 20
  }
});

const VerificationDocuments: React.FC<{
  claim: Claim;
  isVerifying: boolean;
  selectedDocumentId: DocumentId | undefined;
  setIsVerifying: (value: boolean) => void;
  navigateToDocument: (documentId: DocumentId) => void;
}> = ({
  claim,
  isVerifying,
  selectedDocumentId,
  navigateToDocument,
  setIsVerifying
}) => {
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
          <DocumentList
            documents={claim.verificationDocuments}
            onPress={navigateToDocument}
            selectedDocumentId={selectedDocumentId}
          />
        </>
      ) : null}
    </View>
  );
};
