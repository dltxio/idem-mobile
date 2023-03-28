import { PartnerEnum } from "./user";

export type Exchange = {
  vendor: PartnerEnum;
  signup: boolean;
  userId: string;
};

export type VerifyUserRequestBody = {
  userName: string | undefined;
  password: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  yob: string | undefined;
};
