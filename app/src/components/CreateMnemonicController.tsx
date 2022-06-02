import * as React from "react";
import { View, Alert } from "react-native";
import { useMnemonic } from "../context/Mnemonic";

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

  const showLoadingAlert = async () => {
    Alert.alert("Creating Mnemonic...", "", [], {
      cancelable: false
    });
    // The alert needs just a moment of time to appear
    await new Promise((resolve) => {
      setTimeout(resolve, 1);
    });
    createMnemonic();
  };

  const showMnemonicAlert = (_mnemonic: string) => {
    setShowMnemonic(false);
    Alert.alert(
      "Your Mnemonic seed is",
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
          onPress: () => {
            setShowMnemonic(true);
            showLoadingAlert();
          },
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
  return <View />;
};

export default CreateMnemonicController;
