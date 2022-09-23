import * as React from "react";
import { Claim, ClaimType, ClaimWithValue, ClaimData } from "../types/claim";
import allClaims from "../data/claims";
import { claimsLocalStorage } from "../utils/local-storage";
import { displayClaimValue } from "../utils/claim-utils";

type KeyValueObject = { [key: string]: string };

type AddClaim_Value =
  | string
  | KeyValueObject
  | { [key: string]: string | KeyValueObject };

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
    claimValue: AddClaim_Value,
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
  const [claimData, setClaimData] = React.useState<ClaimData[]>([]);

  React.useEffect(() => {
    (async () => {
      const initialClaims = await claimsLocalStorage.get();

      if (initialClaims) {
        setClaimData(initialClaims);
      }
    })();
  }, []);

  const updateClaim = async (
    claimType: ClaimType,
    claimValue: AddClaim_Value,
    files: string[],
    verified: boolean
  ) => {
    setClaimData((prevClaimData) => {
      const updatedClaimData = prevClaimData.map((cd) => {
        if (cd.type !== claimType) return cd;

        return {
          ...cd,
          claimValue,
          files,
          verified
        };
      });
      claimsLocalStorage.save(updatedClaimData);
      return updatedClaimData;
    });
  };

  const usersClaims: ClaimWithValue[] = React.useMemo(() => {
    const verifiedClaims: ClaimWithValue[] = [];
    allClaims.forEach((claim) => {
      const verifiedClaim = claimData.find((vc) => vc?.type === claim.type);
      if (verifiedClaim !== undefined) {
        verifiedClaims.push({
          ...claim,
          ...verifiedClaim
        });
      }
    });
    return verifiedClaims;
  }, [claimData]);

  const unclaimedClaims = React.useMemo(
    () =>
      allClaims.filter(
        (claim) => !claimData.find((cd) => cd.type === claim.type)
      ),
    [claimData]
  );

  const addClaim = async (
    claimType: ClaimType,
    value: AddClaim_Value,
    files: string[],
    verified?: boolean
  ) => {
    // This is a mock function.
    // In the future we will send this data off to an api to be verified
    console.log("making a claim", claimType, value, files);

    await new Promise((resolve) =>
      setTimeout(() => {
        resolve(null);
      }, 2000)
    );

    setClaimData((prevClaimData) => {
      const otherClaimData = prevClaimData.filter(
        (cd) => cd.type !== claimType
      );
      const updatedClaims = [
        ...otherClaimData,
        { type: claimType, value, files, verified }
      ];
      claimsLocalStorage.save(updatedClaims);
      return updatedClaims;
    });
  };

  const reset = () => {
    claimsLocalStorage.clear();
    setClaimData([]);
  };

  const value = React.useMemo(
    () => ({
      unclaimedClaims,
      updateClaim,
      usersClaims,
      addClaim,
      reset
    }),
    [allClaims, claimData, usersClaims, addClaim, reset, updateClaim]
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
