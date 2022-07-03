import * as openpgp from "openpgp";
import { Claim } from "../types/claim";

export const genPGPG = async (password: string, email: Claim) => {

  const { privateKey, publicKey, revocationCertificate } = await openpgp.generateKey({
        type: "ecc", // Type of the key, defaults to ECC
        curve: "curve25519", // ECC curve name, defaults to curve25519
        userIDs: [{ name: "Satoshi", email: "dem@dltx.io" }], // you can pass multiple user IDs
        passphrase: password,
        format: "armored" // output key format, defaults to 'armored' (other options: 'binary' or 'object')
    });

    console.log(privateKey);     // '-----BEGIN PGP PRIVATE KEY BLOCK ... '
    console.log(publicKey);      // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
    console.log(revocationCertificate); // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
};
