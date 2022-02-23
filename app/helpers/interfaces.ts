export interface IClaimPresentation {
  "@context": string[];
  type: string;
  verifiableCredential: IVerifiableCredential[];
  proof: IProof;
}

export interface IVerifiableCredential {
  "@context": string[];
  type: string[];
  issuer: string;
  issuanceDate: string;
  expirationDate: string;
  credentialSubject: {};
  proof: IProof;
}

export interface IProof {
  type: string;
  created: string;
  proofPurpose: string;
  verificationMethod: string;
  challenge?: string;
  domain?: string;
  jws: string;
} 
  
    // type ClaimValidated = {
    //   hash: string;
    //   signature: string;
    //   timestamp: number;
    // };
  
  export interface IClaimRequest {
    name: string;
    dob: string;
    mobile: string;
    email: string;
    address: string;
  };
  
    // interface CredentialSubject {
    //   id?: URI;
    //   name: URI;
    //   value: any;
    // }
  
    // interface Proof {
    //   type: URI;
    // }
    
    // interface CredentialStatus {
    //   id?: URI;
    //   type: URI
    // }
  
    // interface CredentialSchema {
    //   id?: URI;
    //   type: URI;
    // }
  
    // interface RefreshService {
    //   id?: URI;
    //   type: URI;
    // }
  
    // interface TermsOfUse {
    //   id?: URI;
    //   type: URI;
    //   obligation?: any;
    //   prohibition?: any;
    //   permission?: any;
    // }
  
    // interface Evidence {
    //   id?: URI;
    //   type: URI[];
    //   verifier: URI;
    //   evidenceDocument: string;
    //   subjectPresence: string;
    //   documentPresence: string;
    // }