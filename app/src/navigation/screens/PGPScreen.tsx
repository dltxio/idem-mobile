import * as React from "react";
import { View, StyleSheet, TextInput, Text, Dimensions } from "react-native";
import { Button } from "../../components";
import { pgpLocalStorage } from "../../utils/local-storage";

const PGPScreen: React.FC = () => {
  const [keytext, setKeytext] = React.useState<string | undefined>();

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
    console.log(await pgpLocalStorage.get());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.introText}>
        Import your Public Key to sign transactions:
      </Text>
      <TextInput
        placeholder="Paste your PUBLIC key here"
        placeholderTextColor={"black"}
        onChangeText={setKeytext}
        value={keytext}
        style={styles.input}
        multiline={true}
        selectionColor={"white"}
      />
      <Button
        title={"Import my Public Key"}
        onPress={importPGP}
        style={styles.verifyButton}
      />
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
    justifyContent: "center",
    alignItems: "center",
    height: Dimensions.get("window").height
  },
  introText: {
    marginBottom: 10
  },
  input: {
    marginVertical: 10,
    backgroundColor: "grey",
    height: 100,
    width: Dimensions.get("window").width * 0.7,
    padding: 10,
    overflow: "scroll"
  },
  verifyButton: {
    marginTop: 20,
    marginBottom: 20
  },
  warning: {
    width: Dimensions.get("window").width * 0.8,
    marginTop: 10
  }
});
