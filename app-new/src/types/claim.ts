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
};

export type VerifiedClaimData = {
  type: ClaimType;
  value: string;
};

export type VerifiedClaim = Claim & {
  value: string;
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
