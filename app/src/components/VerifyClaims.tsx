import * as React from "react";
import { View, StyleSheet, Text, Alert, Dimensions } from "react-native";
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
    const documentTitle = getDocumentFromDocumentId(document).title;
    return `\n- ${documentTitle}`;
  });

  const name = getClaimFromType("FullNameCredential");
  const birthday = getClaimFromType("DateOfBirthCredential");
  const email = getClaimFromType("EmailCredential");
  const address = getClaimFromType("AddressCredential");

  const documentsBody = {
    name: [name.verificationDocuments],
    birthday: [birthday.verificationDocuments],
    email: [email.verificationDocuments],
    address: [address.verificationDocuments]
  };

  const verifyClaims = async () => {
    const body = JSON.stringify(documentsBody);
    try {
      setIsVerifying(true);
      if (body) {
        const response = await axios.post(
          body,
          "https://proxy.idem.com.au/user/verify"
        );
        console.log(response);
        if (response.statusText === "true") {
          console.log("yay");
        }
      }
      Alert.alert(
        "Success!",
        "Your name, date of birth, email, and address have been verified!"
      );
      setIsVerifying(false);
    } catch (error) {
      console.log(error);
    }
  };

  React.useLayoutEffect(() => {
    if (isVerifying && filesThatCanBeUsedToVerify.length === 0) {
      setIsVerifying(false);
      const alertMessage =
        validDocumentNames == [""]
          ? `Please add one of the following: ${validDocumentNames}`
          : `Please make sure you have completed your name, date of birth, email, and address claims and attached either a driver's license or passport to these claims.`;
      Alert.alert(
        "Cannot verify claims",
        alertMessage,
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
      {name.type && (
        <View style={styles.button}>
          <Button title="Verify your claims with IDEM" onPress={verifyClaims} />
        </View>
      )}
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
  },

  button: {
    width: Dimensions.get("window").width * 0.9,
    alignSelf: "center",
    marginBottom: 10
  }
});
