import * as React from "react";
import {
  View,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Text,
  Modal
} from "react-native";
// import { pgpLocalStorage } from "../utils/local-storage";
import { useClaimValue } from "../../context/ClaimsStore";
import { createRandomPassword } from "../../utils/randomPassword-utils";
import type { PGP } from "../types/wallet";


import commonStyles from "../styles/styles";
import { usePGP } from "../context/PGP";

const CreatePGPController: React.FC = () => {
  const { pgp, loadingPGP } = usePGP();
  const [showPGP, setShowPGP] = React.useState<boolean>(false);

  React.useLayoutEffect(() => {
    if (pgp && showPGP) {
      showPGPAlert(pgp);
    }
    if (!pgp && !loadingPGP) {
      showAskAlert();
    }
  }, [pgp, loadingPGP]);

  const acceptAsk = async () => {
    setShowPGP(true);

    // The loading screen needs just a moment of time to appear
    await new Promise((resolve) => {
      setTimeout(resolve, 1);
    });

    const email = useClaimValue("EmailCredential");
    const name = useClaimValue("NameCredential");
    const password = createRandomPassword();

    // call what?
  };

  const showPGPAlert = (_pgp: PGP) => {
    setShowPGP(false);
    Alert.alert(
      "Your PGP Key Fingerprint",
      `${_pgp.publicKey}`,
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
      "PGP Key Pair?",
      "Would you like to create a PGP Key Pair?",
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

  if (showPGP) {
    return (
      <Modal style={commonStyles.screen}>
        <View style={styles.loadingScreen}>
          <Text style={styles.loadingText}>Generating PGP Key Pair</Text>
          <ActivityIndicator size="large" color={"#000"} />
        </View>
      </Modal>
    );
  }

  return <View />;
};

export default CreatePGPController;

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
