import * as React from "react";
import { Claim, ClaimType, ClaimWithValue, ClaimData } from "../types/claim";
import allClaims from "../data/claims";
import { claimsLocalStorage } from "../utils/local-storage";
import { displayClaimValue } from "../utils/claim-utils";
import { setBadgeCountAsync } from "expo-notifications";

type AddClaim_Value = string | { [key: string]: string };

export type ClaimsVault = {
  unclaimedClaims: Claim[];
  usersClaims: ClaimWithValue[];
  addClaim: (
    claimId: ClaimType,
    value: AddClaim_Value,
    files: string[],
    verified?: boolean
  ) => Promise<void>;
  reset: () => void;
  updateClaim: (
    claimId: ClaimType,
    value: AddClaim_Value,
    files: string[],
    verified: boolean
  ) => Promise<void>;
};

export const ClaimsContext = React.createContext<ClaimsVault | undefined>(
  undefined
);

export const ClaimsProvider: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  const [verifiedClaimTypes, setVerifiedClaimTypes] = React.useState<
    ClaimData[]
  >([]);

  React.useEffect(() => {
    (async () => {
      claimsLocalStorage.clear();
      const initialClaims = await claimsLocalStorage.get();

      if (initialClaims) {
        setVerifiedClaimTypes(initialClaims);
      }
    })();
  }, []);

  const updateClaim = async (
    claimType: ClaimType,
    value: AddClaim_Value,
    files: string[],
    verified: boolean
  ) => {
    const updatedClaimData = verifiedClaimTypes.map((claimData) => {
      if (claimData.type !== claimType) return claimData;

      return {
        ...claimData,
        value,
        files,
        verified
      };
    });

    setVerifiedClaimTypes(updatedClaimData);
    claimsLocalStorage.save(updatedClaimData);
  };

  const usersClaims: ClaimWithValue[] = React.useMemo(() => {
    const verifiedClaims: ClaimWithValue[] = [];
    allClaims.forEach((claim) => {
      const verifiedClaim = verifiedClaimTypes.find(
        (vc) => vc?.type === claim.type
      );
      if (verifiedClaim !== undefined) {
        verifiedClaims.push({
          ...claim,
          ...verifiedClaim
        });
      }
    });
    return verifiedClaims;
  }, [verifiedClaimTypes]);

  const unclaimedClaims = React.useMemo(
    () =>
      allClaims.filter(
        (claim) =>
          !verifiedClaimTypes.find(
            (verifiedClaim) => verifiedClaim.type === claim.type
          )
      ),
    [verifiedClaimTypes]
  );

  const addClaim = async (
    claimId: ClaimType,
    value: AddClaim_Value,
    files: string[],
    verified = false
  ) => {
    // This is a mock function.
    // In the future we will send this data off to an api to be verified
    console.log("making a claim", claimId, value, files);

    await new Promise((resolve) =>
      setTimeout(() => {
        resolve(null);
      }, 2000)
    );

    setVerifiedClaimTypes((previous) => {
      const previousWithoutClaim = previous.filter((c) => c.type !== claimId);
      const updatedClaims = [
        ...previousWithoutClaim,
        { type: claimId, value, verified }
      ];
      claimsLocalStorage.save(updatedClaims);
      return updatedClaims;
    });
  };

  const reset = () => {
    claimsLocalStorage.clear();
    setVerifiedClaimTypes([]);
  };

  const value = React.useMemo(
    () => ({
      unclaimedClaims,
      updateClaim,
      usersClaims,
      addClaim,
      reset
    }),
    [allClaims, verifiedClaimTypes, addClaim, reset, updateClaim]
  );

  return (
    <ClaimsContext.Provider value={value}>
      {props.children}
    </ClaimsContext.Provider>
  );
};

export const useClaimsStore = () => {
  const context = React.useContext(ClaimsContext);

  if (context === undefined) {
    throw new Error("useClaimsStore must be used within a ClaimsProvider");
  }
  return context;
};

export const useClaimValue = (claimType: ClaimType): string | undefined => {
  const { usersClaims } = useClaimsStore();
  const claim = usersClaims.find((c) => c.type === claimType);
  return claim ? displayClaimValue(claim) : undefined;
};
