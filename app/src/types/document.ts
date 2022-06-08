export type DocumentId = "passport" | "drivers-license" | "profile-image";

export type Document = {
  id: DocumentId;
  title: string;
};

export type File = {
  id: string;
  documentId: DocumentId;
  name: string;
  uri: string;
  hashes: {
    sha256: string;
    keccakHash: string;
  };
};

export type KeyStore = {
  privateKey: string;
  publicKey: string;
};
