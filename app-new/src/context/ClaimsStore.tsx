import * as React from "react";
import {
  Claim,
  ClaimType,
  VerifiedClaim,
  VerifiedClaimData
} from "../types/claim";
import allClaims from "../data/claims";
import { DocumentId } from "../types/document";
import { getDocumentFromDocumentId } from "../utils/document-utils";

export type AccountVault = {
  unclaimedClaims: Claim[];
  usersClaims: VerifiedClaim[];
  onVerifyDocument: (
    documentId: DocumentId,
    data: { [key: string]: string }
  ) => Promise<void>;
};

export const ClaimsContext = React.createContext<AccountVault | undefined>(
  undefined
);

export const ClaimsProvider: React.FC<{
  children: React.ReactNode;
}> = props => {
  const [verifiedClaimTypes, setVerifiedClaimTypes] = React.useState<
    VerifiedClaimData[]
  >([]);

  const usersClaims: VerifiedClaim[] = React.useMemo(
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

  const onVerifyDocument = async (
    documentId: DocumentId,
    data: { [key: string]: string }
  ) => {
    // This is a mock function.
    // In the future we will send this data off to an api to be verified
    console.log("Verifying document", documentId, data);
    const document = getDocumentFromDocumentId(documentId);

    const newVerifiedClaims: VerifiedClaimData[] = [];

    for (const field of document.fields) {
      const fieldData = data[field.id];
      if (!fieldData) {
        continue;
      }

      for (const claimType of field.claimTypes) {
        newVerifiedClaims.push({
          type: claimType,
          value: fieldData
        });
      }
    }

    await new Promise(resolve =>
      setTimeout(() => {
        resolve(null);
      }, 2000)
    );

    setVerifiedClaimTypes(previous => [...previous, ...newVerifiedClaims]);
  };

  const value = React.useMemo(
    () => ({
      unclaimedClaims,
      usersClaims,
      onVerifyDocument
    }),
    [allClaims, verifiedClaimTypes, onVerifyDocument]
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
  return claim ? claim.value : undefined;
};
