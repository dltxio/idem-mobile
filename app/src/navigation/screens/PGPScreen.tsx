import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Dimensions,
  Button
} from "react-native";
import { ProfileStackNavigation } from "../../types/navigation";
import { pgpLocalStorage } from "../../utils/local-storage";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
  GDrive,
  ListQueryBuilder
} from "@robinbobin/react-native-google-drive-api-wrapper";

WebBrowser.maybeCompleteAuthSession();

type Navigation = ProfileStackNavigation<"Home">;

const PGPScreen: React.FC = () => {
  const [keytext, setKeytext] = React.useState<string | undefined>();
  const navigation = useNavigation<Navigation>();
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "917254276650-a502sa63k7pfq443sub3bmj4m9ot4mmc.apps.googleusercontent.com"
  });

  const handleGdriver = async (response: any) => {
    const gdrive = new GDrive();
    console.log(response.authentication);
    gdrive.accessToken = response.authentication?.accessToken;
    gdrive.fetchCoercesTypes = false;
    gdrive.fetchRejectsOnHttpErrors = false;
    gdrive.fetchTimeout = 3000;

    await gdrive.files.list();
    console.log(await gdrive.files.list());
  };
  //So Jo can push with husky-- unused value
  //console.log(request);

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
      <View style={styles.verifyButton}>
        <Button
          title={"Back to my profile"}
          onPress={() => navigation.navigate("Home")}
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
