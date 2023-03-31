import { DocumentTypeConstants } from "../constants/common";
import { DocumentField } from "./common";

export type Document = {
  id?: string;
  type: DocumentTypeConstants;
  title: string;
  fields?: DocumentField[];
  fileIds?: string[];
};

export type File = {
  id: string;
  documentType: DocumentTypeConstants;
  name: string;
  uri: string;
  hashes: {
    sha256: string;
    keccakHash: string;
  };
};

export type State = "QLD" | "NSW" | "ACT" | "VIC" | "NT" | "SA" | "WA" | "TAS";

export type DOB = {
  day: number;
  month: number;
  year: number;
};

export type Fullname = {
  givenName: string;
  middleNames?: string;
  surname: string;
};

export type LicenceData = {
  state: State;
  licenceNumber: string;
  cardNumber: string;
  name: Fullname;
  dob: DOB;
};

export type MedicareData = {
  colour: "Green" | "Blue" | "Yellow";
  number: string;
  individualReferenceNumber: string;
  name: string;
  dob: DOB;
  expiry: string;
  name2?: string;
  name3?: string;
  name4?: string;
};
