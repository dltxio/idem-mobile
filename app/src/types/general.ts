type FieldType = "text" | "date" | "boolean";

export type Field = {
  id: string;
  title: string;
  type: FieldType;
};

export type UploadPGPKeyResponse = {
  token: string;
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
  requiredClaimMnemonics: string[];
};

// export type VerifyEmail = {
//   token: string | undefined;
//   addresses: string[];
// };

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
