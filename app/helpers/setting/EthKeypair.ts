import { Wallet } from "ethers";

export const GetEthKeypair = async (mnemonicKey: string) => {
  const walletMnemonic = Wallet.fromMnemonic(mnemonicKey);
  const walletPrivateKey = new Wallet(walletMnemonic.privateKey);

  if (walletMnemonic.address !== walletPrivateKey.address) {
    return;
  }
  const address = await walletMnemonic.getAddress();
  const privateKey = walletMnemonic.privateKey;
  const publicKey = walletMnemonic.publicKey;

  return {
    address,
    privateKey,
    publicKey,
  };
};
