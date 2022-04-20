import * as React from "react";
import { Image, ScrollView, View } from "react-native";
import commonStyles from "../../styles/styles";
import { useDocumentStore } from "../../context/DocumentStore";
import { ProfileStackNavigationRoute } from "../../types/navigation";
import { useRoute } from "@react-navigation/native";

const ViewFile: React.FC = () => {
  const { files } = useDocumentStore();
  const route = useRoute<ProfileStackNavigationRoute<"ViewFile">>();

  const file = files.find(f => f.id === route.params.fileId);

  if (!file) {
    return null;
  }

  return (
    <ScrollView style={[commonStyles.screen, commonStyles.screenContent]}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Image
          source={{
            uri: file.file
          }}
          style={{ width: 200, height: 200 }}
        />
      </View>
    </ScrollView>
  );
};

export default ViewFile;
