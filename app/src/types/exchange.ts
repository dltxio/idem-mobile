import { VendorEnum } from "./user";

export type Exchange = {
  vendor: VendorEnum;
  signup: boolean;
  userId: string;
};
