import { Field } from "./general";
import { DocumentId } from "./document";

export type ClaimType =
  | "18+"
  | "DateOfBirthCredential"
  | "FullNameCredential"
  | "EmailCredential"
  | "MobileNumberCredential"
  | "AddressCredential"
  | "ProfileImageCredential";

export type VerificationAction = "document-upload" | "action";

export type Claim = {
  type: ClaimType;
  key: string;
  mnemonic: string;
  title: string;
  description: string;
  verified?: boolean;
  verificationAction: VerificationAction;
  fields: Field[];
  verificationDocuments: DocumentId[];
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

export type VerifyEmail = {
  token: string | undefined;
  addresses: string[];
};

export type UploadPGPKeyResponse = {
  token: string;
};
