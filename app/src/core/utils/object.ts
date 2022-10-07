export const isEmptyObject = (obj: object): boolean => {
  return Object.values(obj).every(
    (x) => x === null || x === "" || x === undefined || x === "undefined"
  );
};

export const toFlatPropertyMap = (obj: object, keySeparator = ".") => {
  const flattenRecursive = (
    obj: object,
    parentProperty?: string,
    propertyMap: Record<string, unknown> = {}
  ): Record<string, any> => {
    for (const [key, value] of Object.entries(obj)) {
      const property = parentProperty ? `${parentProperty}${keySeparator}${key}` : key;
      if (value && typeof value === "object") {
        flattenRecursive(value, property, propertyMap);
      } else {
        propertyMap[property] = value;
      }
    }
    return propertyMap;
  };
  return flattenRecursive(obj);
};
