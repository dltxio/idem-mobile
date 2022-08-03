export type UserSignup = {
  source: number;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
};

export enum VendorEnum {
  GPIB = "GPIB",
  CoinStash = "CoinStash",
  CoinTree = "CoinTree",
  EasyCrypto = "EasyCrypto",
  DigitalSurge = "DigitalSurge"
}

export type UserVerifyRequest = {
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  houseNumber: string;
  street: string;
  suburb: string;
  postcode: string;
  state: string;
  country: string;
  userId: string;
};

export type RequestOtpRequest = {
  mobileNumber: string;
};

export enum KycResult {
  InProgress = "in_progress",
  Completed = "completed",
  Failed = "failed"
}

type ClaimResponsePayload = Record<string, unknown>;

export type VerificationResponse = {
  result: KycResult;
  userId: string;
  thirdPartyVerified: boolean;
  message: string; //signed claim response
  claimPayload: ClaimResponsePayload;
};

export type PutExpoTokenRequest = {
  token: string;
};

export type UserDetailRequest = {
  source: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: string;
};

export type verifyPGPRequest = {
  token: string;
  addresses: string[];
};
