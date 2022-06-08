import * as React from "react";
import { View, StyleSheet, TextInput, Text, Dimensions } from "react-native";
import {
  keyStoreLocalStorage,
  pgpLocalStorage
} from "../../utils/local-storage";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { GDrive, ListQueryBuilder } from "expo-google-drive-api-wrapper";
import { Button } from "../../components";

WebBrowser.maybeCompleteAuthSession();

const PGPScreen: React.FC = () => {
  const [keytext, setKeytext] = React.useState<string | undefined>();
  const [, response, promptAsync] = Google.useAuthRequest({
    scopes: ["https://www.googleapis.com/auth/drive"],
    expoClientId:
      "917254276650-a502sa63k7pfq443sub3bmj4m9ot4mmc.apps.googleusercontent.com"
  });

  const handleGdriver = async (response: any) => {
    const gdrive = new GDrive();
    gdrive.accessToken = response.authentication?.accessToken;
    gdrive.fetchCoercesTypes = true;
    gdrive.fetchRejectsOnHttpErrors = false;
    gdrive.fetchTimeout = 3000;

    const idemId = await gdrive.files.list({
      q: new ListQueryBuilder().e("name", "idem").and().in("root", "parents")
    });

    const keystoreFile = await gdrive.files.list({
      q: new ListQueryBuilder()
        .e("name", "keystore.json")
        .and()
        .in(idemId.files[0]?.id ?? "root", "parents")
    });

    const keystoreJson = await gdrive.files.getJson(keystoreFile.files[0].id);
    await keyStoreLocalStorage.save(keystoreJson);
    const keyStore = await keyStoreLocalStorage.get();
    console.log(keyStore);
  };

  React.useEffect(() => {
    if (response?.type === "success" && response?.authentication) {
      handleGdriver(response);
    }
  }, [response]);

  React.useEffect(() => {
    (async () => {
      const initialPgp = await pgpLocalStorage.get();

      if (initialPgp) {
        setKeytext(initialPgp.keytext);
      }
    })();
  }, []);

  const importPGP = async () => {
    setKeytext(keytext);
    await pgpLocalStorage.save({ keytext: keytext });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.introText}>
        Import your Private Key to sign transactions:
      </Text>
      <TextInput
        placeholder="Paste your PRIVATE key here"
        placeholderTextColor={"black"}
        onChangeText={setKeytext}
        value={keytext}
        style={styles.input}
        multiline={true}
        selectionColor={"white"}
      />
      <View style={styles.verifyButton}>
        <Button title={"Import my Private Key"} onPress={importPGP} />
      </View>
      <View style={styles.verifyButton}>
        <Button
          title={"Get key from Google Drive"}
          onPress={() => {
            promptAsync();
          }}
        />
      </View>
      <Text style={styles.warning}>
        NOTE: Importing your keys saves them to your local storage. IDEM does
        not have access to the keys you import.
      </Text>
    </View>
  );
};

export default PGPScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    marginTop: 80
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
  verifyButton: {
    marginVertical: 5,
    width: Dimensions.get("window").width
  },
  warning: {
    width: Dimensions.get("window").width * 0.8,
    marginTop: 10
  }
});
