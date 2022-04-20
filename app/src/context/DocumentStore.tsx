import * as React from "react";
import uuid from "react-native-uuid";
import { DocumentId, File } from "../types/document";
import { getImageFileName } from "../utils/document-utils";
import { fileLocalStorage } from "../utils/local-storage";

export type DocumentsValue = {
  files: File[];
  uploadFile: (claimId: DocumentId, file: string) => Promise<string>;
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

  const uploadFile = async (
    documentId: DocumentId,
    file: string
  ): Promise<string> => {
    const fileName = getImageFileName(file);
    if (!fileName) {
      throw new Error("Could not get filename from file uri");
    }

    // todo -  replace uuid with hash?
    const id = uuid.v4() as string;

    setFiles(previous => {
      const updatedFiles = [
        ...previous,
        { id, documentId: documentId, file, fileName }
      ];
      fileLocalStorage.save(updatedFiles);
      return updatedFiles;
    });

    return id;
  };

  const reset = () => {
    fileLocalStorage.clear();
    setFiles([]);
  };

  const value = React.useMemo(
    () => ({
      files,
      uploadFile,
      reset
    }),
    [files, uploadFile, reset]
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
