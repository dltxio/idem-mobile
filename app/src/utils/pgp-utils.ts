import * as openpgp from "openpgp";
// import { Claim } from "../types/claim";

import type { PGP } from "../types/wallet";

export const genPGPG = async (password: string, name: string, email: string) : Promise<PGP> => {

  const { privateKey, publicKey } = await openpgp.generateKey({
        type: "ecc", // Type of the key, defaults to ECC
        curve: "curve25519", // ECC curve name, defaults to curve25519
        userIDs: [{ name: name, email: email }], // you can pass multiple user IDs
        passphrase: password,
        format: "armored" // output key format, defaults to 'armored' (other options: 'binary' or 'object')
    });

    const pgp : PGP = {
      privateKey: privateKey,
      publicKey: publicKey
    }

    return pgp;
};
