export const isEmptyObject = (obj: object): boolean => {
  return Object.values(obj).every(
    (x) => x === null || x === "" || x === undefined || x === "undefined"
  );
};
