import * as React from "react";
import {
  View,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Text,
  Modal
} from "react-native";
import useMnemonic from "../hooks/useMnemonic";
import commonStyles from "../styles/styles";

const CreateMnemonicController: React.FC = () => {
  const { mnemonic, createMnemonic, loadingMnemonic } = useMnemonic();
  const [showMnemonic, setShowMnemonic] = React.useState<boolean>(false);

  React.useLayoutEffect(() => {
    if (mnemonic && showMnemonic) {
      showMnemonicAlert(mnemonic);
    }
    if (!mnemonic && !loadingMnemonic) {
      showAskAlert();
    }
  }, [mnemonic, loadingMnemonic]);

  const acceptAsk = async () => {
    setShowMnemonic(true);
    // The loading screen needs just a moment of time to appear
    await new Promise((resolve) => {
      setTimeout(resolve, 1);
    });
    createMnemonic();
  };

  const showMnemonicAlert = (_mnemonic: string) => {
    setShowMnemonic(false);
    Alert.alert(
      "Your Mnemonic Seed is",
      `${_mnemonic}`,
      [
        {
          text: "OK",
          style: "destructive"
        }
      ],
      {
        cancelable: true
      }
    );
  };

  const showAskAlert = () => {
    Alert.alert(
      "Mnemonic seed?",
      "Would you like to create a mnemonic seed?",
      [
        {
          text: "OK",
          onPress: acceptAsk,
          style: "destructive"
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ],
      {
        cancelable: true
      }
    );
  };
  if (showMnemonic) {
    return (
      <Modal style={commonStyles.screen}>
        <View style={styles.loadingScreen}>
          <Text style={styles.loadingText}>Generating Mnemonic</Text>
          <ActivityIndicator size="large" color={"#000"} />
        </View>
      </Modal>
    );
  }

  return <View />;
};

export default CreateMnemonicController;

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  loadingText: {
    marginBottom: 20
  }
});
