// we need to import react-native-get-random-values & @ethersproject/shims
// so that wallets are generated from a random source
import "react-native-get-random-values";
import "@ethersproject/shims";
import { ethers } from "ethers";
import { hasMnemonicLocalStorage, mnemonicLocalStorage } from "./local-storage";

export const createAndSaveWallet = async () => {
  const wallet = ethers.Wallet.createRandom();
  await mnemonicLocalStorage.save(wallet.mnemonic);
  await hasMnemonicLocalStorage.save(true);
};

export const userHasWallet = async () =>
  !!(await hasMnemonicLocalStorage.get());

export const deleteWallet = async () => {
  mnemonicLocalStorage.clear();
  hasMnemonicLocalStorage.clear();
};

export const getWallet = async () => {
  const mnemonic = await mnemonicLocalStorage.get();
  if (!mnemonic) {
    return undefined;
  }

  return ethers.Wallet.fromMnemonic(mnemonic.phrase, mnemonic.path);
};
