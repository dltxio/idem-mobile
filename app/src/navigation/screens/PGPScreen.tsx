import * as React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  ScrollView
} from "react-native";
import { Button } from "../../components";
import BottomNavBarSpacer from "../../components/BottomNavBarSpacer";
import { pgpLocalStorage } from "../../utils/local-storage";

import type { PGP } from "../../types/wallet";
// import { createRandomPassword } from "../../utils/randomPassword-utils";
import { createPublicKey, generatePGP } from "../../utils/pgp-utils";

const PGPScreen: React.FC = () => {
  // const [pgp, setPGP] = React.useState<PGP>();
  const [keyText, setKeyText] = React.useState<string>();

  React.useEffect(() => {
    (async () => {
      const initialPGP = await pgpLocalStorage.get();

      if (initialPGP) {
        setKeyText(initialPGP.publicKey);
      }
    })();
  }, []);

  const importPGPPrivateKey = async () => {
    // setPGP(pgp);
    try {
      const keyPair : PGP = await createPublicKey(keyText as string);
      await pgpLocalStorage.save(keyPair);
      const checkKey = await pgpLocalStorage.get();
      if (checkKey) {
        Alert.alert("Success!", "Your PGP key has been saved.");
      }
    } catch (error) {
      Alert.alert(
        "UH-OH",
        "There was a problem importing your public key. Please try again."
      );
      console.log(error);
    }
  };

  const generateNewPGP = async () => {
    // todo: alert for password
    const email = claims.find((c) => c.type === "AdultCredential");
    const name = claims.find((c) => c.type === "AdultCredential");

    const pgp : PGP = await generatePGP("my password", name, email);
    Alert.alert("Success!", "Your PGP key has been created.");
  }

  return (
    <KeyboardAvoidingView>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <TextInput
          placeholder="Paste your PGP/GPG PRIVATE key here"
          placeholderTextColor={"black"}
          onChangeText={setKeyText}
          value={keyText}
          style={styles.input}
          multiline={true}
          selectionColor={"white"}
        />
        <Text style={styles.warning}>
          NOTE: Importing your keys saves them to your local storage. IDEM does
          not have access to the keys you import.
        </Text>
        <View style={styles.buttonWrapper}>
          <View style={styles.button}>
            <Button
              title={"Import my Private Key"}
              onPress={importPGPPrivateKey}
            />
          </View>
        </View>

        <View style={styles.buttonWrapper}>
          <View style={styles.button}>
            <Button title={"Generate new PGP Key"} onPress={generateNewPGP} />
          </View>
        </View>

        <BottomNavBarSpacer />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PGPScreen;

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    marginTop: 80
  },
  scrollContent: {
    justifyContent: "flex-start",
    alignItems: "center",
    height: Dimensions.get("window").height
  },
  introText: {
    marginBottom: 10
  },
  input: {
    marginVertical: 10,
    backgroundColor: "grey",
    height: 200,
    padding: 10,
    overflow: "scroll",
    width: Dimensions.get("window").width
  },
  buttonWrapper: {
    justifyContent: "flex-end",
    height: Dimensions.get("window").height * 0.28
  },
  button: {
    marginVertical: 5,
    width: Dimensions.get("window").width * 0.9
  },
  warning: {
    width: Dimensions.get("window").width * 0.8,
    marginTop: 10
  }
});
