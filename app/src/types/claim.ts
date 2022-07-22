import { Field } from "./general";
import { DocumentType } from "./document";

export type ClaimType =
  | "AdultCredential"
  | "BirthCredential"
  | "NameCredential"
  | "EmailCredential"
  | "MobileCredential"
  | "AddressCredential"
  | "TaxCredential"
  | "ProfileImageCredential";

export type VerificationAction = "document-upload" | "action" | "otp";

export type Claim = {
  type: ClaimType;
  key: string;
  mnemonic: string;
  title: string;
  description: string;
  verified?: boolean;
  verificationAction: VerificationAction;
  fields: Field[];
  verificationDocuments: DocumentType[];
  hideFromList?: boolean;
};

export type ClaimData = {
  type: ClaimType;
  value: any; // each claim type has it own value type. todo - make generic
};

export type ClaimWithValue = Claim & {
  value: any; // each claim type has it own value type. todo - make generic
};

export type ClaimRequestParams = {
  callback?: string;
  claims?: string;
  nonce?: string;
};

export type ClaimRequest = {
  host: string;
  callback: string;
  nonce: string;
  claims: ClaimType[];
};
