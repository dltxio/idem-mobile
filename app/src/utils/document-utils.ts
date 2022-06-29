import allDocuments from "../data/documents";
import { Document, DocumentType } from "../types/document";

export const getDocumentFromDocumentType = (
  documentType: DocumentType
): Document => {
  const document = allDocuments.find((doc) => doc.type === documentType);
  if (document) return document;
  throw Error("Document not found");
};

export const getImageFileName = (uri: string): string => {
  return uri.split("/").pop() as string;
};
