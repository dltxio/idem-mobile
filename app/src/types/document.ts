export type DocumentId = "passport" | "drivers-license" | "profile-image";

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
