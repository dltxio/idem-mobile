import * as React from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet
} from "react-native";
import { usePGP } from "../../context/PGP";

export const PGPScreen: React.FC = () => {
  const { keyPair, generatePGP } = usePGP();
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [passphrase, setPassphrase] = React.useState<string>("");

  const onSubmit = async () => {
    console.log("here");
    const pgp = await generatePGP({name, email, passphrase});
    console.log(pgp);
  };

  return (
    <View style={styles.container}>
      <View>
        <Text>Generate a PGP key pair</Text>
        <View>
          <TextInput
            placeholder="Name"
            onChangeText={setName}
            value={name.trim()}
          />
          <TextInput
            placeholder="Email"
            onChangeText={setEmail}
            value={email.trim()}
          />
          <TextInput
            placeholder="Password"
            onChangeText={setPassphrase}
            value={passphrase.trim()}
            secureTextEntry={true}
          />
            <Button title="Generate PGP Key Pair" onPress={onSubmit} />
            {!!keyPair && !!keyPair.privateKey && <Text>Private Key: {keyPair.privateKey}</Text> }
            {!!keyPair && !!keyPair.publicKey && <Text>Public Key: {keyPair.publicKey}</Text> }
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20
  }
});
