import { VendorEnum } from "./user";

export type Exchange = {
  vendor: VendorEnum;
  signup: boolean;
};

export type VerifyUserRequestBody = {
  userName: string | undefined;
  password: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  yob: string | undefined;
};
