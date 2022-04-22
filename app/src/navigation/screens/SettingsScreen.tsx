import * as React from "react";
import { Text, View } from "react-native";
import { Button } from "../../components";
import { useClaimsStore } from "../../context/ClaimsStore";
import { useDocumentStore } from "../../context/DocumentStore";
import { useWalletStore } from "../../context/WalletStore";
import commonStyles from "../../styles/styles";
import { getWallet } from "../../utils/wallet-utils";

const SettingsScreen: React.FC = () => {
  const { reset: resetDocuments } = useDocumentStore();
  const { reset: resetClaims } = useClaimsStore();
  const { reset: resetWallet, hasWallet, createWallet } = useWalletStore();

  const [recoveryPhrase, setRecoveryPhrase] = React.useState<string>();

  const onReset = () => {
    resetDocuments();
    resetClaims();
    resetWallet();
  };

  const onWalletButtonPress = async () => {
    if (recoveryPhrase) {
      return setRecoveryPhrase(undefined);
    }

    if (hasWallet) {
      const wallet = await getWallet();
      if (!wallet) return;
      setRecoveryPhrase(wallet.mnemonic.phrase);
      return;
    }

    await createWallet();
  };

  return (
    <View style={commonStyles.screen}>
      <Button title="Reset data" onPress={onReset} />
      {recoveryPhrase && <Text>{recoveryPhrase}</Text>}
      <Button
        title={
          recoveryPhrase
            ? "Hide recovery phrase"
            : hasWallet
            ? "Show recovery phrase"
            : "Create wallet"
        }
        onPress={onWalletButtonPress}
      />
    </View>
  );
};

export default SettingsScreen;
