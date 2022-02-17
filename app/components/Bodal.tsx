import React from "react";
import { Modal, View, TouchableWithoutFeedback } from "react-native";

interface BodalProps {
  open: boolean;
  onClose: () => void;
  children: any;
}

const Bodal: React.FunctionComponent<BodalProps> = (props) => {
  return (
    <Modal visible={props.open} transparent>
      <TouchableWithoutFeedback onPress={props.onClose}>
        <View
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.40)",
          }}
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <View
              style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                backgroundColor: "#fff",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                padding: 20,
                borderWidth: 1,
              }}
            >
              {props.children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default Bodal;
