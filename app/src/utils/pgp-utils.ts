export const extractPrivateKeyFromContent = (content: string) => {
  const privateKeyRegEx =
    /-----BEGIN PGP PRIVATE KEY BLOCK-----(.*)-----END PGP PRIVATE KEY BLOCK-----/s;
  const privateKey = content.match(privateKeyRegEx)?.[0];
  if (!privateKey) throw new Error("Not a private key");
  return privateKey;
};

const convertToHexArray = (fingerPrint: string) => {
  const hexArray = fingerPrint.split(":").map((numberString) => {
    const number = parseInt(numberString);
    return number.toString(16).padStart(2, "0");
  });
  return hexArray;
};

export const formatFingerPrint = (fingerPrint: string) => {
  const hexArray = convertToHexArray(fingerPrint);
  const lastFourPair = hexArray.slice(-4);
  return lastFourPair.join(" ");
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
