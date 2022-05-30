import * as React from "react";
/* eslint-disable @typescript-eslint/no-explicit-any */
import "react-native-get-random-values";
import "@ethersproject/shims";
import { ethers } from "ethers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mnemonicLocalStorage } from "../utils/local-storage";

export type MnemonicValue = {
  mnemonic: string | undefined;
  createMnemonic: () => Promise<string | undefined>;
  reset: () => void;
};

export const MnemonicContext = React.createContext<MnemonicValue | undefined>(
  undefined
);

export const MnemonicProvider: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  const [mnemonic, setMnemonic] = React.useState<string | undefined>();

  React.useEffect(() => {
    (async () => {
      const initialMnemonic = await mnemonicLocalStorage.get();

      if (initialMnemonic) {
        setMnemonic(initialMnemonic.privateKey);
      }
    })();
  }, []);

  const createMnemonic = async () => {
    try {
      const wallet = ethers.Wallet.createRandom();
      await AsyncStorage.setItem("PRIVATE_KEY", wallet.privateKey);
      setMnemonic(wallet.mnemonic.phrase);
      console.log(mnemonic)
      return mnemonic;
    } catch (error) {
      console.log(error);
    }
  };

  const reset = () => {
    mnemonicLocalStorage.clear();
    setMnemonic("");
  };

  const value = React.useMemo(
    () => ({
      mnemonic,
      createMnemonic,
      reset
    }),
    [mnemonic, createMnemonic, reset]
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
