import { ethers } from "ethers";

export const createMnemonic = () => {
  const wallet = ethers.Wallet.createRandom();

  const result = {
    mnemonicPhrase: wallet.mnemonic.phrase,
    ethAddress: wallet.address
  };

  return result;
};
