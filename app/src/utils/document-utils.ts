import allDocuments from "../data/documents";
import { Document, DocumentId } from "../types/document";

export const getDocumentFromDocumentId = (documentId: DocumentId): Document => {
  const document = allDocuments.find((doc) => doc.id === documentId);
  if (document) return document;
  throw Error("Document not found");
};

export const getImageFileName = (uri: string): string => {
  return uri.split("/").pop() as string;
};
