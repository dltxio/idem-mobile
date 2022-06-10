import * as React from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import commonStyles from "../../styles/styles";
import { Button, FileList } from "../../components";
import allDocuments from "../../data/documents";
import { useDocumentStore } from "../../context/DocumentStore";
import { DocumentsStackNavigation } from "../../types/navigation";
import { useNavigation } from "@react-navigation/native";
import { DOCUMENT_IMAGE_OPTIONS } from "../../utils/image-utils";
import useSelectPhoto from "../../hooks/useSelectPhoto";
import * as DocumentPicker from "expo-document-picker";
import BottomNavBarSpacer from "../../components/BottomNavBarSpacer";

type Navigation = DocumentsStackNavigation<"Documents">;

const DocumentsScreen: React.FC = () => {
  const { files, addFile, deleteFile } = useDocumentStore();
  const navigation = useNavigation<Navigation>();

  const [selectedDocumentId] = React.useState(
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
      addFile(selectedDocumentId, file.uri);
    }
  };

  const takePhoto = async () => {
    const result = await selectPhotoFromCamera();

    if (result && !result.cancelled) {
      addFile(selectedDocumentId, result.uri);
    }
  };

  const uploadFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "*/*"
      });
      if (res && res.type !== "cancel") {
        addFile(selectedDocumentId, res.uri);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={commonStyles.screenContent}>
      <View style={styles.documentsList}>
        <Text style={commonStyles.text.smallHeading}>Your documents</Text>
        {files.length ? (
          files.length > 4 ? (
            <View style={{ overflow: "scroll" }}>
              <FileList
                files={files}
                onFilePress={navigateToFile}
                isCheckList={false}
                onDeleteFile={deleteFile}
              />
            </View>
          ) : (
            <FileList
              files={files}
              onFilePress={navigateToFile}
              isCheckList={false}
              onDeleteFile={deleteFile}
            />
          )
        ) : (
          <View>
            <Text style={styles.documentsList}>
              You haven't attached any files yet. Get started by selecting a
              document below.
            </Text>
          </View>
        )}
      </View>
      <View style={styles.bottomSection}>
        <Text style={commonStyles.text.smallHeading}>
          Attach a file from your device
        </Text>
        <Text style={styles.label}>Document type</Text>

        <Button title="Take A Photo" onPress={takePhoto} />
        <Button
          title="Select From Camera Roll"
          onPress={pickPhotoFromLibrary}
        />

        <Button title="Select From Device" onPress={uploadFile} />
        <BottomNavBarSpacer />
      </View>
    </View>
  );
};

export default DocumentsScreen;

const styles = StyleSheet.create({
  introText: {
    marginBottom: 10
  },
  documentsList: {
    height: Dimensions.get("window").height * 0.45
  },
  bottomSection: {
    justifyContent: "flex-end",
    height: Dimensions.get("window").height * 0.4
  },
  label: {
    marginTop: 10
  }
});
