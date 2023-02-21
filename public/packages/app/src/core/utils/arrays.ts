export const stringIncludes = (string: string, value: string | number | boolean) => {
  return string?.toLowerCase().includes(value.toString().toLowerCase());
};

export const arrayIncludes = (arr: string[], value: string | number | boolean) => {
  return arr?.some((e) => stringIncludes(e, value));
};
