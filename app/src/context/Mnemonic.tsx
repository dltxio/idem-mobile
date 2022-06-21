/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { ethers } from "ethers";
import { mnemonicLocalStorage } from "../utils/local-storage";

export type MnemonicValue = {
  mnemonic: string | undefined;
  ethAddress: string | undefined;
  createMnemonic: () => Promise<
    { mnemonic: string | undefined; ethAddress: string | undefined } | undefined
  >;
  reset: () => void;
  loadingMnemonic: boolean;
};

export const MnemonicContext = React.createContext<MnemonicValue | undefined>(
  undefined
);

export const MnemonicProvider: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  const [mnemonic, setMnemonic] = React.useState<string | undefined>();
  const [ethAddress, setEthAddress] = React.useState<string | undefined>();
  const [loadingMnemonic, setLoadingMnemonic] = React.useState<boolean>(true);

  React.useEffect(() => {
    (async () => {
      await mnemonicLocalStorage.clear();
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
      return { mnemonic, ethAddress };
    } catch (error) {
      console.log(error);
    }
  };

  const reset = () => {
    mnemonicLocalStorage.clear();
    setMnemonic("");
    setEthAddress("");
  };

  const value = React.useMemo(
    () => ({
      mnemonic,
      ethAddress,
      createMnemonic,
      reset,
      loadingMnemonic
    }),
    [mnemonic, ethAddress, createMnemonic, reset]
  );

  return (
    <MnemonicContext.Provider value={value}>
      {props.children}
    </MnemonicContext.Provider>
  );
};

export const useMnemonic = () => {
  const context = React.useContext(MnemonicContext);

  if (context === undefined) {
    throw new Error("useMnemonic must be used within a MnemonicProvider");
  }

  return context;
};
