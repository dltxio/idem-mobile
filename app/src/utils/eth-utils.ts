import { ethers } from "ethers";

export const createMnemonic = async () => {
    const wallet = ethers.Wallet.createRandom();
    return { wallet.mnemonic.phrase, wallet.address };
};