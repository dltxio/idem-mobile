import * as React from "react";
import { View, StyleSheet, Text } from "react-native";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import { BottomNavBarSpacer, Button, FileList, Modal } from "../../components";
import { useDocumentStore } from "../../context/DocumentStore";
import {
  DocumentsStackNavigation,
  DocumentsStackNavigationRoute
} from "../../types/navigation";
import {
  useFocusEffect,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { Input } from "@rneui/themed";
import useSelectPhoto from "../../hooks/useSelectPhoto";
import { DOCUMENT_IMAGE_OPTIONS } from "../../utils/image-utils";
import * as DocumentPicker from "expo-document-picker";
import { Field } from "../../types/document";
import ModalDropdown from "react-native-modal-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

type Navigation = DocumentsStackNavigation<"DocumentDetail">;

type FormState = {
  [key: string]: string;
};

type ShowDateState = {
  [key: string]: boolean;
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
  const [errorState, setErrorState] = React.useState<FormState>({});
  const [updateDocs, setUpdateDocs] = React.useState<boolean>(false);
  const [showDateState, setShowDateState] = React.useState<ShowDateState>({});

  const selectedDocuments = React.useMemo(
    () => files.filter((file) => document.fileIds?.includes(file.id)),
    [files, updateDocs]
  );

  useFocusEffect(
    React.useCallback(() => {
      document.fileIds = document.fileIds ? document.fileIds : [];
      const newForm = { ...formState };
      document.fields?.forEach((field) => {
        newForm[field.title] = field.value ?? "";
      });
      setFormState(newForm);
    }, [])
  );

  const attachFile = () => {
    setShowAttachModal(true);
  };

  const closeAttachFile = () => {
    setShowAttachModal(false);
  };

  const checkFields = (): boolean => {
    let output = true;
    document.fields?.forEach((field) => {
      if (
        field.valueOptions &&
        !field.valueOptions.includes(formState[field.title])
      ) {
        output = false;
        setErrorState((previous) => ({
          ...previous,
          [field.title]: `Must to be one of ${field.valueOptions?.join(", ")}`
        }));
      } else {
        setErrorState((previous) => ({
          ...previous,
          [field.title]: ""
        }));
      }
    });
    return output;
  };

  const saveButton = () => {
    if (checkFields()) {
      saveDocument();
      navigation.pop();
    }
  };

  const saveDocument = () => {
    document.fields?.forEach((field) => {
      field.value = formState[field.title];
    });
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
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
    const file = await selectPhotoFromCameraRoll();

    if (!file.cancelled) {
      saveFile(file.uri);
    }
  };

  const takePhoto = async () => {
    setShowAttachModal(false);
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
    const result = await selectPhotoFromCamera();
    if (result && !result.cancelled) {
      saveFile(result.uri);
    }
  };

  const uploadFile = async () => {
    setShowAttachModal(false);
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
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
      field.optional || formState[field.title] !== "";
    const allRequiredFieldHaveValue = document.fields?.every(
      eitherOptionalOrNotEmpty
    );
    return !allRequiredFieldHaveValue;
  }, [document, formState]);

  const onChange = React.useCallback(
    (input: string, field: Field) => {
      setFormState((previous) => ({
        ...previous,
        [field.title]: input
      }));
    },
    [setFormState]
  );

  const setShowDate = React.useCallback(
    (input: boolean, field: Field) => {
      setShowDateState((previous) => ({
        ...previous,
        [field.title]: input
      }));
    },
    [setFormState]
  );

  const documentInput = (field: Field) => {
    switch (field.type) {
      case "string":
        return (
          <Input
            label={field.title}
            keyboardType="default"
            autoCapitalize="none"
            value={formState[field.title]}
            onChangeText={(input) => onChange(input, field)}
            errorMessage={errorState[field.title]}
          />
        );
      case "number":
        return (
          <Input
            label={field.title}
            keyboardType="numeric"
            autoCapitalize="none"
            value={formState[field.title]}
            onChangeText={(input) => onChange(input, field)}
            errorMessage={errorState[field.title]}
          />
        );
      case "date":
        return (
          <View>
            <Input
              value={formState[field.title] as string}
              label={field.title}
              onFocus={() => setShowDate(true, field)}
              showSoftInputOnFocus={false}
            />
            {showDateState[field.title] && (
              <DateTimePicker
                onChange={(_event, date) => {
                  setShowDate(false, field);
                  if (_event.type === "set")
                    onChange(moment(date).format("DD/MM/yyyy") ?? "", field);
                }}
                value={new Date()}
              />
            )}
          </View>
        );
      case "dropdown":
        return (
          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownTitle}>{field.title}</Text>
            <View style={styles.dropdownSelect}>
              <View style={styles.flex} />
              <ModalDropdown
                style={styles.flex}
                dropdownStyle={styles.dropdownItems}
                options={field.valueOptions}
                onSelect={(index, value) => onChange(value, field)}
                defaultValue={formState[field.title]}
              />
            </View>
          </View>
        );
      default:
        return (
          <Input
            label={field.title}
            autoCapitalize="none"
            value={formState[field.title]}
            onChangeText={(input) => onChange(input, field)}
            errorMessage={errorState[field.title]}
          />
        );
    }
  };

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
          return <View key={index}>{documentInput(field)}</View>;
        })}
        <View style={styles.fileList}>
          <Text style={styles.fileHeader}>Files</Text>
          {selectedDocuments.length === 0 ? (
            <View>
              <Text>
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
            onPress={saveButton}
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
    height: 130
  },

  fileHeader: {
    fontSize: 20,
    marginBottom: 10
  },

  flex: {
    flex: 1
  },

  dropdownContainer: {
    paddingHorizontal: 10,
    minHeight: 60,
    marginBottom: 20
  },

  dropdownTitle: {
    fontSize: 16,
    color: "#86939e",
    fontWeight: "bold"
  },

  dropdownSelect: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#86939e",
    justifyContent: "flex-end"
  },

  dropdownItems: {
    width: 100
  }
});
