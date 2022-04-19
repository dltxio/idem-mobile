import * as React from "react";
import { Claim, ClaimType, ClaimWithValue, ClaimData } from "../types/claim";
import allClaims from "../data/claims";
import { DocumentId } from "../types/document";
import { claimsLocalStorage } from "../utils/local-storage";
import { displayClaimValue } from "../utils/claim-utils";

export type ClaimsVault = {
  unclaimedClaims: Claim[];
  usersClaims: ClaimWithValue[];
  onClaim: (
    claimId: ClaimType,
    value: any,
    verificationDocument: DocumentId | undefined
  ) => Promise<void>;
  reset: () => void;
};

export const ClaimsContext = React.createContext<ClaimsVault | undefined>(
  undefined
);

export const ClaimsProvider: React.FC<{
  children: React.ReactNode;
}> = props => {
  const [verifiedClaimTypes, setVerifiedClaimTypes] = React.useState<
    ClaimData[]
  >([]);

  React.useEffect(() => {
    (async () => {
      const initialClaims = await claimsLocalStorage.get();

      if (initialClaims) {
        setVerifiedClaimTypes(initialClaims);
      }
    })();
  }, []);

  const usersClaims: ClaimWithValue[] = React.useMemo(
    () =>
      allClaims
        .filter(claim =>
          verifiedClaimTypes.find(
            verifiedClaim => verifiedClaim.type === claim.type
          )
        )
        .map(claim => {
          const verifiedClaim = verifiedClaimTypes.find(
            vc => vc.type === claim.type
          )!;

          return {
            ...claim,
            ...verifiedClaim
          };
        }),
    [verifiedClaimTypes]
  );

  const unclaimedClaims = React.useMemo(
    () =>
      allClaims.filter(
        claim =>
          !verifiedClaimTypes.find(
            verifiedClaim => verifiedClaim.type === claim.type
          )
      ),
    [verifiedClaimTypes]
  );

  const onClaim = async (
    claimId: ClaimType,
    value: string,
    verificationDocument: DocumentId | undefined
  ) => {
    // This is a mock function.
    // In the future we will send this data off to an api to be verified
    console.log("making a claim", claimId, value, verificationDocument);

    await new Promise(resolve =>
      setTimeout(() => {
        resolve(null);
      }, 2000)
    );

    setVerifiedClaimTypes(previous => {
      const updatedClaims = [...previous, { type: claimId, value }];
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
      usersClaims,
      onClaim,
      reset
    }),
    [allClaims, verifiedClaimTypes, onClaim, reset]
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

export const useVerifiedClaimValue = (
  claimType: ClaimType
): string | undefined => {
  const { usersClaims } = useClaimsStore();
  const claim = usersClaims.find(c => c.type === claimType);
  return claim ? displayClaimValue(claim) : undefined;
};
