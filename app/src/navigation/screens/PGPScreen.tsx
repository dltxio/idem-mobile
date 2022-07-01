import axios, { AxiosError } from "axios";
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
import OpenPGP, { KeyPair } from "react-native-fast-openpgp";
import { Button } from "../../components";
import BottomNavBarSpacer from "../../components/BottomNavBarSpacer";
import { useClaimValue } from "../../context/ClaimsStore";
import { UploadPGPKeyResponse } from "../../types/claim";
import { pgpLocalStorage } from "../../utils/local-storage";

const PGPScreen: React.FC = () => {
  const [keytext, setKeytextRaw] = React.useState<string | undefined>();
  const [inputKey, setInputKey] = React.useState<string | undefined>();
  const email = useClaimValue("EmailCredential");
  const name = useClaimValue("NameCredential");

  const setKeytext = (keytext: string | undefined) => {
    setKeytextRaw(keytext);
    if (keytext) {
      pgpLocalStorage.save(keytext);
    }
  };

  React.useEffect(() => {
    (async () => {
      const initialPgp = await pgpLocalStorage.get();
      setKeytext(initialPgp ?? undefined);
    })();
  }, []);

  const importPGP = async () => {
    try {
      await OpenPGP.encrypt("Test", inputKey ?? "");
      setKeytext(inputKey);
      Alert.alert("Success!", "Your public key has been saved");
    } catch (error) {
      Alert.alert(
        "UH-OH",
        "There was a problem importing your public key. Please try again."
      );
      console.log(error);
    }
  };

  const uploadKey = () => {
    if (keytext && email) {
      publishPGPPublicKey(email, keytext);
      return;
    }
    Alert.alert("No PGP key or Email");
  };

  const verifyKey = () => {
    if (email) {
      verifyUploadedKey(email);
      return;
    }
    Alert.alert("No Email");
  };

  const createKey = async () => {
    if (name && email) {
      const keys = await createPGPKeyPair({
        name: name,
        email: email,
        passphrase: ""
      });
      setKeytext(keys.publicKey);
      Alert.alert(
        "Successfully created keypair",
        `your private key is ${keys.privateKey}`
      );
      return;
    }
    Alert.alert("No Email or Name");
  };

  const createPGPKeyPair = async ({
    name,
    email,
    passphrase
  }: {
    name?: string;
    email?: string;
    passphrase?: string;
  }): Promise<KeyPair> => {
    const keyPair = await OpenPGP.generate({
      name: name,
      email: email,
      passphrase: passphrase,
      keyOptions: {
        rsaBits: 2048
      }
    });
    return keyPair;
  };

  const verifyUploadedKey = async (email: string) => {
    try {
      await axios.get(
        encodeURI(`https://keys.openpgp.org/vks/v1/by-email/${email}`)
      );
      Alert.alert(
        `Email Verified`,
        `Email has been verified with keys.openpgp.org`
      );
    } catch (error) {
      const err = error as AxiosError;
      console.error(err?.response?.data || error);
      Alert.alert("UH-OH", "Could not verify email.");
    }
  };

  const publishPGPPublicKey = async (email: string, publicKey: string) => {
    try {
      const uploadResponse = await axios.post<UploadPGPKeyResponse>(
        "https://keys.openpgp.org/vks/v1/upload",
        { keytext: publicKey },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      console.log(uploadResponse.data);
      const verifyResponse = await axios.post(
        "https://keys.openpgp.org/vks/v1/request-verify",
        {
          token: uploadResponse.data.token,
          addresses: [email]
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      console.log(verifyResponse.data);
      Alert.alert(
        `Email Sent`,
        `Please check your email for instructions from keys.openpgp.org on how to verify your claim.`
      );
    } catch (error) {
      const err = error as AxiosError;
      console.error(err?.response?.data || error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <TextInput
          placeholder="Paste your PGP/GPG PUBLIC key here"
          placeholderTextColor={"black"}
          onChangeText={setInputKey}
          value={inputKey}
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
            <Button title={"Import my Public Key"} onPress={importPGP} />
          </View>
          <View style={styles.button}>
            <Button title={"Create PGP Keypair"} onPress={createKey} />
          </View>
          <View style={styles.button}>
            <Button title={"Publish PGP public key"} onPress={uploadKey} />
          </View>
          <View style={styles.button}>
            <Button title={"Verify email"} onPress={verifyKey} />
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
