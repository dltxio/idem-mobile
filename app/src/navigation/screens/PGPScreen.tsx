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

type Navigation = ProfileStackNavigation<"Home">;

const PGPScreen: React.FC = () => {
  const [keytext, setKeytext] = React.useState<string | undefined>();
  const navigation = useNavigation<Navigation>();

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
    marginTop: 20,
    marginBottom: 20,
    width: Dimensions.get("window").width
  },
  warning: {
    width: Dimensions.get("window").width * 0.8,
    marginTop: 10
  }
});
