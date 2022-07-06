import { ethers } from "ethers";
import React from "react";
import { mnemonicLocalStorage } from "../utils/local-storage";

type Hooks = {
  mnemonic: string | undefined;
  ethAddress: string | undefined;
  createMnemonic: () => Promise<void>;
  reset: () => void;
  loadingMnemonic: boolean;
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
        setMnemonic(initialMnemonic.mnemonic);
        setEthAddress(initialMnemonic.ethAddress);
      }
      setLoadingMnemonic(false);
    })();
  }, []);

  const createMnemonic = async () => {
    try {
      const wallet = ethers.Wallet.createRandom();
      await mnemonicLocalStorage.save({
        mnemonic: wallet.mnemonic.phrase,
        ethAddress: wallet.address
      });
      setMnemonic(wallet.mnemonic.phrase);
      setEthAddress(wallet.address);
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
