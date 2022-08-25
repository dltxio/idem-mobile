import React from "react";
import commonStyles from "../../styles/styles";
import {
  View,
  Dimensions,
  StyleSheet,
  Linking,
  Text,
  StatusBar
} from "react-native";
import IdemButton from "../../components/Button";

const SettingsScreen: React.FC = () => {
  return (
    <View style={commonStyles.screenContent}>
      <StatusBar hidden={false} />
      <View style={styles.documentsList}>
        <Text style={styles.mitLicense}>
          IDEM is a fully open source application shipped under the MIT licence.
          Feel free to raise an issue on GitHub or contact customer support.
        </Text>
        <IdemButton
          title={"Contact Support"}
          onPress={() => Linking.openURL("mailto:support@dltx.io")}
        />
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
  },
  button: {
    marginVertical: 5,
    alignSelf: "stretch",
    marginHorizontal: 10
  },
  buttonWrapper: {
    justifyContent: "flex-end",
    alignSelf: "stretch"
  }
});
