import React from "react";
import { ListItem, Button } from "react-native-elements";
import { File } from "../types/document";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { getDocumentFromDocumentId } from "../utils/document-utils";
import { StyleSheet, View } from "react-native";
import colors from "../styles/colors";

type FileItem = File & { selected?: boolean };

type Props = {
  files: FileItem[];
  onFilePress: (fileId: string) => void;
  onDeleteFile?: (fileId: string) => void;
  isCheckList: boolean;
};

const DELETE_ICON = { name: "delete", color: "white" };

const FileList: React.FC<Props> = ({
  isCheckList,
  files,
  onFilePress,
  onDeleteFile
}) => {
  return (
    <ScrollView>
      {/* this view is here because without it the swipeable list item explodes */}
      <View>
        {files.map(file => {
          const document = getDocumentFromDocumentId(file.documentId);

          if (!document) {
            return null;
          }

          const content = (
            <>
              <ListItem.Content>
                <ListItem.Title>{document.title}</ListItem.Title>
                <ListItem.Subtitle>{file.name}</ListItem.Subtitle>
              </ListItem.Content>
              {!isCheckList ? (
                <AntDesign name="right" style={styles.icon} />
              ) : file.selected ? (
                <MaterialIcons
                  name="radio-button-checked"
                  style={styles.icon}
                />
              ) : (
                <MaterialIcons
                  name="radio-button-unchecked"
                  style={styles.icon}
                />
              )}
            </>
          );

          if (onDeleteFile) {
            return (
              <ListItem.Swipeable
                key={file.id}
                onPress={() => onFilePress(file.id)}
                rightContent={
                  <Button
                    title="Delete"
                    onPress={() => onDeleteFile(file.id)}
                    icon={DELETE_ICON}
                    buttonStyle={styles.deleteDocumentButton}
                  />
                }
                leftContent={
                  <Button
                    title="Delete"
                    onPress={() => onDeleteFile(file.id)}
                    icon={DELETE_ICON}
                    buttonStyle={styles.deleteDocumentButton}
                  />
                }
              >
                {content}
              </ListItem.Swipeable>
            );
          }

          return (
            <ListItem key={file.id} onPress={() => onFilePress(file.id)}>
              {content}
            </ListItem>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default FileList;

const styles = StyleSheet.create({
  icon: {
    color: colors.black,
    fontSize: 24
  },
  deleteDocumentButton: {
    minHeight: "100%",
    backgroundColor: "red"
  }
});