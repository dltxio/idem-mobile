import OpenPGP from "react-native-fast-openpgp";

type PgpKeypair = {
  name: string;
  email: string;
  passphrase: string | undefined;
};

export const CreatePGPKeypair = async (keypair: PgpKeypair) => {
  const { privateKey, publicKey } = await OpenPGP.generate({
    name: keypair.name,
    email: keypair.email,
    passphrase: keypair.passphrase,
    keyOptions: {
      rsaBits: 2048,
    },
  });

  return {
    privateKey,
    publicKey,
  };
};
