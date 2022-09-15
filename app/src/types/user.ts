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
  user: {
    ruleId: "default";
    name: {
      givenName: string;
      middleNames?: string;
      surname: string;
    };
    dob: {
      day: number;
      month: number;
      year: number;
    };
  };
  licence?: {
    state: "QLD" | "NSW" | "ACT" | "VIC" | "NT" | "SA" | "WA" | "TAS";
    licenceNumber: string;
    cardNumber: string;
    name: {
      givenName: string;
      middleNames?: string;
      surname: string;
    };
    dob: {
      day: number;
      month: number;
      year: number;
    };
  };
  medicare?: {
    colour: "Green" | "Blue" | "Yellow";
    number: string;
    individualReferenceNumber: string;
    name: string;
    dob: string;
    expiry: string;
    name2?: string;
    name3?: string;
    name4?: string;
  };
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
  userId: string;
  thirdPartyVerified: boolean;
  signature: string; //signed claim response
  message: ClaimResponsePayload;
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
