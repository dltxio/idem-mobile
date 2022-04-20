import * as React from "react";
import * as ImagePicker from "expo-image-picker";
import * as Crypto from "expo-crypto";
import uuid from "react-native-uuid";
import { DocumentId, File } from "../types/document";
import { getImageFileName } from "../utils/document-utils";
import { fileLocalStorage } from "../utils/local-storage";

export type DocumentsValue = {
  files: File[];
  addFile: (
    documentId: DocumentId,
    file: ImagePicker.ImageInfo
  ) => Promise<string>;
  deleteFile: (fileId: string) => void;
  reset: () => void;
};

export const DocumentsContext = React.createContext<DocumentsValue | undefined>(
  undefined
);

export const DocumentProvider: React.FC<{
  children: React.ReactNode;
}> = props => {
  const [files, setFiles] = React.useState<File[]>([]);

  React.useEffect(() => {
    (async () => {
      const initialDocuments = await fileLocalStorage.get();

      if (initialDocuments) {
        setFiles(initialDocuments);
      }
    })();
  }, []);

  const addFile = async (
    documentId: DocumentId,
    file: ImagePicker.ImageInfo
  ): Promise<string> => {
    const name = getImageFileName(file.uri);
    if (!name) {
      throw new Error("Could not get filename from file uri");
    }

    if (!file.base64) {
      throw new Error("No base64");
    }

    const sha256 = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      file.base64
    );

    // todo -  replace uuid with hash?
    const id = uuid.v4() as string;

    const newFile: File = {
      id,
      documentId,
      name,
      uri: file.uri,
      hashes: {
        sha256
      }
    };

    setFiles(previous => {
      const updatedFiles = [...previous, newFile];
      fileLocalStorage.save(updatedFiles);
      return updatedFiles;
    });

    return id;
  };

  const deleteFile = (fileId: string) => {
    const updatedFiles = files.filter(files => files.id !== fileId);
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
