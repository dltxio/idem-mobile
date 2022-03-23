import allDocuments from "../data/documents";
import { Document, DocumentId } from "../types/document";

export const getDocumentFromDocumentId = (documentId: DocumentId): Document =>
  allDocuments.find(doc => doc.id === documentId)!;
