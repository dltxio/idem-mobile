import * as React from "react";
import { Dimensions, StyleSheet, View, Text } from "react-native";
import { Button, ListItem } from "react-native-elements";
import BaseModal from "./BaseModal";

const ResetDataModal: React.FC<{
    visible: boolean;
    setVisible: (visible: boolean) => void;
    onPress: () => void;
  }> = (props) => {
    return (
        <BaseModal
          visible={props.visible}
          setVisible={props.setVisible}
        >
          <View style={styles.container}>
            <Text>WARNING: <Text>You are about to wipe all of your data, including:</Text></Text>
            <Text>{'\u2B24'} Files</Text>
            <Text>{'\u2B24'}Claims</Text>
            <Text>{'\u2B24'} Mnemonic</Text>
            <Text>Would you like to continue?</Text>
            <Button onPress={props.onPress} style={styles.button} title={"Reset Data"}/>
            <Button onPress={() => props.setVisible(false)} title="Cancel"/>
          </View>
        </BaseModal>
      );
}

export default ResetDataModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    height: 100,
    color: "black"
  }
});