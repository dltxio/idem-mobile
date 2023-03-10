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

type Navigation = DocumentsStackNavigation<"Documents">;

const DocumentTypesScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const { documents } = useDocumentStore();

  const onPressDocument = (document: Document) => {
    const savedDoc =
      documents.find((doc) => doc.type === document.type) ?? document;
    navigation.navigate("DocumentDetail", { document: savedDoc });
  };

  return (
    <View style={commonStyles.screen}>
      <ScrollView style={commonStyles.screenContent}>
        <View>
          {allDocuments.map((document) => (
            <IdemListItem
              title={document.title}
              onPress={() => onPressDocument(document)}
              key={document.type}
            />
          ))}
        </View>
        <BottomNavBarSpacer />
      </ScrollView>
    </View>
  );
};
export default DocumentTypesScreen;
