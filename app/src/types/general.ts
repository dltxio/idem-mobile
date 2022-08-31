import { ClaimType } from "./claim";

export type FieldType =
  | "text"
  | "date"
  | "boolean"
  | "number"
  | "email"
  | "phone"
  | "house";

export type Field = {
  id: string;
  title: string;
  type: FieldType;
};

export type UploadPGPKeyResponse = {
  token: string;
};

export type UserSignupResponse = {
  userId: string;
  tempPassword: string;
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
  requiredClaimTypes: ClaimType[];
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
