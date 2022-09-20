import { Vendor } from "./../types/general";
import { VendorEnum } from "../types/user";
import { ClaimWithValue } from "../types/claim";

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

export const getUnVerifyClaims = (
  vendor: Vendor | undefined,
  usersClaims: ClaimWithValue[]
) => {
  if (!vendor) return;

  return vendor.requiredClaimTypes.filter((requiredClaim) => {
    const userClaim = usersClaims.find(
      (claim) => claim.type === requiredClaim.type
    );
    if (
      !userClaim ||
      (requiredClaim.verified && userClaim?.verified !== requiredClaim.verified)
    ) {
      return requiredClaim;
    }
  });
};

export const getUnVerifiedClaimText = (
  vendor: Vendor | undefined,
  usersClaims: ClaimWithValue[]
) => {
  if (!vendor) return;

  const unVerifiedClaims = getUnVerifyClaims(vendor, usersClaims);

  if (!unVerifiedClaims || unVerifiedClaims.length === 0) {
    return;
  }

  const unVerifiedClaimsTitle = unVerifiedClaims.map((claim) => claim.type);

  if (unVerifiedClaimsTitle.length === 1) return unVerifiedClaimsTitle[0];

  return (
    unVerifiedClaimsTitle.slice(0, -1).join(", ") +
    " and " +
    unVerifiedClaimsTitle.slice(-1)
  );
};
