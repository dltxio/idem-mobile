import * as React from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import commonStyles from "../../styles/styles";
import { useDocumentStore } from "../../context/DocumentStore";
import { ProfileStackNavigationRoute } from "../../types/navigation";
import { useRoute } from "@react-navigation/native";
import { getDocumentFromDocumentType } from "../../utils/document-utils";

const ViewFile: React.FC = () => {
  const { files } = useDocumentStore();
  const route = useRoute<ProfileStackNavigationRoute<"ViewFile">>();

  const file = files.find((f) => f.id === route.params.fileId);

  if (!file) {
    return null;
  }

  const document = getDocumentFromDocumentType(file.documentType);

  return (
    <ScrollView style={[commonStyles.screen, commonStyles.screenContent]}>
      <StatusBar hidden={false} />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <WebView
          originWhitelist={["*"]}
          source={{
            uri: file.uri
          }}
          style={{ width: 200, height: 200 }}
        />
      </View>
      <View style={{ paddingTop: 10 }}>
        <Text style={styles.title}>Document Type</Text>
        <Text>{document.title}</Text>
        <Text style={styles.title}>SHA256</Text>
        <Text>{file.hashes.sha256}</Text>
        <Text style={styles.title}>KECCAK256</Text>
        <Text>{file.hashes.keccakHash}</Text>
      </View>
    </ScrollView>
  );
};

export default ViewFile;

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    marginTop: 10
  }
});
