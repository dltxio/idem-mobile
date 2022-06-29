import * as React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  ScrollView
} from "react-native";
import { Button } from "../../components";
import BottomNavBarSpacer from "../../components/BottomNavBarSpacer";
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
    try {
      await pgpLocalStorage.save({ keytext: keytext });
      const checkKey = await pgpLocalStorage.get();
      if (checkKey) {
        Alert.alert("Success!", "Your public key has been saved");
      }
    } catch (error) {
      Alert.alert(
        "UH-OH",
        "There was a problem importing your public key. Please try again."
      );
      console.log(error);
    }
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <TextInput
          placeholder="Paste your PGP/GPG PUBLIC key here"
          placeholderTextColor={"black"}
          onChangeText={setKeytext}
          value={keytext}
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
        </View>
        <BottomNavBarSpacer />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PGPScreen;

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    marginTop: 80
  },
  scrollContent: {
    justifyContent: "flex-start",
    alignItems: "center",
    height: Dimensions.get("window").height
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
  buttonWrapper: {
    justifyContent: "flex-end",
    height: Dimensions.get("window").height * 0.28
  },
  button: {
    marginVertical: 5,
    width: Dimensions.get("window").width * 0.9
  },
  warning: {
    width: Dimensions.get("window").width * 0.8,
    marginTop: 10
  }
});
