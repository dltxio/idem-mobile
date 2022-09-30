import { ClaimType } from "./claim";
import { DOB, Fullname, LicenceData, MedicareData } from "./document";

export type UserSignup = {
  source: number;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  mobile?: string;
  dob?: string;
};

export enum VendorEnum {
  GPIB = "GPIB",
  CoinStash = "CoinStash",
  CoinTree = "CoinTree",
  EasyCrypto = "EasyCrypto",
  DigitalSurge = "DigitalSurge"
}

export type UserVerifyRequest = {
  fullName: Fullname;
  dob: DOB;
  hashEmail: string;
  address?: Address;
  driversLicence: LicenceData;
  medicareCard: MedicareData;
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

export type IdemVerification = {
  result: KycResult;
  thirdPartyVerified: boolean;
  signature: string; //signed claim response
  message: ClaimResponsePayload;
  hashedPayload: string;
  JWTs: JWT[];
};

export type JWT = {
  claimType: ClaimType;
  jwt: string;
};

export type UserDto = {
  email: string;
  expoToken?: string;
  pgpPublicKey?: string;
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

export type uploadPublicKey = {
  email: string; //hashed email
  pgpPublicKey: string;
};

export type UsersResponse = {
  verifyPublicKey: boolean;
  userId: string;
  email: string;
  createdAt: Date;
  emailVerified: boolean;
};

export type SignupResponse = {
  userId: string;
  password?: string;
};

export type ExchangeSignupRequest = {
  verification: IdemVerification | undefined;
  source: number;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  mobile?: string | undefined;
  dob?: string | undefined;
};

export type Address = {
  flatNumber?: string;
  streetNumber: string;
  streetName: string;
  streetType: string;
  postcode: string;
  suburb: string;
  state: string;
  country: string;
};
