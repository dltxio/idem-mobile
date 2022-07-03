import * as React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Alert,
  KeyboardAvoidingView,
  ScrollView
} from "react-native";

import { Button } from "../../components";
import BottomNavBarSpacer from "../../components/BottomNavBarSpacer";
import { useClaimValue } from "../../context/ClaimsStore";
import { pgpLocalStorage } from "../../utils/local-storage";
import { createRandomPassword } from "../../utils/randomPassword-utils";

import type { PGP } from "../../types/wallet";
// import { createRandomPassword } from "../../utils/randomPassword-utils";
import {
  createPublicKey,
  generateKeyPair,
  publishPublicKey,
  verifyKeyByEmail
} from "../../utils/pgp-utils";

const PGPScreen: React.FC = () => {
  // for user input
  const [keyText, setKeyText] = React.useState<string>();
  // const [keyPublicText, setPublicKeyText] = React.useState<string>();
  const [pgp, setPGP] = React.useState<PGP>();

  const email = useClaimValue("EmailCredential");
  const name = useClaimValue("NameCredential");

  React.useEffect(() => {
    (async () => {
      const localPGP = await pgpLocalStorage.get();

      if (localPGP) {
        setKeyText(localPGP.publicKey);
        setPGP(localPGP);
      }
    })();
  }, []);

  const importPGPPrivateKey = async () => {
    try {
      const keyPair : PGP = await createPublicKey(keyText as string);
      setPGP(keyPair);
      
      await pgpLocalStorage.save(keyPair);
      const checkKey = await pgpLocalStorage.get();

      if (checkKey) {
        Alert.alert("Success!", "Your PGP Key Pair has been saved.");
        return;
      }
    } catch (error) {
      console.log(error);
    }

    Alert.alert(
      "UH-OH",
      "There was a problem importing your Private Key. Please try again."
    );
  };

  const publishPGPPublicKey = () => {
    if (email && pgp?.publicKey) {
      publishPublicKey(email, pgp.publicKey);
      return;
    }

    Alert.alert("No PGP key or Email has been added.");
  };

  const verifyPGPPublicKey = () => {

    // todo check finger prints here too.  See IDEM-168

    if (email) {
      verifyKeyByEmail(email);
      return;
    }

    Alert.alert("UH-HO", "No email claim was found.");
  };

  const generateNewPGPKeyPair = async () => {
    const password = createRandomPassword();

    if (name && email) {
      const keyPair: PGP = await generateKeyPair(password, name, email);
      setPGP(keyPair);
      await pgpLocalStorage.save(keyPair);
      Alert.alert(
        "Success!",
        `Your PGP key has been created with the password ${password}`
      );
      
      return;
    }

    Alert.alert("UH-HO", "No email or name claim was found.");
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
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
        <Text>
          value={pgp?.publicKey}
        </Text>
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
            <Button
              title={"Generate new PGP Key"}
              onPress={generateNewPGPKeyPair}
            />
          </View>
          <View style={styles.button}>
            <Button
              title={"Publish PGP Public key"}
              onPress={publishPGPPublicKey}
            />
          </View>
          <View style={styles.button}>
            <Button title={"Verify email"} onPress={verifyPGPPublicKey} />
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
    flex: 1
  },
  scrollContent: {
    justifyContent: "flex-start",
    alignItems: "center"
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
    alignSelf: "stretch"
  },
  buttonWrapper: {
    justifyContent: "flex-end",
    alignSelf: "stretch"
  },
  button: {
    marginVertical: 5,
    alignSelf: "stretch",
    marginHorizontal: 10
  },
  warning: {
    alignSelf: "stretch",
    marginHorizontal: 20,
    marginTop: 10
  }
});
