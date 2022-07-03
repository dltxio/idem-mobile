import { ethers } from "ethers";
import type { Wallet } from "../types/wallet";

export const createMnemonic = () : Wallet => {
    const wallet = ethers.Wallet.createRandom();

    const result : Wallet = {
      mnemonic: wallet.mnemonic.phrase,
      ethAddress: wallet.address
    }

    return result;
};