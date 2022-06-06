import * as Linking from "expo-linking";
import claims from "../data/claims";
import allClaims from "../data/claims";
import {
  Claim,
  ClaimRequestParams,
  ClaimType,
  ClaimRequest,
  ClaimWithValue
} from "../types/claim";

export const getClaimFromType = (claimType: ClaimType): Claim => {
  const claim = allClaims.find((claim) => claim.type === claimType);
  if (claim) return claim;
  throw Error("Claim not found");
};

export const getClaimsFromTypes = (claimTypes: ClaimType[]): Claim[] =>
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
    claims: validClaimTypes as ClaimType[]
  };
};

export const displayClaimValue = (claim: ClaimWithValue): string => {
  const formatters: { [key in ClaimType]: (value: any) => string } = {
    "18+": (value: any) => value.over18,
    DateOfBirthCredential: (value: any) => value.dob,
    FullNameCredential: (value: any) => value.firstName + " " + value.lastName,
    EmailCredential: (value: any) => value.email,
    MobileNumberCredential: (value: any) => value.mobileNumber,
    AddressCredential: (value: any) =>
      `${value.HouseNumber} ${value.streetName} ${value.streetType}, ${value.postCode}`,
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
