import React from "react";
import { View } from "react-native";
import { ListItem } from "react-native-elements";
import { DocumentId } from "../types/document";
import { AntDesign } from "@expo/vector-icons";
import allDocuments from "../data/documents";

type Props = {
  documents: DocumentId[];
  onPress: (documentId: DocumentId) => void;
  selectedDocumentId: DocumentId | undefined;
};

const DocumentList: React.FC<Props> = ({
  documents,
  selectedDocumentId,
  onPress
}) => {
  return (
    <View>
      {documents.map(d => {
        const document = allDocuments.find(doc => doc.id === d);

        if (!document) {
          return null;
        }

        return (
          <ListItem
            key={document.id}
            bottomDivider
            onPress={() => onPress(document.id)}
          >
            <ListItem.Content>
              <ListItem.Title>{document.title}</ListItem.Title>
            </ListItem.Content>
            <AntDesign
              name={selectedDocumentId === document.id ? "check" : "right"}
              size={24}
              color="black"
            />
          </ListItem>
        );
      })}
    </View>
  );
};

export default DocumentList;
