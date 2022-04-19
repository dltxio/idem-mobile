export type DocumentId = "passport" | "drivers-license";

export type Document = {
  id: DocumentId;
  title: string;
};

export type File = {
  id: string;
  documentId: DocumentId;
  fileName: string;
  file: string;
};
