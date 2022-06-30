export type UserSignup = {
  source: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
};

export enum VenderEnum {
  GPIB = "GPIB",
  CoinStash = "CoinStash",
  EasyCrypto = "EasyCrypto"
}
