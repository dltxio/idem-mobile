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
import { pgpLocalStorage } from "../../utils/local-storage";

const importPrivateKeyFileFromDevice = async () => {
  const res = await DocumentPicker.getDocumentAsync({
    type: ["application/pgp-signature", "text/*"] // .asc and .key
  });
  if (res.type === "cancel") return;
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
  const emailClaimValue = useClaimValue("EmailCredential");
  const nameClaimValue = useClaimValue("NameCredential");

  const {
    generateKeyPair,
    createPublicKey,
    publishPGPPublicKey,
    verifyPGPPublicKey
  } = usePgp();

  const loadKeyFromLocalStorage = React.useCallback(async () => {
    const key = await pgpLocalStorage.get();
    if (!key) return;
    setKeyText(key.publicKey);
  }, [setKeyText]);

  const importMyPrivateKey = React.useCallback(
    async (privateKey: string) => {
      await createPublicKey(privateKey);
      await loadKeyFromLocalStorage();
    },
    [createPublicKey]
  );

  const importPrivateKeyFromDevice = React.useCallback(async () => {
    try {
      const content = await importPrivateKeyFileFromDevice();
      if (!content) return;
      if (!isPrivateKey(content)) throw new Error("Not a private key");
      await createPublicKey(content);
      await loadKeyFromLocalStorage();
    } catch (error: any) {
      Alert.alert(
        AlertTitle.Error,
        `Failed to extract the private key from file \n> ${
          error?.message ?? "unknown error"
        }`
      );
      console.error(error);
    }
  }, [createPublicKey]);

  const generateNewPgpKey = React.useCallback(
    async (name: string, email: string) => {
      await generateKeyPair(name, email);
      await loadKeyFromLocalStorage();
    },
    [generateKeyPair]
  );

  React.useEffect(() => {
    (async () => {
      await loadKeyFromLocalStorage();
    })();
  }, []);

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
          value={keyText}
        />
        <Text style={styles.warning}>
          NOTE: Importing your keys saves them to your local storage. IDEM does
          not have access to the keys you import.
        </Text>
        <View style={styles.buttonWrapper}>
          <View style={styles.button}>
            <Button
              title={"Import my Private Key"}
              onPress={() => importMyPrivateKey(keyText as string)}
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
              disabled={!emailClaimValue || !nameClaimValue}
              onPress={async () =>
                generateNewPgpKey(
                  nameClaimValue as string,
                  emailClaimValue as string
                )
              }
            />
          </View>
          <View style={styles.button}>
            <Button
              title={"Publish PGP Public key"}
              disabled={!keyText || !emailClaimValue}
              onPress={() => publishPGPPublicKey(keyText, emailClaimValue)}
            />
          </View>
          <View style={styles.button}>
            <Button
              title={"Verify email"}
              disabled={!emailClaimValue}
              onPress={() => verifyPGPPublicKey(emailClaimValue)}
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
