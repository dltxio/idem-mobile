export type DocumentId = "passport" | "drivers-license";

export type Document = {
  id: DocumentId;
  title: string;
};

export type DocumentWithFile = {
  id: DocumentId;
  file: string;
};
