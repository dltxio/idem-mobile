import * as React from "react";
import {
  createAndSaveWallet,
  deleteWallet,
  userHasWallet
} from "../utils/wallet-utils";

export type WalletValue = {
  hasWallet: boolean;
  reset: () => Promise<void>;
  createWallet: () => Promise<void>;
};

export const WalletContext = React.createContext<WalletValue | undefined>(
  undefined
);

export const WalletProvider: React.FC<{
  children: React.ReactNode;
}> = props => {
  const [hasWallet, setHasWallet] = React.useState<boolean>(false);

  React.useEffect(() => {
    (async () => {
      setHasWallet(await userHasWallet());
    })();
  }, []);

  const createWallet = async () => {
    await createAndSaveWallet();
    setHasWallet(true);
  };

  const reset = async () => {
    await deleteWallet();
    setHasWallet(false);
  };

  const value = React.useMemo(
    () => ({
      hasWallet,
      reset,
      createWallet
    }),
    [hasWallet, reset, createWallet]
  );

  return (
    <WalletContext.Provider value={value}>
      {props.children}
    </WalletContext.Provider>
  );
};

export const useWalletStore = () => {
  const context = React.useContext(WalletContext);

  if (context === undefined) {
    throw new Error("useWalletStore must be used within a WalletProvider");
  }
  return context;
};
