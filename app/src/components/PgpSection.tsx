import * as React from "react";
import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Switch
} from "react-native";
import { Button } from ".";
import { useClaimsStore, useClaimValue } from "../context/ClaimsStore";
import usePgp from "../hooks/usePpg";
import { AlertTitle, ClaimTypeConstants } from "../constants/common";
import { pgpLocalStorage } from "../utils/local-storage";
import {
  extractPrivateKeyFromContent,
  formatFingerPrint
} from "../utils/pgp-utils";
import { useActionSheet } from "@expo/react-native-action-sheet";
import QRCode from "react-native-qrcode-svg";
import colors from "../styles/colors";
import { TextInput } from "react-native-gesture-handler";
import isEmail from "validator/lib/isEmail";

type Props = {
  emailInput: string;
  isEmailVerified: boolean | undefined;
};

const PgpSection: React.FC<Props> = (props) => {
  const emailClaimValue = useClaimValue(ClaimTypeConstants.EmailCredential);
  const nameClaimValue = useClaimValue(ClaimTypeConstants.NameCredential);
  const [isActive, setIsActive] = React.useState(false);
  const { showActionSheetWithOptions } = useActionSheet();
  const [publicKey, setPublicKey] = React.useState<string>();
  const { addClaim } = useClaimsStore();

  const {
    generateKeyPair,
    generateKeyPairFromPrivateKey,
    resendVerificationEmail,
    importPrivateKeyFileFromDevice
  } = usePgp();

  const [pgpTitle, setPgpTitle] = React.useState<string>();

  const loadKeyFromLocalStorage = React.useCallback(async () => {
    const key = await pgpLocalStorage.get();
    if (!key) return;
    setPublicKey(key.publicKey);
    const fingerPrint = formatFingerPrint(key.fingerPrint);
    setPgpTitle(fingerPrint);
  }, [setPublicKey]);

  const extractAndLoadKeyPairFromContent = React.useCallback(
    async (content: string, email: string) => {
      const privateKey = extractPrivateKeyFromContent(content);
      await generateKeyPairFromPrivateKey(privateKey, email);
      await loadKeyFromLocalStorage();
    },
    [generateKeyPairFromPrivateKey, loadKeyFromLocalStorage]
  );

  const importPrivateKeyFromDevice = React.useCallback(
    async (email: string) => {
      if (!isEmail(email)) {
        return Alert.alert(
          AlertTitle.Warning,
          "Please type a valid email claim value in the input field."
        );
      }
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
      }
    },
    [extractAndLoadKeyPairFromContent]
  );
  const generateAndPublishNewPgpKey = React.useCallback(
    async (name: string, email: string) => {
      if (!isEmail(email)) {
        return Alert.alert(
          AlertTitle.Warning,
          "Please type a valid email claim value in the input field."
        );
      }
      await generateKeyPair(name, email);
      await addClaim(ClaimTypeConstants.EmailCredential, { email }, [], false);
      await loadKeyFromLocalStorage();
    },
    [generateKeyPair]
  );
  const toggleSwitch = () => setIsActive((previousState) => !previousState);

  const shouldDisabledGeneratePgpKey = !emailClaimValue || !nameClaimValue;

  const shouldShowPublicKey = publicKey && props.isEmailVerified;

  React.useEffect(() => {
    (async () => {
      await loadKeyFromLocalStorage();
    })();
  }, []);

  React.useEffect(() => {
    if (shouldDisabledGeneratePgpKey) {
      Alert.alert(
        "Cannot generate PGP/GPG Key",
        "Must have a name and email claim."
      );
    }
  }, [shouldDisabledGeneratePgpKey]);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.warning}>
          Pretty Good Privacy (PGP) is an encryption program that provides
          cryptographic privacy and authentication for data communication. PGP
          is used for singing, encryption, and decrypting texts, e-mails, files,
          directories, and whole disk partitions and to increase the security of
          e-mail communications.
        </Text>
      </ScrollView>
      <View style={styles.qrCodeContainer}>
        {shouldShowPublicKey &&
          (!isActive ? (
            <QRCode value={publicKey} size={250} />
          ) : (
            <TextInput value={publicKey} multiline={true} />
          ))}
      </View>
      <View>
        {shouldShowPublicKey && (
          <Switch
            trackColor={{ false: colors.white, true: colors.blue }}
            thumbColor={isActive === true ? colors.white : colors.blue}
            onValueChange={toggleSwitch}
            value={isActive}
            style={styles.toggle}
          />
        )}
      </View>
      <View style={styles.buttonWrapper}>
        <Button
          disabled={
            props.isEmailVerified || !props.emailInput || !nameClaimValue
          }
          onPress={() =>
            showActionSheetWithOptions(
              {
                options: [
                  "Import Private Key",
                  "Generate new PGP Key",
                  "cancel"
                ],
                cancelButtonIndex: 2
              },
              async (buttonIndex) => {
                switch (buttonIndex) {
                  case 0:
                    await importPrivateKeyFromDevice(props.emailInput);
                    break;

                  case 1:
                    await generateAndPublishNewPgpKey(
                      nameClaimValue?.toLocaleLowerCase() as string,
                      props.emailInput as string
                    );
                    break;
                }
              }
            )
          }
        >
          Setup PGP Key
        </Button>
      </View>
      <View style={styles.didntGetEmailText}>
        {publicKey && !props.isEmailVerified && (
          <Text
            style={styles.textStyle}
            onPress={() => resendVerificationEmail(props.emailInput)}
          >
            Didn't receive your verification email?
          </Text>
        )}
      </View>

      <View style={styles.fingerPrint}>
        {shouldShowPublicKey && <Text>Fingerprint : {pgpTitle}</Text>}
      </View>
    </KeyboardAvoidingView>
  );
};
export default PgpSection;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  textStyle: {
    textDecorationLine: "underline"
  },
  fingerPrint: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
    margin: 10
  },
  didntGetEmailText: {
    alignItems: "center",
    justtifyContent: "center",
    margin: 10,
    alignSelf: "stretch"
  },
  qrCodeContainer: {
    marginTop: 15,
    minHeight: 250,
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
  toggle: {
    margin: 5,
    alignSelf: "stretch"
  },
  warning: {
    alignSelf: "stretch"
  }
});
