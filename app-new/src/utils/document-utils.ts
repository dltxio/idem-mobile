import allDocuments from "../data/documents";
import { ClaimType } from "../types/claim";
import { Document, DocumentId } from "../types/document";

export const getDocumentsThatProveClaim = (claimType: ClaimType): Document[] =>
  allDocuments.filter(document => {
    for (const field of document.fields) {
      if (field.claimTypes.includes(claimType)) {
        return true;
      }
    }
    return false;
  });

export const getDocumentFromDocumentId = (documentId: DocumentId): Document =>
  allDocuments.find(doc => doc.id === documentId)!;

export const getDocumentsClaims = (document: Document): ClaimType[] => {
  const claims: ClaimType[] = [];
  for (const field of document.fields) {
    claims.push(...field.claimTypes);
  }
  return claims;
};
