/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { createMnemonic } from "../utils/eth-utils";
import { mnemonicLocalStorage } from "../utils/local-storage";
// import type { Wallet } from "../types/wallet";

export type MnemonicValue = {
  // wallet: Wallet;
  createAndSaveMnemonic: () => Promise<
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
      setLoadingMnemonic(true);
      const initialMnemonic = await mnemonicLocalStorage.get();

      if (initialMnemonic) {
        setMnemonic(initialMnemonic.mnemonic);
        setEthAddress(initialMnemonic.ethAddress);
      }
      setLoadingMnemonic(false);
    })();
  }, []);

  const createAndSaveMnemonic = async () => {
    try {
      const wallet = createMnemonic();
      
      await mnemonicLocalStorage.save({
        mnemonic: wallet.mnemonic,
        ethAddress: wallet.ethAddress
      });

      setMnemonic(wallet.mnemonic);
      setEthAddress(wallet.ethAddress);

      return { mnemonic, ethAddress };
    } catch (error: unknown) {
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
      // Wallet,
      createAndSaveMnemonic,
      reset,
      loadingMnemonic
    }),
    [mnemonic, ethAddress, createAndSaveMnemonic, reset]
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
