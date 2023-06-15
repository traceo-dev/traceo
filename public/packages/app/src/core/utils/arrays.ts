export const stringIncludes = (string: string, value: string | number | boolean) => {
  return string?.toLowerCase().includes(value.toString().toLowerCase());
};

export const arrayIncludes = (arr: string[], value: string | number | boolean) => {
  return arr?.some((e) => stringIncludes(e, value));
};

export const sameArrayValues = (arr: string[]) => {
  console.log("vals: ", arr);
  if (arr.length === 0) {
    return true; // Empty array is considered as having all values the same
  }

  const firstValue = arr[0];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] !== firstValue) {
      return false;
    }
  }

  return true;
};
