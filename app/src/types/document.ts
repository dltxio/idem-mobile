export type DocumentType =
  | "passport"
  | "drivers-licence"
  | "birth-certificate"
  | "bank-statement"
  | "rates-notice"
  | "utility-account"
  | "medicare-card"
  | "profile-image";
export type Document = {
  type: DocumentType;
  title: string;
};

export type File = {
  id: string;
  timeStamp: string;
  documentType: DocumentType;
  name: string;
  uri: string;
  hashes: {
    sha256: string;
    keccakHash: string;
  };
};
