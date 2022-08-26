import * as React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  StatusBar
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { Button } from "../../components";
import BottomNavBarSpacer from "../../components/BottomNavBarSpacer";
import { useClaimsStore, useClaimValue } from "../../context/ClaimsStore";
import usePgp from "../../hooks/usePpg";
import { AlertTitle, ClaimTypeConstants } from "../../constants/common";
import { pgpLocalStorage } from "../../utils/local-storage";
import {
  checkIfContentContainOnlyPublicKey,
  extractPrivateKeyFromContent
} from "../../utils/pgp-utils";

const importPrivateKeyFileFromDevice = async () => {
  const res = await DocumentPicker.getDocumentAsync({
    type: ["*/*"]
  });
  if (res.type === "cancel") return;
  const isCorrectFileType =
    res.name.endsWith(".asc") || res.name.endsWith(".key");
  if (!isCorrectFileType) {
    throw new Error("Invalid file type : expecting .asc or .key");
  }
  const fileContent = await FileSystem.readAsStringAsync(res.uri);
  return fileContent;
};

const PGPScreen: React.FC = () => {
  // for user input
  const [keyText, setKeyText] = React.useState<string>();
  const emailClaimValue = useClaimValue(ClaimTypeConstants.EmailCredential);
  const nameClaimValue = useClaimValue(ClaimTypeConstants.NameCredential);

  const { usersClaims } = useClaimsStore();

  const emailClaim = usersClaims.find(
    (c) => c.type === ClaimTypeConstants.EmailCredential
  );

  const { generateKeyPair, generateKeyPairFromPrivateKey, verifyPublicKey } =
    usePgp();

  const loadKeyFromLocalStorage = React.useCallback(async () => {
    const key = await pgpLocalStorage.get();
    if (!key) return;
    setKeyText(key.publicKey);
  }, [setKeyText]);

  const extractAndLoadKeyPairFromContent = React.useCallback(
    async (content: string) => {
      const privateKey = extractPrivateKeyFromContent(content);
      await generateKeyPairFromPrivateKey(privateKey);
      await loadKeyFromLocalStorage();
    },
    [generateKeyPairFromPrivateKey, loadKeyFromLocalStorage]
  );

  const importMyPrivateKeyFromTextInput = React.useCallback(
    async (content: string) => {
      try {
        await extractAndLoadKeyPairFromContent(content);
      } catch (error: any) {
        Alert.alert(
          AlertTitle.Error,
          `Failed to parse the Private Key \n> ${
            error?.message ?? "unknown error"
          }`
        );
      }
    },
    [extractAndLoadKeyPairFromContent]
  );

  const importPrivateKeyFromDevice = React.useCallback(async () => {
    try {
      const content = await importPrivateKeyFileFromDevice();
      if (!content) return;
      await extractAndLoadKeyPairFromContent(content);
    } catch (error: any) {
      Alert.alert(
        AlertTitle.Error,
        `Failed to extract the Private Key from file \n> ${
          error?.message ?? "unknown error"
        }`
      );
      console.error(error);
    }
  }, [extractAndLoadKeyPairFromContent]);

  const generateAndPublishNewPgpKey = React.useCallback(
    async (name: string, email: string) => {
      await generateKeyPair(name, email);
      await loadKeyFromLocalStorage();
      const key = await pgpLocalStorage.get();
      if (!key) return;
    },
    [generateKeyPair]
  );

  const checkRequiredClaims = () => {
    if (emailClaimValue === "" || nameClaimValue === "") {
      Alert.alert(
        AlertTitle.Error,
        "Email and Name claims must be set before a PGP/GPG Key can be generated."
      );
    }
  };

  const shouldDisabledGeneratePgpKey = !emailClaimValue || !nameClaimValue;

  React.useEffect(() => {
    (async () => {
      checkRequiredClaims();
      await loadKeyFromLocalStorage();
    })();
  }, []);

  React.useEffect(() => {
    if (shouldDisabledGeneratePgpKey) {
      Alert.alert(
        "Cannot generate PGP/GPG Key",
        "Must have a name and email claim"
      );
    }
  }, [shouldDisabledGeneratePgpKey]);

  const isKeyTextIsPublicKey = React.useMemo(() => {
    if (!keyText) return false;
    return checkIfContentContainOnlyPublicKey(keyText);
  }, [keyText]);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <StatusBar hidden={false} />
        <TextInput
          placeholder="Paste your PGP/GPG private key here"
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
              title={"Import Private Key"}
              onPress={() => importMyPrivateKeyFromTextInput(keyText as string)}
              disabled={!keyText || isKeyTextIsPublicKey}
            />
          </View>
        </View>
        <View style={styles.buttonWrapper}>
          <View style={styles.button}>
            <Button
              title={"Import Private Key from Device"}
              onPress={importPrivateKeyFromDevice}
            />
          </View>
        </View>

        <View style={styles.buttonWrapper}>
          <View style={styles.button}>
            <Button
              title={"Generate New PGP Key and publish"}
              disabled={shouldDisabledGeneratePgpKey || keyText !== undefined}
              onPress={async () =>
                generateAndPublishNewPgpKey(
                  nameClaimValue as string,
                  emailClaimValue as string
                )
              }
            />
          </View>
          <View style={styles.button}>
            <Button
              title={"Verify email"}
              disabled={emailClaim?.verified}
              onPress={() => verifyPublicKey(emailClaimValue)}
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
