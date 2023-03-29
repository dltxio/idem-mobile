import { ClaimTypeConstants, DocumentTypeConstants } from "../constants/common";
import { Field } from "./general";

export type VerificationAction = "document-upload" | "action" | "otp";

export type Claim = {
  type: ClaimTypeConstants;
  key: string;
  mnemonic: string;
  verified?: boolean;
  title: string;
  description: string;
  verificationAction: VerificationAction;
  fields: Field[];
  verificationDocuments: DocumentTypeConstants[];
  hideFromList?: boolean;
};

export type ClaimData = {
  type: ClaimTypeConstants;
  value: any; // each claim type has it own value type. todo - make generic
  files?: string[];
  verified?: boolean;
  proof?: string;
};

export type ClaimWithValue = Claim & {
  value: any; // each claim type has it own value type. todo - make generic
  verified?: boolean;
  files?: string[];
  proof?: string;
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
  claims: ClaimTypeConstants[];
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
