import * as React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  KeyboardAvoidingView,
  ScrollView
} from "react-native";

import { Button } from "../../components";
import BottomNavBarSpacer from "../../components/BottomNavBarSpacer";
import { useClaimValue } from "../../context/ClaimsStore";
import usePgp from "../../hooks/usePpg";

const PGPScreen: React.FC = () => {
  // for user input
  const [keyText, setKeyText] = React.useState<string>();
  const email = useClaimValue("EmailCredential");
  const name = useClaimValue("NameCredential");

  const {
    generateKeyPair,
    createPublicKey,
    publishPGPPublicKey,
    verifyPGPPublicKey
  } = usePgp();

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
          style={styles.input}
          multiline={true}
          selectionColor={"white"}
        />
        {/* <Text>
          value={pgp?.publicKey}
        </Text> */}
        <Text style={styles.warning}>
          NOTE: Importing your keys saves them to your local storage. IDEM does
          not have access to the keys you import.
        </Text>
        <View style={styles.buttonWrapper}>
          <View style={styles.button}>
            <Button
              title={"Import my Private Key"}
              onPress={() => createPublicKey(keyText)}
            />
          </View>
        </View>

        <View style={styles.buttonWrapper}>
          <View style={styles.button}>
            <Button
              title={"Generate new PGP Key"}
              disabled={!email || !name}
              onPress={() => generateKeyPair(email, name)}
            />
          </View>
          <View style={styles.button}>
            <Button
              title={"Publish PGP Public key"}
              disabled={!keyText || !email}
              onPress={() => publishPGPPublicKey(keyText, email)}
            />
          </View>
          <View style={styles.button}>
            <Button
              title={"Verify email"}
              disabled={!email}
              onPress={() => verifyPGPPublicKey(email)}
            />
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
