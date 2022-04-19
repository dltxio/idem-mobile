import * as React from "react";
import { View, StyleSheet, Text } from "react-native";
import commonStyles from "../../styles/styles";
import { Button, FileList } from "../../components";
import allDocuments from "../../data/documents";
import { useDocumentStore } from "../../context/DocumentStore";
import { DocumentsStackNavigation } from "../../types/navigation";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { DOCUMENT_IMAGE_OPTIONS } from "../../utils/document-utils";

type Navigation = DocumentsStackNavigation<"Documents">;

const DocumentsScreen: React.FC = () => {
  const { files, uploadFile } = useDocumentStore();
  const navigation = useNavigation<Navigation>();

  const [selectedDocumentId, setSelectedDocumentId] = React.useState(
    allDocuments[allDocuments.length - 1].id
  );

  const [status, requestPermission] = ImagePicker.useCameraPermissions();

  const navigateToFile = (fileId: string) => {
    navigation.navigate("ViewFile", {
      fileId
    });
  };

  const pickPhotoFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync(
      DOCUMENT_IMAGE_OPTIONS
    );

    if (!result.cancelled) {
      uploadFile(selectedDocumentId, result.uri);
    }
  };

  const takePhoto = async () => {
    let hasPermission = !!status?.granted;

    if (!status?.granted) {
      hasPermission = (await requestPermission()).granted;
    }

    if (!hasPermission) {
      return;
    }
    const result = await ImagePicker.launchCameraAsync(DOCUMENT_IMAGE_OPTIONS);

    if (!result.cancelled) {
      uploadFile(selectedDocumentId, result.uri);
    }
  };

  return (
    <View
      style={[commonStyles.screen, commonStyles.screenContent, styles.screen]}
    >
      <View style={styles.section}>
        <Text style={commonStyles.text.smallHeading}>Your documents</Text>
        {files.length ? (
          <FileList
            files={files}
            onPress={navigateToFile}
            isCheckList={false}
          />
        ) : (
          <View>
            <Text style={styles.emptyClaimsText}>
              You haven't added any documents yet. Get started by uploading a
              document below.
            </Text>
          </View>
        )}
      </View>
      <View style={[styles.section, { justifyContent: "flex-end" }]}>
        <Text style={commonStyles.text.smallHeading}>Upload document</Text>
        <Picker
          selectedValue={selectedDocumentId}
          onValueChange={itemValue => setSelectedDocumentId(itemValue)}
          numberOfLines={2}
          style={{ height: 150 }}
        >
          {allDocuments.map(doc => (
            <Picker.Item key={doc.id} label={doc.title} value={doc.id} />
          ))}
        </Picker>

        <Button
          title="Take photo"
          style={styles.photoButton}
          onPress={takePhoto}
        />
        <Button
          title="Select from photos"
          style={styles.photoButton}
          onPress={pickPhotoFromLibrary}
        />
      </View>
    </View>
  );
};

export default DocumentsScreen;

const styles = StyleSheet.create({
  screen: {
    justifyContent: "space-between",
    marginBottom: 30
  },
  introText: {
    marginBottom: 10
  },
  verifyButton: {
    marginTop: 20
  },
  emptyClaimsText: {
    marginBottom: 10
  },
  photoButton: {
    marginTop: 10
  },
  section: {
    height: "50%"
  }
});
