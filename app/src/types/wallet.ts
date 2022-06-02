export type Wallet = {
  mnemonic: string;
};

export type PGP = {
  keyPair: {
    privateKey: string | undefined;
    publicKey: string | undefined;
  };
};
