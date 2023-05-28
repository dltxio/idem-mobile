import * as Linking from "expo-linking";
import { KeyboardTypeOptions } from "react-native";
import { ClaimTypeConstants, DocumentTypeConstants } from "../constants/common";
import claims from "../data/claims";
import allClaims from "../data/claims";
import { Document } from "../types/document";
import {
  Claim,
  ClaimRequestParams,
  ClaimRequest,
  ClaimWithValue
} from "../types/claim";

export const getClaimScreenByType = (claimType: ClaimTypeConstants) => {
  switch (claimType) {
    case ClaimTypeConstants.AddressCredential:
      return "AddressClaim";
    case ClaimTypeConstants.AdultCredential:
      return "AdultClaim";
    case ClaimTypeConstants.BirthCredential:
      return "BirthClaim";
    case ClaimTypeConstants.EmailCredential:
      return "EmailClaim";
    case ClaimTypeConstants.MobileCredential:
      return "MobileClaim";
    case ClaimTypeConstants.NameCredential:
      return "NameClaim";
    default:
      return "Home";
  }
};

export const getUserClaimByType = (
  claimType: ClaimTypeConstants,
  usersClaims: ClaimWithValue[]
) => {
  const claim = getClaimFromType(claimType);
  const userClaim = usersClaims.find((c) => c.type === claim.type);

  return {
    claim,
    userClaim
  };
};

export const getClaimFromType = (claimType: ClaimTypeConstants): Claim => {
  const claim = allClaims.find((claim) => claim.type === claimType);
  if (claim) return claim;
  throw Error("Claim not found");
};

export const getClaimsFromTypes = (claimTypes: ClaimTypeConstants[]): Claim[] =>
  allClaims.filter((claim) => claimTypes.includes(claim.type));

export const parseClaimRequest = (
  claimRequest: ClaimRequestParams
): ClaimRequest | undefined => {
  if (!claimRequest.callback) {
    console.error("callback is required");
    return undefined;
  }

  if (!claimRequest.nonce) {
    console.error("nonce is required");
    return undefined;
  }

  const hostname = Linking.parse(claimRequest.callback).hostname;

  if (!hostname) {
    console.error("callbackUrl is invalid");
    return undefined;
  }

  if (!claimRequest.claims) {
    console.error("claims is required");
    return undefined;
  }

  const claimTypes = claimRequest.claims.split(",");

  const validClaimTypes = claimTypes.filter((ct) =>
    claims.find((c) => c.type === ct)
  );

  if (!validClaimTypes.length) {
    console.error("no valid claims");
    return undefined;
  }

  return {
    host: hostname,
    callback: claimRequest.callback,
    nonce: claimRequest.nonce,
    claims: validClaimTypes as ClaimTypeConstants[]
  };
};

export const displayClaimValue = (claim: ClaimWithValue): string => {
  const formatters: { [key in ClaimTypeConstants]: (value: any) => string } = {
    AdultCredential: (value: any) => value.over18,
    BirthCredential: (value: any) => value.dob,
    NameCredential: (value: any) =>
      `${value.firstName} ${value.middleName ? value.middleName : ""} ${
        value.lastName
      }`,
    EmailCredential: (value: any) => value.email,
    MobileCredential: (value: any) => value.mobileNumber,
    AddressCredential: (value: any) =>
      `${value.houseNumber} ${value.street} ${value.suburb}, ${value.postCode} ${value.state} ${value.country}`,
    TaxCredential: (value: any) => value.taxFileNumber,
    ProfileImageCredential: (value: any) => value.fileId
  };

  return formatters[claim.type](claim.value);
};

