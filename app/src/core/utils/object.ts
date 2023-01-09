export const isEmptyObject = (obj: object): boolean => {
  return Object.values(obj).every(
    (x) => x === null || x === "" || x === undefined || x === "undefined"
  );
};

export const clearObject = <T>(obj: any) =>
  Object.entries(obj).reduce((a, [k, v]) => (
    v === "" ||
      v === null ||
      v === undefined ? a : ((a[k] = v), a)), {}) as T;