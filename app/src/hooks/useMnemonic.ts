import React from "react";
import Uuid from "react-native-uuid";
import { Wallet } from "../types/wallet";
import * as EthUtil from "../utils/eth-utils";
import { mnemonicLocalStorage } from "../utils/local-storage";

type Hooks = {
  mnemonic: string | undefined;
  ethAddress: string | undefined;
  createMnemonic: () => Promise<void>;
  reset: () => void;
  loadingMnemonic: boolean;
};

const createWallet = (mnemonicPhrase: string, ethAddress: string): Wallet => {
  return {
    mnemonic: {
      "@context": ["https://w3id.org/wallet/v1"],
      id: Uuid.v4() as string,
      name: "my IDEM mnemonic",
      type: "Mnemonic",
      value: mnemonicPhrase
    },
    ethAddress
  };
};

const useMnemonic = (): Hooks => {
  const [mnemonic, setMnemonic] = React.useState<string | undefined>();
  const [ethAddress, setEthAddress] = React.useState<string | undefined>();
  const [loadingMnemonic, setLoadingMnemonic] = React.useState<boolean>(true);

  React.useEffect(() => {
    (async () => {
      setLoadingMnemonic(true);
      const initialMnemonic = await mnemonicLocalStorage.get();

      if (initialMnemonic) {
        setMnemonic(initialMnemonic.mnemonic.value);
        setEthAddress(initialMnemonic.ethAddress);
      }
      setLoadingMnemonic(false);
    })();
  }, []);

  const createMnemonic = async () => {
    try {
      const { mnemonicPhrase, ethAddress: newEthAddress } =
        EthUtil.createMnemonic();
      const wallet = createWallet(mnemonicPhrase, newEthAddress);
      await mnemonicLocalStorage.save(wallet);
      setMnemonic(wallet.mnemonic.value);
      setEthAddress(wallet.ethAddress);
    } catch (error) {
      console.log(error);
    }
  };

  const reset = () => {
    mnemonicLocalStorage.clear();
    setMnemonic("");
    setEthAddress("");
  };
  return { createMnemonic, reset, mnemonic, ethAddress, loadingMnemonic };
};

export default useMnemonic;
