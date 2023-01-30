export const clearObject = <T>(obj: any) =>
  Object.entries(obj).reduce((a, [k, v]) => (
    v === "" ||
      v === null ||
      v === undefined ? a : ((a[k] = v), a)), {}) as T;