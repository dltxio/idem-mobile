import React from "react";
import { Text, View } from "react-native";
import { ListItem } from "react-native-elements";
import { Document, DocumentId } from "../types/document";
import { getClaimFromType } from "../utils/claim-utils";
import { AntDesign } from "@expo/vector-icons";
import { getDocumentsClaims } from "../utils/document-utils";

type Props = {
  documents: Document[];
  onPress: (documentId: DocumentId) => void;
};

const DocumentList: React.FC<Props> = ({ documents, onPress }) => {
  return (
    <View>
      {documents.map(doc => {
        return (
          <ListItem key={doc.id} bottomDivider onPress={() => onPress(doc.id)}>
            <ListItem.Content>
              <ListItem.Title>{doc.title}</ListItem.Title>
              <Text style={{ fontSize: 12 }}>Claims</Text>
              <Text style={{ fontSize: 10 }}>
                {getDocumentsClaims(doc)
                  .map(ct => getClaimFromType(ct).title)
                  .join(", ")}
              </Text>
            </ListItem.Content>
            <AntDesign name="right" size={24} color="black" />
          </ListItem>
        );
      })}
    </View>
  );
};

export default DocumentList;
