import * as React from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";
import { useClaimsStore, useClaimValue } from "../../context/ClaimsStore";
import { AlertTitle, ClaimTypeConstants } from "../../constants/common";
import { pgpLocalStorage } from "../../utils/local-storage";
import {
  checkIfContentContainOnlyPublicKey,
} from "../../utils/pgp-utils";


const PGPScreen: React.FC = () => {
  // for user input
  const [keyText, setKeyText] = React.useState<string>();
  // const {UserDetailsHeader} = UserDetailsHeader();
  const emailClaimValue = useClaimValue(ClaimTypeConstants.EmailCredential);
  const nameClaimValue = useClaimValue(ClaimTypeConstants.NameCredential);
  const loadKeyFromLocalStorage = React.useCallback(async () => {
    const key = await pgpLocalStorage.get();
    if (!key) return;
    setKeyText(key.publicKey);
  }, [setKeyText]);
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

  const isKeyTextIsPublicKey = React.useMemo(() => {
    if (!keyText) return false;
    return checkIfContentContainOnlyPublicKey(keyText);
  }, [keyText]);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      ></ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PGPScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  actionSheetButtonContainer: {
    margin: 10
  },
  scrollContent: {
    justifyContent: "flex-start",
    alignItems: "center"
  },
  introText: {
    marginBottom: 10
  },
  headingText: {
    fontWeight: "500" as any,
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center"
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
    marginVertical: 400,
    alignSelf: "stretch",
    marginHorizontal: 10
  },
  PGPText: {
    alignSelf: "stretch",
    marginHorizontal: 20,
    marginTop: 10
  }
});
