export const extractPrivateKeyFromContent = (content: string) => {
  const privateKeyRegEx =
    /-----BEGIN PGP PRIVATE KEY BLOCK-----(.*)-----END PGP PRIVATE KEY BLOCK-----/s;
  const privateKey = content.match(privateKeyRegEx)?.[0];
  if (!privateKey) throw new Error("Not a private key");
  return privateKey;
};

export const trimFingerPrint = (fingerPrint: string) => {
  const short = fingerPrint.replace(/:/g, " ");
  return short.slice(short.length - 9) ?? "Missing PGP Fingerprint";
};

export const checkIfContentContainOnlyPublicKey = (content: string) => {
  const containPublicKey = content.includes(
    "-----BEGIN PGP PUBLIC KEY BLOCK-----"
  );
  const containPrivateKey = content.includes(
    "-----BEGIN PGP PRIVATE KEY BLOCK-----"
  );

  return containPublicKey && !containPrivateKey;
};
