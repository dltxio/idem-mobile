import React from "react";
import { ListItem } from "react-native-elements";
import { File } from "../types/document";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { getDocumentFromDocumentId } from "../utils/document-utils";

type FileItem = File & { selected?: boolean };

type Props = {
  files: FileItem[];
  onPress: (fileId: string) => void;
  isCheckList: boolean;
};

const FileList: React.FC<Props> = ({ isCheckList, files, onPress }) => {
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
            onPress={() => onPress(file.id)}
          >
            <ListItem.Content>
              <ListItem.Title>{document.title}</ListItem.Title>
              <ListItem.Subtitle>{file.fileName}</ListItem.Subtitle>
            </ListItem.Content>
            {!isCheckList ? (
              <AntDesign name="right" size={24} color="black" />
            ) : file.selected ? (
              <MaterialIcons
                name="radio-button-checked"
                size={24}
                color="black"
              />
            ) : (
              <MaterialIcons
                name="radio-button-unchecked"
                size={24}
                color="black"
              />
            )}
          </ListItem>
        );
      })}
    </ScrollView>
  );
};

export default FileList;
