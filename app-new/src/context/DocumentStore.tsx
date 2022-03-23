import * as React from "react";
import { DocumentId, DocumentWithFile } from "../types/document";
import { documentsLocalStorage } from "../utils/local-storage";

export type DocumentsValue = {
  documents: DocumentWithFile[];
  uploadDocument: (claimId: DocumentId, file: string) => Promise<void>;
};

export const DocumentsContext = React.createContext<DocumentsValue | undefined>(
  undefined
);

export const DocumentProvider: React.FC<{
  children: React.ReactNode;
}> = props => {
  const [documents, setDocuments] = React.useState<DocumentWithFile[]>([]);

  React.useEffect(() => {
    (async () => {
      const initialDocuments = await documentsLocalStorage.get();

      if (initialDocuments) {
        setDocuments(initialDocuments);
      }
    })();
  }, []);

  const uploadDocument = async (id: DocumentId, file: string) => {
    setDocuments(previous => {
      const updatedDocuments = [...previous, { id, file }];
      documentsLocalStorage.save(updatedDocuments);
      return updatedDocuments;
    });
  };

  const value = React.useMemo(
    () => ({
      documents,
      uploadDocument
    }),
    [documents, uploadDocument]
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
