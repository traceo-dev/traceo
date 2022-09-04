export const isEmptyObject = (object): boolean => {
  return Object.values(object).every(
    (x) => x === null || x === "" || x === undefined || x === "undefined"
  );
};
