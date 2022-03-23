import * as React from "react";
import { Image, ScrollView, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Button } from "react-native-elements";
import commonStyles from "../../styles/styles";
import { useDocumentStore } from "../../context/DocumentStore";
import {
  ProfileStackNavigation,
  ProfileStackNavigationRoute
} from "../../types/navigation";
import { useNavigation, useRoute } from "@react-navigation/native";

type Navigation = ProfileStackNavigation<"Document">;

const DocumentScreen: React.FC = () => {
  const { documents, uploadDocument } = useDocumentStore();
  const route = useRoute<ProfileStackNavigationRoute<"Document">>();
  const navigation = useNavigation<Navigation>();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.cancelled) {
      uploadDocument(route.params.documentId, result.uri);
    }
  };

  const goBack = () => {
    navigation.goBack();
    route.params.onSelect();
  };

  const document = documents.find(doc => doc.id === route.params.documentId);

  return (
    <ScrollView style={[commonStyles.screen, commonStyles.screenContent]}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {document ? (
          <Image
            source={{
              uri: document.file
            }}
            style={{ width: 200, height: 200 }}
          />
        ) : (
          <Button title="Pick an image from camera roll" onPress={pickImage} />
        )}
      </View>
      {document ? (
        <Button title="Select" onPress={goBack} style={{ marginTop: 20 }} />
      ) : null}
    </ScrollView>
  );
};

export default DocumentScreen;
