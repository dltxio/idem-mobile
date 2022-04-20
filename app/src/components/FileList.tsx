import React from "react";
import { ListItem } from "react-native-elements";
import { File } from "../types/document";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { getDocumentFromDocumentId } from "../utils/document-utils";
import { StyleSheet } from "react-native";
import colors from "../styles/colors";

type FileItem = File & { selected?: boolean };

type Props = {
  files: FileItem[];
  onFilePress: (fileId: string) => void;
  isCheckList: boolean;
};

const FileList: React.FC<Props> = ({ isCheckList, files, onFilePress }) => {
  return (
    <ScrollView>
      {files.map(file => {
        const document = getDocumentFromDocumentId(file.documentId);

        if (!document) {
          return null;
        }

        return (
          <ListItem
            key={file.id}
            bottomDivider
            onPress={() => onFilePress(file.id)}
          >
            <ListItem.Content>
              <ListItem.Title>{document.title}</ListItem.Title>
              <ListItem.Subtitle>{file.name}</ListItem.Subtitle>
            </ListItem.Content>
            {!isCheckList ? (
              <AntDesign name="right" style={styles.icon} />
            ) : file.selected ? (
              <MaterialIcons name="radio-button-checked" style={styles.icon} />
            ) : (
              <MaterialIcons
                name="radio-button-unchecked"
                style={styles.icon}
              />
            )}
          </ListItem>
        );
      })}
    </ScrollView>
  );
};

export default FileList;

const styles = StyleSheet.create({
  icon: {
    color: colors.black,
    fontSize: 24
  }
});
