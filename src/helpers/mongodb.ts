const getDocuments = <T>(snap: any[]) => snap.map((d: T) => ({ ...d })) || [];
const getDocument = <T>(document: any) => {
  return {
    id: document?._id,
    ...document,
  } as unknown as T;
};

export const mongoDbUtils = {
    getDocument,
    getDocuments
}