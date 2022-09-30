import { Vendor } from "./../types/general";
import { VendorEnum } from "../types/user";
import { ClaimWithValue } from "../types/claim";
import claims from "../data/claims";

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

  return vendor.requiredClaimTypes.map((requiredClaim) => {
    const userClaim = usersClaims.find(
      (claim) => claim.type === requiredClaim.type
    );
    if (!userClaim) {
      const claimTitle = claims.find(
        (c) => c.type === requiredClaim.type
      )?.title;
      return `${claimTitle?.toLocaleLowerCase()} claim to be completed`;
    }
    if (
      requiredClaim.verified &&
      userClaim?.verified !== requiredClaim.verified
    ) {
      return `${userClaim.title.toLocaleLowerCase()} claim to be verified`;
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

  const filterUnVerifiedClaims = unVerifiedClaims.filter(
    (unVerifiedClaim) => unVerifiedClaim !== undefined
  );

  if (filterUnVerifiedClaims.length === 0) return;

  if (filterUnVerifiedClaims.length === 1) return filterUnVerifiedClaims[0];

  return (
    filterUnVerifiedClaims.slice(0, -1).join(", ") +
    " and " +
    filterUnVerifiedClaims.slice(-1)
  );
};
