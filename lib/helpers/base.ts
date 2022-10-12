export const isEmpty = (obj: object): boolean => {
  return Object.values(obj).every(
    (x) => x === null || x === "" || x === undefined || x === "undefined"
  );
};

export const getKeyFromBucketUrl = (url: string) => url.split("/")[4];

export const combineArray = (arr: [], arr2: []) => [...arr, ...arr2];
