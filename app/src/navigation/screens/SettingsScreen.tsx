import { useNavigation } from "@react-navigation/native";
import React, { useCallback } from "react";
import commonStyles from "../../styles/styles";
import { View, Dimensions, StyleSheet, Linking, Alert } from "react-native";
import { SettingsStackNavigation } from "../../types/navigation";
import { AntDesign } from "@expo/vector-icons";

type Navigation = SettingsStackNavigation<"Settings">;

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const supportURL = "https://idem.com.au/";

  const goToIdem = useCallback(async () => {
    const supported = await Linking.canOpenURL(supportURL);
    if (supported) {
      await Linking.openURL(supportURL);
    }
  }, [supportURL]);

  return (
    <View style={commonStyles.screenContent}>
      <View style={styles.documentsList}>
        <AntDesign.Button name="right" onPress={goToIdem}>
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
