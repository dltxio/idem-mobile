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
