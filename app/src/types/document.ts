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
  id?: string;
  type: DocumentType;
  title: string;
  fields?: Field[];
  fileIds?: string[];
};

export type Field = {
  title: string;
  type: FieldType;
  optional?: boolean;
  valueOptions?: string[];
  value?: string;
};

export type FieldType = "string" | "date" | "number" | "dropdown";

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
