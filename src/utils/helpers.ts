export const isEmpty = (
  obj: { [s: string]: unknown } | ArrayLike<unknown>
): boolean => {
  return Object.values(obj).every((e) => {
    return !e;
  });
};

export const getKeyFromBucketUrl = (url: string) => url.split("/")[3];

export const combineArray = (arr: [], arr2: []) => [...arr, ...arr2];
