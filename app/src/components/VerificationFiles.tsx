import React from "react";
import { Alert, Switch, View, Text } from "react-native";
import { useDocumentStore } from "../context/DocumentStore";
import { Claim } from "../types/claim";
import { getDocumentFromDocumentType } from "../utils/document-utils";
import BottomNavBarSpacer from "./BottomNavBarSpacer";
import { DocumentList } from "../components";
import ClaimScreenStyles from "../styles/ClaimScreenStyles";

type Hooks = {
  claim: Claim;
  isVerifying: boolean;
  selectedFileIds: string[];
  setIsVerifying: (value: boolean) => void;
  onSelectFile: (fileId: string) => void;
};

const VerificationFiles: React.FC<Hooks> = ({
  claim,
  isVerifying,
  selectedFileIds,
  onSelectFile,
  setIsVerifying
}) => {
  const { documents } = useDocumentStore();

  const documentsThatCanBeUsedToVerify = documents.filter((document) =>
    claim.verificationDocuments.includes(document.type)
  );

  const documentsWithSelected = documentsThatCanBeUsedToVerify.map(
    (document) => ({
      ...document,
      selected: selectedFileIds.includes(document.id ?? "")
    })
  );

  const validDocumentNames = claim.verificationDocuments.map((document) => {
    return `- ${getDocumentFromDocumentType(document).title}`;
  });

  React.useLayoutEffect(() => {
    if (isVerifying && documentsThatCanBeUsedToVerify.length === 0) {
      setIsVerifying(false);
      Alert.alert(
        "No valid documents",
        `Please add one of the following: \n${validDocumentNames.join("\n")}`,
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
        <Text>Attach a document to this claim</Text>
      </View>
      {isVerifying ? (
        <>
          <Text style={ClaimScreenStyles.introText}>
            The following documents can be used to verify your{" "}
            {claim.title.toLowerCase()} claim:
          </Text>
          <DocumentList
            documents={documentsWithSelected}
            onItemPress={onSelectFile}
            isCheckList={true}
          />
          <BottomNavBarSpacer />
        </>
      ) : null}
    </View>
  );
};

export default VerificationFiles;
