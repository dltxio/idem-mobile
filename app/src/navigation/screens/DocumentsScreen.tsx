import * as React from "react";
import { View, StyleSheet, Text } from "react-native";
import commonStyles from "../../styles/styles";
import { Button, FileList } from "../../components";
import allDocuments from "../../data/documents";
import { useDocumentStore } from "../../context/DocumentStore";
import { DocumentsStackNavigation } from "../../types/navigation";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { DOCUMENT_IMAGE_OPTIONS } from "../../utils/image-utils";
import useSelectPhoto from "../../hooks/useSelectPhoto";

type Navigation = DocumentsStackNavigation<"Documents">;

const DocumentsScreen: React.FC = () => {
  const { files, addFile, deleteFile } = useDocumentStore();
  const navigation = useNavigation<Navigation>();

  const [selectedDocumentId, setSelectedDocumentId] = React.useState(
    allDocuments[allDocuments.length - 1].id
  );

  const { selectPhotoFromCameraRoll, selectPhotoFromCamera } = useSelectPhoto(
    DOCUMENT_IMAGE_OPTIONS
  );

  const navigateToFile = (fileId: string) => {
    navigation.navigate("ViewFile", {
      fileId
    });
  };

  const pickPhotoFromLibrary = async () => {
    const file = await selectPhotoFromCameraRoll();

    if (!file.cancelled) {
      addFile(selectedDocumentId, file);
    }
  };

  const takePhoto = async () => {
    const result = await selectPhotoFromCamera();

    if (result && !result.cancelled) {
      addFile(selectedDocumentId, result);
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
            onFilePress={navigateToFile}
            isCheckList={false}
            onDeleteFile={deleteFile}
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
      <View style={[styles.section, styles.bottomSection]}>
        <Text style={commonStyles.text.smallHeading}>Upload a document to your device</Text>
        <Text style={styles.label}>Document type</Text>
        <Picker
          selectedValue={selectedDocumentId}
          onValueChange={itemValue => setSelectedDocumentId(itemValue)}
          numberOfLines={2}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          {allDocuments.map(doc => (
            <Picker.Item key={doc.id} label={doc.title} value={doc.id} />
          ))}
        </Picker>

        <Button
          title="Take A Photo"
          style={styles.photoButton}
          onPress={takePhoto}
        />
        <Button
          title="Select From Camera Roll"
          style={styles.photoButton}
          onPress={pickPhotoFromLibrary}
        />

      <Button
          title="Select From Device"
          style={styles.photoButton}
          onPress={takePhoto}
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
  },
  bottomSection: {
    justifyContent: "flex-end"
  },
  label: {
    marginTop: 10
  },
  picker: {
    height: 150
  },
  pickerItem: {
    fontSize: 12
  }
});
