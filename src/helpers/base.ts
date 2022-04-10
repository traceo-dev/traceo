export const isEmpty = (
  obj: { [s: string]: unknown } | ArrayLike<unknown>
): boolean => {
  return Object.values(obj).every((e) => {
    return !e;
  });
};

export const getKeyFromBucketUrl = (url: string) => url.split("/")[4];

export const combineArray = (arr: [], arr2: []) => [...arr, ...arr2];
