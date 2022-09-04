export const joinClasses = (...args: string[]) =>
  args.reduce((acc, a) => (a ? acc + " " + a : acc), "");

export const conditionClass = (condition: boolean, firstClass = "", secondClass = "") =>
  condition ? firstClass : secondClass;
