import * as React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";
import { DocumentList } from "../../components";
import commonStyles from "../../styles/styles";
import {
  ProfileStackNavigation,
  ProfileStackNavigationRoute
} from "../../types/navigation";
import { getClaimFromType } from "../../utils/claim-utils";
import { getDocumentsThatProveClaim } from "../../utils/document-utils";
import { DocumentId } from "../../types/document";

type Navigation = ProfileStackNavigation<"Claim">;

const ClaimScreen: React.FC = () => {
  const route = useRoute<ProfileStackNavigationRoute<"Claim">>();
  const claim = getClaimFromType(route.params.claimType);
  const documents = getDocumentsThatProveClaim(route.params.claimType);
  const navigation = useNavigation<Navigation>();

  const navigateToDocument = (documentId: DocumentId) => {
    navigation.navigate("Document", { documentId });
  };

  let content;

  if (claim.verificationAction === "document-upload") {
    content = (
      <React.Fragment>
        <Text style={styles.introText}>
          The following documents can be used to verify your{" "}
          {claim.title.toLowerCase()} claim.
        </Text>
        <DocumentList documents={documents} onPress={navigateToDocument} />
      </React.Fragment>
    );
  } else {
    content = (
      <React.Fragment>
        <Text style={styles.introText}>Form</Text>
      </React.Fragment>
    );
  }

  return (
    <View style={[commonStyles.screen, commonStyles.screenContent]}>
      {content}
    </View>
  );
};

export default ClaimScreen;

const styles = StyleSheet.create({
  introText: {
    marginBottom: 10
  }
});
