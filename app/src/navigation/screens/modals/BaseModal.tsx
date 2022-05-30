import * as React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Modal from "react-native-modal";

type Props = {
  setVisible: (visibility: boolean) => void;
  visible: boolean;
  children?: React.ReactNode;
}

const BaseModal: React.FC<Props> = props => {
  return (
    <Modal
      isVisible={props.visible}
      style={styles.container}
    >
      <View style={styles.children}>
        {props.children}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    alignItems: "flex-end",
    justifyContent: "flex-start",
    backgroundColor: "white",
    left: -20
  },
  
  children: {
    justifyContent: "flex-start",
    alignItems: "center",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default BaseModal;