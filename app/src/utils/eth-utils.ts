import { ethers } from "ethers";

export type Mnemonic = {
  phrase: String;
  address: String;
  privateKey: String;
};

export const createMnemonic = () : Mnemonic => {
    const wallet = ethers.Wallet.createRandom();

    const result : Mnemonic = {
      phrase: wallet.mnemonic.phrase,
      address: wallet.address,
      privateKey: wallet.privateKey
    }

    return result;
};