export const joinClasses = (...args: string[]) => args.join(" ");

export const conditionClass = (condition: boolean, firstClass = "", secondClass = "") =>
    condition ? firstClass : secondClass;
