import { Dictionary } from "@traceo/types";

export const stringIncludes = (string: string, value: string | number | boolean) => {
  return string?.toLowerCase().includes(value.toString().toLowerCase());
};

export const arrayIncludes = (arr: string[], value: string | number | boolean) => {
  return arr?.some((e) => stringIncludes(e, value));
};

export const sameArrayValues = (arr: string[]) => {
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

// Check if two arrays has this same values on every field
export const areArraysEqual = (arr1: Dictionary<unknown>[], arr2: Dictionary<unknown>[]): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    const obj1 = arr1[i];
    const obj2 = arr2[i];

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let j = 0; j < keys1.length; j++) {
      const key = keys1[j];

      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }
  }

  return true;
}
