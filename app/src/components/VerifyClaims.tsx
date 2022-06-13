import * as React from "react";
import { View, StyleSheet, Text, Alert } from "react-native";
import { Claim } from "../types/claim";
import { Button, FileList } from ".";
import { useDocumentStore } from "../context/DocumentStore";
import { getDocumentFromDocumentId } from "../utils/document-utils";
import { getClaimFromType } from "../utils/claim-utils";
import axios from "axios";

const VerificationFiles: React.FC<{
  claim: Claim;
  selectedFileIds: string[];
  onSelectFile: (fileId: string) => void;
}> = ({ claim, selectedFileIds, onSelectFile }) => {
  const { files } = useDocumentStore();

  const [isVerifying, setIsVerifying] = React.useState<boolean>(false);

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

  const verifyClaims = async () => {
    const name = getClaimFromType("FullNameCredential");
    const birthday = getClaimFromType("DateOfBirthCredential");
    const email = getClaimFromType("EmailCredential");
    const address = getClaimFromType("AddressCredential");
    const documentsBody = {
      name: name.verificationDocuments,
      birthday: birthday.verificationDocuments,
      email: email.verificationDocuments,
      address: address.verificationDocuments
    };
    const body = JSON.stringify(documentsBody);
    console.log(body);
    try {
      setIsVerifying(true);
      if (body) {
        axios.post(body, "https://proxy.idem.com.au/verify");
      }
      setIsVerifying(false);
    } catch (error) {
      console.log(error);
    }
  };

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
      <Button title="Verify your claims with IDEM" onPress={verifyClaims} />
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

export default VerificationFiles;

const styles = StyleSheet.create({
  introText: {
    fontSize: 12
  }
});
