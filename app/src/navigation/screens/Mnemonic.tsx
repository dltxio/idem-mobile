import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  Dimensions
} from "react-native";
import { useMnemonic } from "../../context/Mnemonic";
import { ProfileStackNavigation } from "../../types/navigation";

type Navigation = ProfileStackNavigation<"Home">;

const MnemonicScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const { mnemonic, createMnemonic } = useMnemonic();

  if (!mnemonic) {
    return (
      <View style={styles.mnemonic}>
        <Text>You do not have a mnemonic! Click here to make one.</Text>
        <Button onPress={createMnemonic} title={"Create mnemonic"}></Button>
      </View>
    );
  }

  return (
    <View style={styles.mnemonic}>
      <Text>{mnemonic}</Text>
        <Button
          onPress={() => {
            navigation.navigate("Home");
          }}
          title={"Go to Profile"}
        />
    </View>
  );
};

export default MnemonicScreen;

const styles = StyleSheet.create({
mnemonic: {
    justifyContent: "center",
    alignItems: "center",
    height: Dimensions.get("window").height
  }
});
