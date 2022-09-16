import React from "react";
import { ListItem, Button } from "@rneui/themed";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { StyleSheet, View } from "react-native";
import colors from "../styles/colors";
import { Document } from "../types/document";

type DocumentItem = Document & { selected?: boolean };

type Props = {
  documents: DocumentItem[];
  onItemPress: (fileId: string) => void;
  onDeleteItem?: (fileId: string) => void;
  isCheckList: boolean;
  style?: object;
};

const DELETE_ICON = { name: "delete", color: "white" };

const DocumentList: React.FC<Props> = ({
  isCheckList,
  documents,
  onItemPress,
  onDeleteItem
}) => {
  return (
    <ScrollView>
      {/* this view is here because without it the swipeable list item explodes */}
      <View>
        {documents.map((document) => {
          if (!document || !document.id) {
            return null;
          }

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const docID = document.id!;

          const content = (
            <>
              <ListItem.Content>
                <ListItem.Title>{document.title}</ListItem.Title>
              </ListItem.Content>
              {!isCheckList ? (
                <AntDesign name="right" style={styles.icon} />
              ) : document.selected ? (
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

          if (onDeleteItem) {
            return (
              <ListItem.Swipeable
                key={document.id}
                onPress={() => onItemPress(docID)}
                rightContent={
                  <Button
                    title="Delete"
                    onPress={() => onDeleteItem(docID)}
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
            <ListItem key={docID} onPress={() => onItemPress(docID)}>
              {content}
            </ListItem>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default DocumentList;

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
