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
  verified?: boolean;
  title: string;
  description: string;
  verificationAction: VerificationAction;
  fields: Field[];
  verificationDocuments: DocumentType[];
  hideFromList?: boolean;
};

export type ClaimData = {
  type: ClaimType;
  value: any; // each claim type has it own value type. todo - make generic
  files: string[];
  verified?: boolean;
};

export type ClaimWithValue = Claim & {
  value: any; // each claim type has it own value type. todo - make generic
  verified?: boolean;
  files: string[];
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

export type RequestOptResponse = {
  hash: string;
  expiryTimestamp: number;
};

export type VerifyOtpRequest = {
  code: string;
  hash: string;
  expiryTimestamp: number;
  mobileNumber: string;
};

export type PhoneType = {
  countryCode: string;
  number: string;
};

export type FormState = {
  [key: string]: string | PhoneType;
  mobileNumber: PhoneType;
};

export type MobileClaimFormState = {
  countryCode: string;
  number: string;
};
