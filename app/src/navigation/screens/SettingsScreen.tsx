import React from "react";
import commonStyles from "../../styles/styles";
import { View, Dimensions, StyleSheet, Linking, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const SettingsScreen: React.FC = () => {
  return (
    <View style={commonStyles.screenContent}>
      <View style={styles.documentsList}>
        <Text style={styles.mitLicense}>
          IDEM is a fully open source application shipped under the MIT licence.
          Feel free to raise an issue on GitHub or contact customer support.
        </Text>
        <AntDesign.Button
          name="right"
          onPress={() => Linking.openURL("mailto:support@dltx.io")}
        >
          Contact Support
        </AntDesign.Button>
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  documentsList: {
    height: Dimensions.get("window").height * 0.25
  },
  mitLicense: {
    marginBottom: 5
  }
});
