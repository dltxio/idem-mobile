import * as React from "react";
import { View, StyleSheet, TextInput, Text, Dimensions } from "react-native";
import { Button } from "../../components";
import { pgpLocalStorage } from "../../utils/local-storage";

const PGPScreen: React.FC = () => {
  const [privateKey, setPrivateKey] = React.useState<string | undefined>();
  const [publicKey, setPublicKey] = React.useState<string | undefined>();

  React.useEffect(() => {
    (async () => {
      const initialPgp = await pgpLocalStorage.get();

      if (initialPgp) {
        setPublicKey(initialPgp.keyPair.publicKey);
        setPrivateKey(initialPgp.keyPair.privateKey);
      }
    })();
  }, []);

  const importPGP = async () => {
    setPrivateKey(privateKey);
    setPublicKey(publicKey);
    await pgpLocalStorage.save({keyPair: {privateKey: privateKey, publicKey: publicKey}});
    console.log(await pgpLocalStorage.get());
  }

  return (
    <View style={styles.container}>
      <Text style={styles.introText}>Import your PGP to sign transactions:</Text>
      <TextInput
        placeholder="Paste your PRIVATE key here"
        onChangeText={setPrivateKey}
        placeholderTextColor={"black"}
        value={privateKey}
        style={styles.input}
        multiline={true}
        selectionColor={"white"}
      />
      <TextInput
        placeholder="Paste your PUBLIC key here"
        placeholderTextColor={"black"}
        onChangeText={setPublicKey}
        value={publicKey}
        style={styles.input}
        multiline={true}
        selectionColor={"white"}
      />
      <Button
        title={"Import my PGP"}
        onPress={importPGP}
        style={styles.verifyButton}
      />
      <Text style={styles.warning}>NOTE: Importing your keys saves them to your local storage. IDEM does not have access to the keys you import.</Text>
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