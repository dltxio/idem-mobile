import * as React from "react";
import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  StatusBar
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { Button } from "../components";
import BottomNavBarSpacer from "../components/BottomNavBarSpacer";
import { useClaimsStore, useClaimValue } from "../context/ClaimsStore";
import usePgp from "../hooks/usePpg";
import { AlertTitle, ClaimTypeConstants } from "../constants/common";
import { pgpLocalStorage } from "../utils/local-storage";
import {
  checkIfContentContainOnlyPublicKey,
  extractPrivateKeyFromContent
} from "../utils/pgp-utils";
import { useActionSheet } from "@expo/react-native-action-sheet";
import QRCode from "react-native-qrcode-svg";
import { Switch } from "react-native";
import colors from "../styles/colors";

type Props = {
  emailInput: string;
};
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

const PgpFields: React.FC<Props> = (props) => {
  // for user input
  const [keyText, setKeyText] = React.useState<string>();
  const emailClaimValue = useClaimValue(ClaimTypeConstants.EmailCredential);
  const nameClaimValue = useClaimValue(ClaimTypeConstants.NameCredential);
  const [isActive, setIsActive] = React.useState(false);
  const { showActionSheetWithOptions } = useActionSheet();
  const [publicKey,setPublicKey] =React.useState<string>();



  const { generateKeyPair, generateKeyPairFromPrivateKey,resendVerificationEmail } =
    usePgp();

  const loadKeyFromLocalStorage = React.useCallback(async () => {
    const key = await pgpLocalStorage.get();
    if (!key) return;
    setPublicKey(key.publicKey);
  }, [setPublicKey]);

  const extractAndLoadKeyPairFromContent = React.useCallback(
    async (content: string, email: string) => {
      const privateKey = extractPrivateKeyFromContent(content);
      await generateKeyPairFromPrivateKey(privateKey, email);
      await loadKeyFromLocalStorage();
    },
    [generateKeyPairFromPrivateKey, loadKeyFromLocalStorage]
  );

  const importMyPrivateKeyFromTextInput = React.useCallback(
    async (content: string, email: string) => {
      try {
        await extractAndLoadKeyPairFromContent(content, email);
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

  const importPrivateKeyFromDevice = React.useCallback(
    async (email: string) => {
      try {
        const content = await importPrivateKeyFileFromDevice();
        if (!content) return;
        await extractAndLoadKeyPairFromContent(content, email);
      } catch (error: any) {
        Alert.alert(
          AlertTitle.Error,
          `Failed to extract the Private Key from file \n> ${
            error?.message ?? "unknown error"
          }`
        );
        console.error(error);
      }
    },
    [extractAndLoadKeyPairFromContent]
  );

  const generateAndPublishNewPgpKey = React.useCallback(
    async (name: string, email: string) => {
      await generateKeyPair(name, email);
      await loadKeyFromLocalStorage();
      const key = await pgpLocalStorage.get();
      if (!key) return;
    },
    [generateKeyPair]
  );
  const toggleSwitch = () => setIsActive((previousState) => !previousState);
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


  const ShowTextBox = () => {};

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <StatusBar hidden={false} />
        <Text style={styles.warning}>
          Pretty Good Privacy (PGP) is an encryption program that provides
          cryptographic privacy and authentication for data communication. PGP
          is used for singing, encryption, and decrypting texts, e-mails, files,
          directories, and whole disk partitions and to increase the security of
          e-mail communications.
        </Text>
        <BottomNavBarSpacer />
      </ScrollView>
      <View style={styles.qrCodeContainer}>
        {publicKey && (!isActive? <QRCode value={publicKey} size={200} /> : <Text >{publicKey}</Text>)}
      </View>
      <View>
        <Switch
          trackColor={{ false: colors.white, true: colors.blue }}
          thumbColor={isActive === true ? colors.white : colors.blue}
          onValueChange={toggleSwitch}
          onChange={ShowTextBox}
          value={isActive}
          style={styles.toggle}
        />
      </View>
      <View style={styles.buttonWrapper}>
        <View style={styles.button}>
          <Button
            disabled={!props.emailInput || !nameClaimValue}
            onPress={() =>
              showActionSheetWithOptions(
                {
                  options: [
                    "Import Private Key",
                    "Import Private Key from Device",
                    "Generate new PGP Key and publish",
                    "cancel"
                  ],
                  cancelButtonIndex: 3
                },
                async (buttonIndex) => {
                  if (buttonIndex === 0) {
                    importMyPrivateKeyFromTextInput(
                      keyText as string,
                      props.emailInput as string
                    );
                  }
                  if (buttonIndex === 1) {
                    await importPrivateKeyFromDevice(emailClaimValue as string);
                  }
                  if (buttonIndex === 2) {
                    await generateAndPublishNewPgpKey(
                      nameClaimValue as string,
                      props.emailInput as string
                    );
                  }
                }
              )
            }
          >
            Set Up PGP Key
          </Button>

          <Text style={styles.didntGetEmailText} onPress={()=>resendVerificationEmail(props.emailInput)}>
            Didn't receive your verification email?
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
export default PgpFields;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  qrCodeContainer: {
    minHeight: 200,
    alignItems: "center",
    justtifyContent: "center"
  },
  scrollContent: {
    justifyContent: "flex-start",
    alignItems: "center"
  },
  introText: {
    marginBottom: 10
  },
  didntGetEmailText: {
    textDecorationLine: "underline",
    padding: 2
  },
  input: {
    marginVertical: 10,
    backgroundColor: "grey",
    height: 150,
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
  toggle: {
    margin: 10
  },
  warning: {
    alignSelf: "stretch",
    marginHorizontal: 20,
    marginTop: 10
  }
});
