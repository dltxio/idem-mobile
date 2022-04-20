import * as ImagePicker from "expo-image-picker";
import allDocuments from "../data/documents";
import { Document, DocumentId } from "../types/document";

export const DOCUMENT_IMAGE_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [4, 3],
  quality: 1
};

export const getDocumentFromDocumentId = (documentId: DocumentId): Document =>
  allDocuments.find(doc => doc.id === documentId)!;

export const getImageFileName = (uri: string): string | undefined => {
  return uri.split("/").pop();
};
