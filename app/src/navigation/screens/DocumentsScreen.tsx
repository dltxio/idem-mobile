import * as React from "react";
import { View, StyleSheet, Text } from "react-native";
import commonStyles from "../../styles/styles";
import { DocumentList } from "../../components";
import allDocuments from "../../data/documents";
import { useDocumentStore } from "../../context/DocumentStore";
import { DocumentsStackNavigation } from "../../types/navigation";
import { DocumentId } from "../../types/document";
import { useNavigation } from "@react-navigation/native";

type Navigation = DocumentsStackNavigation<"Documents">;

const DocumentsScreen: React.FC = () => {
  const { documents } = useDocumentStore();
  const navigation = useNavigation<Navigation>();

  const uploadedDocuments = allDocuments.filter(doc =>
    documents.find(d => d.id === doc.id)
  );

  const notUploadedDocuments = allDocuments.filter(
    doc => !uploadedDocuments.find(d => d.id === doc.id)
  );

  const navigateToDocument = (documentId: DocumentId) => {
    navigation.navigate("Document", {
      documentId
    });
  };

  return (
    <View style={[commonStyles.screen, commonStyles.screenContent]}>
      <Text style={commonStyles.text.smallHeading}>Your documents</Text>
      {uploadedDocuments.length ? (
        <DocumentList
          documents={uploadedDocuments.map(d => d.id)}
          onPress={navigateToDocument}
          selectedDocumentId={undefined}
        />
      ) : (
        <View>
          <Text style={styles.emptyClaimsText}>
            You haven't added any documents yet. Get started by uploading a
            document below.
          </Text>
        </View>
      )}
      {notUploadedDocuments.length ? (
        <>
          <Text style={commonStyles.text.smallHeading}>All documents</Text>
          <DocumentList
            documents={notUploadedDocuments.map(d => d.id)}
            onPress={navigateToDocument}
            selectedDocumentId={undefined}
          />
        </>
      ) : null}
    </View>
  );
};

export default DocumentsScreen;

const styles = StyleSheet.create({
  introText: {
    marginBottom: 10
  },
  verifyButton: {
    marginTop: 20
  },
  emptyClaimsText: {
    marginBottom: 10
  }
});
