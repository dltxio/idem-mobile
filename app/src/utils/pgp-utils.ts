import OpenPGP, { Options } from "react-native-fast-openpgp";
OpenPGP.useJSI = true;

export const genPGPG = async () => {
  try {
    const options: Options = {
      email: "idem@dltx.io",
      passphrase: "super long and hard to guess secret" // protects the private key
    };

    const generated = await OpenPGP.generate(options);
    console.log(generated);
    return generated.publicKey;
  } catch (e) {
    console.log(e);
  }
};
