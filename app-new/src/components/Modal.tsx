import { Text, Modal, View, StyleSheet, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import commonStyles from "../styles/styles";

type Props = {
  show: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

const IdemModal: React.FC<Props> = ({ show, title, children, onClose }) => {
  return (
    <Modal
      visible={show}
      animationType="slide"
      presentationStyle="overFullScreen"
      transparent={true}
    >
      <View style={styles.contentWrapper}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={commonStyles.text.smallHeading}>{title}</Text>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            >
              <AntDesign name="close" size={24} color="black" />
            </Pressable>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  modal: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between"
  }
});

export default IdemModal;
