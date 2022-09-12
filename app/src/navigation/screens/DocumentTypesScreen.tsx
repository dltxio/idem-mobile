import * as React from "react";
import { View, ScrollView } from "react-native";
import commonStyles from "../../styles/styles";
import BottomNavBarSpacer from "../../components/BottomNavBarSpacer";
import IdemListItem from "../../components/IdemListItem";
import allDocuments from "../../data/documents";
import { Document } from "../../types/document";
import { useNavigation } from "@react-navigation/native";
import { DocumentsStackNavigation } from "../../types/navigation";
import { useDocumentStore } from "../../context/DocumentStore";

type Navigation = DocumentsStackNavigation<"Document Types">;

const DocumentTypesScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const { documents } = useDocumentStore();

  const navigateToDocument = (document: Document) => {
    navigation.navigate("DocumentDetail", { document: document });
  };

  return (
    <View style={commonStyles.screen}>
      <ScrollView style={commonStyles.screenContent}>
        <View>
          {allDocuments.map((document, index) => {
            return (
              <IdemListItem
                title={document.title}
                onPress={async () => {
                  const savedDoc =
                    documents.find((doc) => doc.type === document.type) ??
                    document;
                  navigateToDocument(savedDoc);
                }}
                key={index}
              />
            );
          })}
        </View>
        <BottomNavBarSpacer />
      </ScrollView>
    </View>
  );
};
export default DocumentTypesScreen;
