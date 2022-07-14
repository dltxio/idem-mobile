import * as React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Alert
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

import { Button } from "../../components";
import BottomNavBarSpacer from "../../components/BottomNavBarSpacer";
import { useClaimValue } from "../../context/ClaimsStore";
import usePgp from "../../hooks/usePpg";
import { AlertTitle } from "../../constants/common";

const importPrivateKeyFileFromDevice = async () => {
  const res = await DocumentPicker.getDocumentAsync({
    type: ["*/*"] // .asc and .key
  });
  if (res.type === "cancel") return;
  const isCorrectFileType =
    res.name.endsWith(".asc") || res.name.endsWith(".key");
  if (!isCorrectFileType) {
    throw new Error("invalid file type : expecting .asc or .key");
  }
  const fileContent = await FileSystem.readAsStringAsync(res.uri);
  return fileContent;
};

const isPrivateKey = (content: string) => {
  const isStartWithBegin = content.startsWith(
    "-----BEGIN PGP PRIVATE KEY BLOCK-----"
  );
  const isEndWithEnd = content.endsWith("-----END PGP PRIVATE KEY BLOCK-----");
  return isStartWithBegin && isEndWithEnd;
};

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

  const importPrivateKeyFromDevice = async () => {
    try {
      const content = await importPrivateKeyFileFromDevice();
      if (!content) return;
      if (!isPrivateKey(content)) throw new Error("Not a private key");
      createPublicKey(content);
    } catch (error: any) {
      Alert.alert(
        AlertTitle.Error,
        `Failed to extract the private key from file \n> ${
          error?.message ?? "unknown error"
        }`
      );
      console.error(error);
    }
  };

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
              title={"Import my Private Key from my Device"}
              onPress={importPrivateKeyFromDevice}
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
