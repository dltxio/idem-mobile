import * as React from "react";
import { View, StyleSheet, Text } from "react-native";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import { BottomNavBarSpacer, Button, FileList, Modal } from "../../components";
import { useDocumentStore } from "../../context/DocumentStore";
import {
  DocumentsStackNavigation,
  DocumentsStackNavigationRoute
} from "../../types/navigation";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { Input } from "@rneui/themed";
import useSelectPhoto from "../../hooks/useSelectPhoto";
import { DOCUMENT_IMAGE_OPTIONS } from "../../utils/image-utils";
import * as DocumentPicker from "expo-document-picker";
import { Field } from "../../types/document";

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

  const closeAttachFile = () => {
    setShowAttachModal(false);
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

  const shouldDisableSaveButton = React.useMemo(() => {
    const eitherOptionalOrNotEmpty = (field: any) =>
      field.optional || field.value !== "";
    const allRequiredFieldHaveValue = document.fields?.every(
      eitherOptionalOrNotEmpty
    );
    return !allRequiredFieldHaveValue;
  }, [document]);

  const onChange = React.useCallback(
    (input: string, field: Field) => {
      if (!field.valueOptions || field.valueOptions.includes(input)) {
        field.value = input;
        setFormState((previous) => ({
          ...previous,
          [field.title]: input
        }));
      }
    },
    [setFormState]
  );

  return (
    <View>
      <Modal title="" show={showAttachModal} onClose={closeAttachFile}>
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
      <ScrollView style={styles.scrollView}>
        {document?.fields?.map((field, index) => {
          const keyboardType = field.type === "number" ? "numeric" : "default";

          return (
            <Input
              label={field.title}
              clearButtonMode="always"
              keyboardType={keyboardType}
              autoCapitalize="none"
              value={formState[field.title]}
              onChangeText={(input) => onChange(input, field)}
              editable={true}
              key={index}
            />
          );
        })}
        <View style={styles.fileList}>
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
          <Button
            title="Save"
            onPress={saveDocument}
            disabled={shouldDisableSaveButton}
          />
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
  },

  scrollView: {
    marginHorizontal: 20,
    paddingTop: 20
  },

  fileList: {
    height: 100
  }
});
