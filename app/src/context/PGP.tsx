/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { pgpLocalStorage } from "../utils/local-storage";
import type { PGP } from "../types/wallet";

import {
  generateKeyPair
} from "../utils/pgp-utils";

export type PGPValue = {
  publicKey: string | undefined;
  createPGP: () => Promise<
    { publicKey: string | undefined; } | undefined
  >;
  reset: () => void;
  loadingPGP: boolean;
};

export const PGPContext = React.createContext<PGPValue | undefined>(
  undefined
);

export const PGPProvider: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  const [pgp, setPGP] = React.useState<string | undefined>();
  const [loadingPGP, setLoadingPGP] = React.useState<boolean>(true);

  React.useEffect(() => {
    (async () => {
      setLoadingPGP(true);
      const initialPGP = await pgpLocalStorage.get();

      if (initialPGP) {
        setPGP(initialPGP.publicKey);
      }
      setLoadingPGP(false);
    })();
  }, []);

  const createPGP = async (password: string, name: string, email: string) => {
    try {
      const result: PGP = await generateKeyPair(password, name, email);
      await pgpLocalStorage.save(result);
      setPGP(result.publicKey);
      // return { result.publicKey };
    } catch (error) {
      console.log(error);
    }
  };

  const reset = () => {
    pgpLocalStorage.clear();
    setPGP("");
  };

  const value = React.useMemo(
    () => ({
      pgp,
      createPGP,
      reset,
      loadingPGP
    }),
    [pgp, ethAddress, createMnemonic, reset]
  );

  return (
    <PGPContext.Provider value={value}>{props.children}</PGPContext.Provider>
  );
};

export const usePGP = () => {
  const context = React.useContext(PGPContext);

  if (context === undefined) {
    throw new Error("usePGP must be used within a PGPProvider");
  }

  return context;
};
