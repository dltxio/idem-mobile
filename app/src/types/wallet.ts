export type Wallet = {
  mnemonic: string;
  ethAddress: string;
};

export type PGP = {
  privateKey: string | undefined;
  publicKey: string | undefined;
};
