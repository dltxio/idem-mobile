import * as React from "react";
import { pgpLocalStorage } from "../utils/local-storage";
import OpenPGP, { KeyPair, Options } from "react-native-fast-openpgp";

export type PGPValue = {
  keyPair: KeyPair;
  generatePGP: (options?: Options) => Promise<KeyPair | undefined>;
  reset: () => void;
};

export const PGPContext = React.createContext<PGPValue | undefined>(undefined);

export const PGPProvider: React.FC<{
  children: React.ReactNode;
}> = props => {
  const [keyPair, setKeyPair] = React.useState<KeyPair>({
    publicKey: "",
    privateKey: ""
  });

  React.useEffect(() => {
    (async () => {
      const initialKeyPair = await pgpLocalStorage.get();

      if (initialKeyPair) {
        setKeyPair(initialKeyPair);
      }
    })();
  }, []);

  const generatePGP = async (options?: Options) => {
    try {
      const keyPair = await OpenPGP.generate(options ? options : {});
      await pgpLocalStorage.save(keyPair);
      setKeyPair(keyPair);
      return keyPair;
    } catch (error) {
      console.log(error);
    }
  };

  const reset = () => {
    pgpLocalStorage.clear();
    setKeyPair({ publicKey: "", privateKey: "" });
  };

  const value = React.useMemo(
    () => ({
      keyPair,
      generatePGP,
      reset
    }),
    [keyPair, generatePGP, reset]
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