export const generateClaimRequestResponsePayload = (
  claims: ClaimWithValue[]
) => {
  const verifiableCredential = claims.map((claim) => {
    return {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      type: ["VerifiableCredential", claim.type],
      issuer: "https://idem.com.au/",
      issuanceDate: "2022-03-01T12:00:00Z",
      expirationDate: "2023-03-01T12:00:00Z",
      credentialSubject: claim.value,
      proof: {
        type: "EcdsaSecp256k1Signature2019",
        created: "2022-03-01T12:00:00Z",
        proofPurpose: "assertionMethod",
        verificationMethod:
          "https://idem.com.au/keys/0x645cD9fE9620649BF71a806bE803695B02f697Aa",
        jws: "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..TCYt5XsITJX1CxPCT8yAV-TVkIEq_PbChOMqsLfRoPsnsgw5WEuts01mq-pQy7UJiN5mgRxD-WUcX16dUEMGlv50aqzpqh4Qktb3rk-BuQy72IFLOqV0G_zS245-kronKb78cPN25DGlcTwLtjPAYuNzVBAh4vGHSrQyHUdBBPM"
      }
    };
  });

  return {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://schema.org"
    ],
    type: "VerifiablePresentation",
    proof: {
      type: "EcdsaSecp256k1Signature2019",
      created: "2022-03-01T12:00:00Z",
      proofPurpose: "authentication",
      verificationMethod: "did:idem:0x8444F8EF5694F09110B5191fCfab012f2E974135",
      challenge: "8b5c66c0-bceb-40b4-b099-d31b127bf7b3",
      domain: "https://demo.idem.com.au",
      jws: "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..kTCYt5XsITJX1CxPCT8yAV-TVIw5WEuts01mq-pQy7UJiN5mgREEMGlv50aqzpqh4Qq_PbChOMqsLfRoPsnsgxD-WUcX16dUOqV0G_zS245-kronKb78cPktb3rk-BuQy72IFLN25DYuNzVBAh4vGHSrQyHUGlcTwLtjPAnKb78"
    },
    verifiableCredential
  };
};

export const keyboardTypeMap: {
  [key: string]: KeyboardTypeOptions | undefined;
} = {
  house: "numbers-and-punctuation",
  email: "email-address",
  number: "number-pad",
  text: undefined
};

export const userCanVerify = (
  userClaims: ClaimWithValue[],
  userDocuments: Document[]
): boolean => {
  //The user needs all these claims saved to verify
  const requiredClaimsToVerify = [
    // ClaimTypeConstants.AddressCredential,
    ClaimTypeConstants.EmailCredential,
    ClaimTypeConstants.BirthCredential,
    ClaimTypeConstants.NameCredential
  ];
  //The user needs these documents attached to any claim in requiredClaimsToVerify
  const requiredDocumentsToVerify = [
    DocumentTypeConstants.LicenceDocument,
    DocumentTypeConstants.MedicareDocument
  ];

  const userDocumentTypes: string[] = [];

  const userClaimTypes = userClaims.map((claim) => {
    if (requiredClaimsToVerify.includes(ClaimTypeConstants[claim.type])) {
      //check if the required docuements are attached to any claim in requiredClaimsToVerify
      claim.files?.forEach((docId) => {
        const docType = userDocuments.find((doc) => doc.id === docId)?.type;
        if (docType && !userDocumentTypes.includes(docType))
          userDocumentTypes.push(docType);
      });

      //if the claim has a value assume the user has filled it out and it can be verified
      if (claim.value) return ClaimTypeConstants[claim.type];
    }
  });

  return (
    requiredClaimsToVerify.every((type) => userClaimTypes.includes(type)) &&
    requiredDocumentsToVerify.every((type) => userDocumentTypes.includes(type))
  );
};

// if every claim that should get verified by greenId is verified this returns true
// otherwise returns false
export const userHasVerified = (userClaims: ClaimWithValue[]) => {
  // The claims that need to be checked for verification
  const needsToBeUnverified = [
    // ClaimTypeConstants.AddressCredential,
    ClaimTypeConstants.BirthCredential,
    ClaimTypeConstants.NameCredential
  ];

  let alreadyVerified = true;

  userClaims.forEach((claim) => {
    if (
      needsToBeUnverified.includes(ClaimTypeConstants[claim.type]) &&
      !claim.verified
    ) {
      alreadyVerified = false;
    }
  });

  return alreadyVerified;
};
