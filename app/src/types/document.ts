export type DocumentType = "passport" | "drivers-license" | "profile-image";
export type Document = {
  type: DocumentType;
  title: string;
};

export type File = {
  id: string;
  documentType: DocumentType;
  name: string;
  uri: string;
  hashes: {
    sha256: string;
    keccakHash: string;
  };
};
