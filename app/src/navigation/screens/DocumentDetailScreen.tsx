import * as React from "react";
import { View, StyleSheet, Text } from "react-native";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import { Button, FileList, Modal } from "../../components";
import { useDocumentStore } from "../../context/DocumentStore";
import {
  DocumentsStackNavigation,
  DocumentsStackNavigationRoute
} from "../../types/navigation";
import { useNavigation, useRoute } from "@react-navigation/native";
import BottomNavBarSpacer from "../../components/BottomNavBarSpacer";
import { ScrollView } from "react-native-gesture-handler";
import { Input } from "@rneui/themed";
import useSelectPhoto from "../../hooks/useSelectPhoto";
import { DOCUMENT_IMAGE_OPTIONS } from "../../utils/image-utils";
import * as DocumentPicker from "expo-document-picker";

type Navigation = DocumentsStackNavigation<"DocumentDetail">;

type FormState = {
  [key: string]: string;
};

const DocumentDetailScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<DocumentsStackNavigationRoute<"DocumentDetail">>();
  const document = route.params.document;

  const { files, addFile, deleteFile, addDocument } = useDocumentStore();
  const { selectPhotoFromCameraRoll, selectPhotoFromCamera } = useSelectPhoto(
    DOCUMENT_IMAGE_OPTIONS
  );

  const [showAttachModal, setShowAttachModal] = React.useState<boolean>(false);
  const [formState, setFormState] = React.useState<FormState>({});
  const [updateDocs, setUpdateDocs] = React.useState<boolean>(false);

  const selectedDocuments = React.useMemo(
    () => files.filter((file) => document.fileIds?.includes(file.id)),
    [files, updateDocs]
  );

  React.useEffect(() => {
    document.fileIds = document.fileIds ? document.fileIds : [];
    const newForm = { ...formState };
    document.fields?.forEach((field) => {
      newForm[field.title] = field.value ?? "";
    });
    setFormState(newForm);
  }, []);

  const attachFile = () => {
    setShowAttachModal(true);
  };

  const saveDocument = () => {
    addDocument(document);
  };

  const saveFile = async (uri: string) => {
    const fileId = await addFile(document.type, uri);
    document.fileIds?.push(fileId);
    setUpdateDocs(!updateDocs);
    saveDocument();
  };

  const _deleteFile = (fileId: string) => {
    document.fileIds = document.fileIds?.filter((id) => id !== fileId);
    deleteFile(fileId);
  };

  const pickPhotoFromLibrary = async () => {
    setShowAttachModal(false);
    const file = await selectPhotoFromCameraRoll();

    if (!file.cancelled) {
      saveFile(file.uri);
    }
  };

  const takePhoto = async () => {
    setShowAttachModal(false);
    const result = await selectPhotoFromCamera();
    if (result && !result.cancelled) {
      saveFile(result.uri);
    }
  };

  const uploadFile = async () => {
    setShowAttachModal(false);
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "*/*"
      });
      if (res && res.type !== "cancel") {
        saveFile(res.uri);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const navigateToFile = (fileId: string) => {
    navigation.navigate("ViewFile", {
      fileId
    });
  };

  const savable = (): boolean => {
    let savable = true;
    document.fields?.forEach((field) => {
      if (!field.optional && field.value === "") savable = false;
    });
    return savable;
  };

  return (
    <View>
      <Modal
        title=""
        show={showAttachModal}
        onClose={() => setShowAttachModal(false)}
      >
        <View style={styles.button}>
          <Button
            title="Select From Device"
            onPress={uploadFile}
            style={styles.button}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="Take A Photo"
            onPress={takePhoto}
            style={styles.button}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="Select From Camera Roll"
            onPress={pickPhotoFromLibrary}
            style={styles.button}
          />
        </View>
      </Modal>
      <ScrollView style={{ marginHorizontal: 20, paddingTop: 20 }}>
        {document?.fields?.map((field, index) => {
          let keyboardType: "default" | "numeric" = "default";
          if (field.type === "number") keyboardType = "numeric";
          const onChange = (input: string) => {
            if (!field.valueOptions || field.valueOptions.includes(input)) {
              field.value = input;
              setFormState((previous) => ({
                ...previous,
                [field.title]: input
              }));
            }
          };
          return (
            <Input
              label={field.title}
              clearButtonMode="always"
              keyboardType={keyboardType}
              autoCapitalize="none"
              value={formState[field.title]}
              onChangeText={onChange}
              editable={true}
              key={index}
            />
          );
        })}
        <View style={{ height: 100 }}>
          {selectedDocuments.length === 0 ? (
            <View>
              <Text style={{}}>
                You haven't attached any files yet. Get started by selecting a
                document below.
              </Text>
            </View>
          ) : (
            <View>
              <FileList
                files={selectedDocuments}
                onFilePress={navigateToFile}
                isCheckList={false}
                onDeleteFile={_deleteFile}
              />
            </View>
          )}
        </View>
        <View style={styles.button}>
          <Button title="Attach" onPress={attachFile} />
        </View>
        <View style={styles.button}>
          <Button title="Save" onPress={saveDocument} disabled={!savable()} />
        </View>
        <BottomNavBarSpacer />
      </ScrollView>
    </View>
  );
};

export default connectActionSheet(DocumentDetailScreen);

const styles = StyleSheet.create({
  button: {
    marginVertical: 5
  }
});
