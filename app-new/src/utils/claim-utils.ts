import allClaims from "../data/claims";
import { Claim, ClaimType } from "../types/claim";

export const getClaimFromType = (claimType: ClaimType): Claim =>
  allClaims.find(claim => claim.type === claimType)!;

export const getClaimsFromTypes = (claimTypes: ClaimType[]): Claim[] =>
  allClaims.filter(claim => claimTypes.includes(claim.type));
