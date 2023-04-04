import { ClaimTypeConstants } from "../constants/common";

// Should these be an enum?
export type FieldType =
  | "boolean"
  | "text"
  | "date"
  | "dropdown"
  | "number"
  | "email"
  | "phone"
  | "house";

// Should we use a union type here?  export type DocumentField = Field & {
export type DocumentField = {
  title: string;
  type: FieldType;
  optional?: boolean;
  valueOptions?: string[];
  value?: string;
};

export type Field = {
  id: string;
  title: string;
  type: FieldType;
};

export type Vendor = {
  id: number;
  description: string;
  logo: string;
  name: string;
  signup: string;
  tagline: string;
  website: string;
  backgroundColor: string;
  requiredClaimTypes: RequiredClaimType[];
  useProxy: boolean;
  tempPassword: boolean;
  passwordComplexity: string;
  verifyClaims: boolean;
  enabled: boolean;
};

export type RequiredClaimType = {
  type: ClaimTypeConstants;
  verified: boolean;
};

export type VerifyOnProxy = {
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  houseNumber: string;
  street: string;
  suburb: string;
  postcode: string;
  state: string;
  country: string;
  userId: string;
};
