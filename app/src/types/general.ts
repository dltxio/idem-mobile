type FieldType = "text" | "date" | "boolean";

export type Field = {
  id: string;
  title: string;
  type: FieldType;
};

export type Vendor = {
  description: string;
  logo: string;
  name: string;
  signup: string;
  tagline: string;
  website: string;
  backgroundColor: string;
};
