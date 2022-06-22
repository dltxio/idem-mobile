type FieldType = "text" | "date" | "boolean";

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
};

export type VerifyOnProxy = {
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  address: string;
  // houseNumber: string;
  // street: string;
  // suburb: string;
  // postcode: string;
  // state: string;
  // country: string;
  // userId: string;
};
