import React, { useCallback } from "react";
import commonStyles from "../../styles/styles";
import { View, Dimensions, StyleSheet, Linking } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const SettingsScreen: React.FC = () => {
  return (
    <View style={commonStyles.screenContent}>
      <View style={styles.documentsList}>
        <AntDesign.Button
          name="right"
          onPress={() => Linking.openURL("mailto:support@example.com")}
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
  }
});
