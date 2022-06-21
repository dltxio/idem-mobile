import * as React from "react";
import * as FileSystem from "expo-file-system";
import * as Crypto from "expo-crypto";
import uuid from "react-native-uuid";
import { DocumentId, File } from "../types/document";
import { getImageFileName } from "../utils/document-utils";
import { fileLocalStorage } from "../utils/local-storage";
import { keccak256 } from "ethers/lib/utils";
import { Buffer } from "buffer";
import { Alert } from "react-native";

export type DocumentsValue = {
  files: File[];
  addFile: (documentId: DocumentId, uri: string) => Promise<string>;
  deleteFile: (fileId: string) => void;
  reset: () => void;
};

export const DocumentsContext = React.createContext<DocumentsValue | undefined>(
  undefined
);

export const DocumentProvider: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  const [files, setFiles] = React.useState<File[]>([]);

  React.useEffect(() => {
    (async () => {
      await fileLocalStorage.clear();
      const initialDocuments = await fileLocalStorage.get();

      if (initialDocuments) {
        setFiles(initialDocuments);
      }
    })();
  }, []);

  const checkFileTypes = async (documentId: string) => {
    const files = await fileLocalStorage.get();
    const fileCheck = files?.map((file) => {
      const fileType = file.documentId;
      if (fileType === documentId) {
        Alert.alert(
          "Warning!",
          `You just added another ${documentId}. Please be sure your documents are up to date.`,
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
    documentId: DocumentId,
    uri: string
  ): Promise<string> => {
    const name = getImageFileName(uri);

    checkFileTypes(documentId);

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
      documentId,
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

  const reset = () => {
    fileLocalStorage.clear();
    setFiles([]);
  };

  const value = React.useMemo(
    () => ({
      files,
      addFile,
      deleteFile,
      reset
    }),
    [files, addFile, reset]
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
