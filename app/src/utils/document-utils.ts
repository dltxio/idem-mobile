import allDocuments from "../data/documents";
import { Document, DocumentId } from "../types/document";

export const getDocumentFromDocumentId = (documentId: DocumentId): Document =>
  allDocuments.find((doc) => doc.id === documentId)!;

export const getImageFileName = (uri: string): string => {
  return uri.split("/").pop() as string;
};
