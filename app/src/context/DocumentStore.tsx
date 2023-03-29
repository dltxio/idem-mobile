import * as React from "react";
import * as FileSystem from "expo-file-system";
import * as Crypto from "expo-crypto";
import uuid from "react-native-uuid";
import { Document, File } from "../types/document";
import { getImageFileName } from "../utils/document-utils";
import { documentLocalStorage, fileLocalStorage } from "../utils/local-storage";
import { keccak256 } from "ethers/lib/utils";
import { Buffer } from "buffer";
import { Alert } from "react-native";
import { AlertTitle, DocumentTypeConstants } from "../constants/common";

export type DocumentsValue = {
  files: File[];
  addFile: (
    documentType: DocumentTypeConstants,
    uri: string
  ) => Promise<string>;
  deleteFile: (fileId: string) => void;
  resetFiles: () => void;
  documents: Document[];
  addDocument: (_document: Document) => Promise<string>;
  deleteDocument: (documentId: string) => void;
  resetDocuments: () => void;
};

export const DocumentsContext = React.createContext<DocumentsValue | undefined>(
  undefined
);

export const DocumentProvider: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [documents, setDocuments] = React.useState<Document[]>([]);

  React.useEffect(() => {
    (async () => {
      const initialFiles = await fileLocalStorage.get();
      const initialDocuments = await documentLocalStorage.get();

      if (initialFiles) setFiles(initialFiles);
      if (initialDocuments) setDocuments(initialDocuments);
    })();
  }, []);

  const checkFileTypes = async (documentType: string) => {
    const files = await fileLocalStorage.get();
    const fileCheck = files?.map((file) => {
      const fileType = file.documentType;
      if (fileType === documentType) {
        Alert.alert(
          AlertTitle.Warning,
          `You just added another ${documentType}. Please be sure your documents are up to date.`,
          [
            {
              text: "OK",
              style: "cancel"
            }
          ],
          {
            cancelable: true
          }
        );
      }
    });
    return fileCheck;
  };

  const addFile = async (
    documentType: DocumentTypeConstants,
    uri: string
  ): Promise<string> => {
    const name = getImageFileName(uri);

    checkFileTypes(documentType);

    if (!name) {
      throw new Error("Could not get filename from file uri");
    }

    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: "base64"
    });

    const sha256 = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      base64
    );

    const buffer = Buffer.from(base64, "base64");
    const keccakHash = keccak256(buffer);

    // todo -  replace uuid with hash?
    const id = uuid.v4() as string;

    const newFile: File = {
      id,
      documentType,
      name,
      uri: uri,
      hashes: {
        sha256,
        keccakHash
      }
    };

    setFiles((previous) => {
      const updatedFiles = [...previous, newFile];
      fileLocalStorage.save(updatedFiles);
      return updatedFiles;
    });

    return id;
  };

  const deleteFile = (fileId: string) => {
    const updatedFiles = files.filter((files) => files.id !== fileId);
    fileLocalStorage.save(updatedFiles);
    setFiles(updatedFiles);
  };

  const resetFiles = () => {
    fileLocalStorage.clear();
    setFiles([]);
  };

  const addDocument = async (_document: Document): Promise<string> => {
    const id = uuid.v4() as string;

    const newDocument: Document = {
      id,
      ..._document
    };

    setDocuments((previous) => {
      const oldDocs = previous.filter((doc) => doc.id !== newDocument.id);
      const updatedDocuments = [...oldDocs, newDocument];
      documentLocalStorage.save(updatedDocuments);
      return updatedDocuments;
    });

    return id;
  };

  const deleteDocument = (documentId: string) => {
    const updatedDocuments = documents.filter((doc) => doc.id !== documentId);
    documentLocalStorage.save(updatedDocuments);
    setDocuments(updatedDocuments);
  };

  const resetDocuments = () => {
    documentLocalStorage.clear();
    setDocuments([]);
  };

  const value = React.useMemo(
    () => ({
      files,
      addFile,
      deleteFile,
      resetFiles,
      documents,
      addDocument,
      deleteDocument,
      resetDocuments
    }),
    [files, addFile, resetFiles, documents, addDocument, resetDocuments]
  );

  return (
    <DocumentsContext.Provider value={value}>
      {props.children}
    </DocumentsContext.Provider>
  );
};

export const useDocumentStore = () => {
  const context = React.useContext(DocumentsContext);

  if (context === undefined) {
    throw new Error("useDocumentStore must be used within a DocumentProvider");
  }
  return context;
};
