type Uuid = string;
type Url = string;
type Tag = string;

type UniversalWalletMnemonic = {
  "@context": ["https://w3id.org/wallet/v1"];
  id: Uuid;
  name: string;
  image?: Url;
  description?: string;
  tags?: Tag[];
  correlation?: Uuid[];
  type: "Mnemonic";
  value: string;
};

export type Wallet = {
  mnemonic: UniversalWalletMnemonic;
  ethAddress: string;
};

export type PGP = {
  privateKey: string;
  publicKey: string;
  // fingerPrint: string;
};
