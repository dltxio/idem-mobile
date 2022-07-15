import { VendorEnum } from "../types/user";
export const getVendor = (vendorId: number) => {
  switch (vendorId) {
    case 1:
      return VendorEnum.GPIB;
    case 2:
      return VendorEnum.CoinStash;
    case 6:
      return VendorEnum.EasyCrypto;
    case 7:
      return VendorEnum.DigitalSurge;
    default:
      return undefined;
  }
};
