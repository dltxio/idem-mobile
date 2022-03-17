import { ClaimType } from "./claim";

export type DocumentId = "passport" | "driversLicense";

export type DocumentField = {
  id: string;
  title: string;
  type: "text" | "date";
  claimTypes: ClaimType[];
};

export type Document = {
  id: DocumentId;
  title: string;
  fields: DocumentField[];
};
