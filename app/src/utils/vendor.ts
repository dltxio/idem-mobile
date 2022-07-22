import { VendorEnum } from "../types/user";
export const getVendor = (vendorId: number) => {
  switch (vendorId) {
    case 1:
      return VendorEnum.GPIB;
    case 2:
      return VendorEnum.CoinStash;
    case 3:
      return VendorEnum.CoinTree;
    case 4:
      return VendorEnum.EasyCrypto;
    case 5:
      return VendorEnum.DigitalSurge;
    default:
      return undefined;
  }
};
