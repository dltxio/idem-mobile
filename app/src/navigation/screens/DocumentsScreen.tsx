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
import { Picker } from "@react-native-picker/picker";

type Navigation = DocumentsStackNavigation<"Documents">;

const DocumentsScreen: React.FC = () => {
  const { files, addFile, deleteFile } = useDocumentStore();
  const navigation = useNavigation<Navigation>();

  const [selectedDocumentType, setSelectedDocumentType] = React.useState(
    allDocuments[allDocuments.length - 1].type
  );

  const { selectPhotoFromCameraRoll, selectPhotoFromCamera } = useSelectPhoto(
    DOCUMENT_IMAGE_OPTIONS
  );

  const selectedDocuments = React.useMemo(
    () => files.filter((file) => file.documentType === selectedDocumentType),
    [files, selectedDocumentType]
  );

  const navigateToFile = (fileId: string) => {
    navigation.navigate("ViewFile", {
      fileId
    });
  };

  const pickPhotoFromLibrary = async () => {
    const file = await selectPhotoFromCameraRoll();

    if (!file.cancelled) {
      addFile(selectedDocumentType, file.uri);
    }
  };

  const takePhoto = async () => {
    const result = await selectPhotoFromCamera();
    if (result && !result.cancelled) {
      addFile(selectedDocumentType, result.uri);
    }
  };

  const uploadFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "*/*"
      });
      if (res && res.type !== "cancel") {
        addFile(selectedDocumentType, res.uri);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={commonStyles.screenContent}>
      <View style={styles.documentsList}>
        <Text style={commonStyles.text.smallHeading}>Your documents</Text>

        {selectedDocuments.length === 0 && (
          <View>
            <Text style={styles.documentsList}>
              You haven't attached any files yet. Get started by selecting a
              document below.
            </Text>
          </View>
        )}

        {selectedDocuments.length > 0 && selectedDocuments.length < 3 && (
          <FileList
            files={selectedDocuments}
            onFilePress={navigateToFile}
            isCheckList={false}
            onDeleteFile={deleteFile}
          />
        )}

        {selectedDocuments.length >= 3 && (
          <View style={{ overflow: "scroll" }}>
            <FileList
              files={selectedDocuments}
              onFilePress={navigateToFile}
              isCheckList={false}
              onDeleteFile={deleteFile}
            />
          </View>
        )}
      </View>
      <View style={styles.bottomSection}>
        <Text style={commonStyles.text.smallHeading}>
          Attach a file from your device
        </Text>
        <Text style={styles.label}>Document type</Text>
        <Picker
          selectedValue={selectedDocumentType}
          onValueChange={(itemValue) => setSelectedDocumentType(itemValue)}
          numberOfLines={2}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          {allDocuments.map((doc) => (
            <Picker.Item key={doc.type} label={doc.title} value={doc.type} />
          ))}
        </Picker>

        <Button
          title="Take A Photo"
          onPress={takePhoto}
          style={styles.button}
        />
        <Button
          title="Select From Camera Roll"
          onPress={pickPhotoFromLibrary}
          style={styles.button}
        />

        <Button
          title="Select From Device"
          onPress={uploadFile}
          style={styles.button}
        />
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
    height: Dimensions.get("window").height * 0.28
  },
  bottomSection: {
    justifyContent: "flex-end",
    height: Dimensions.get("window").height * 0.6
  },
  label: {
    marginTop: 10
  },
  button: {
    marginVertical: 5
  },
  picker: {
    height: 150
  },
  pickerItem: {
    fontSize: 12
  }
});
