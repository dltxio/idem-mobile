import { Field } from "./general";
import { DocumentId } from "./document";

export type ClaimType =
  | "18+"
  | "DateOfBirthCredential"
  | "FullNameCredential"
  | "EmailCredential"
  | "MobileNumberCredential"
  | "AddressCredential";

export type VerificationAction = "document-upload" | "form";

export type Claim = {
  type: ClaimType;
  key: string;
  nnemonic: string;
  title: string;
  description: string;
  verificationAction: VerificationAction;
  fields: Field[];
  verificationDocuments: DocumentId[];
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
