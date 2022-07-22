import { ethers } from "ethers";

export const createMnemonic = () => {
  const wallet = ethers.Wallet.createRandom();

  return {
    mnemonicPhrase: wallet.mnemonic.phrase,
    ethAddress: wallet.address
  };
};
