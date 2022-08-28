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
import UserDetailsHeader from "./UserDetailsHeader";
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
import { Entypo } from "@expo/vector-icons";
import { useActionSheet } from "@expo/react-native-action-sheet";

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
  const { showActionSheetWithOptions } = useActionSheet();
  const [keyText, setKeyText] = React.useState<string>();
  const {UserDetailsHeader} = UserDetailsHeader();
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

        <Text style={styles.PGPText}>
          Pretty Good Privacy (PGP) is an encryption program that provides
          cryptographic privacy and authentication for data communication. PGP
          is used for singing, encryption, and decrypting texts, e-mails, files,
          directories, and whole disk partitions and to increase the security of
          e-mail communications.
        </Text>

        <Text style={styles.PGPText}>
          IDEM uses PGP encryption to secure your communication and data.
        </Text>
        <Text style={styles.PGPText}>
          NOTE: Importing your keys saves them to your local storage. IDEM does
          not have access to the keys you import.
        </Text>
        <Text style={styles.headingText}>PGP Public Key</Text>
        <View>{pgpTitle}</View>
        <View style={styles.actionSheetButtonContainer}>
          {/* <Entypo.Button
            name="list"
            backgroundColor="#3e3e3e"
            onPress={() =>
              showActionSheetWithOptions(
                {
                  options: [
                    ...allDocuments.map((document) => document.title),
                    "Cancel"
                  ],
                  cancelButtonIndex: allDocuments.length
                },
                (buttonIndex) => {
                  if (buttonIndex === undefined) return;
                  if (buttonIndex === allDocuments.length) return;
                  setSelectedDocument(allDocuments[buttonIndex]);
                }
              )
            }
          >
            {selectedDocument.title}
          </Entypo.Button> */}
        </View>
        <View style={styles.buttonWrapper}>
          {/* <View style={styles.button}>
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
              title={"Generate new PGP Key and publish"}
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
          </View> */}
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
  actionSheetButtonContainer: {
    margin: 10
  },
  scrollContent: {
    justifyContent: "flex-start",
    alignItems: "center"
  },
  introText: {
    marginBottom: 10
  },
  headingText: {
    fontWeight: "500" as any,
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center"
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
  PGPText: {
    alignSelf: "stretch",
    marginHorizontal: 20,
    marginTop: 10
  }
});
