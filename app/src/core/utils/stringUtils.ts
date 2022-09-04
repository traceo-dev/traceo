export const toTitleCase = (str: string): string => {
  return str?.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

export const wrapIncidentMessage = (str: string): string => {
  return str.length > 80 ? str.substring(0, 77).concat("...") : str;
};

export const slugifyForUrl = (str?: string) => {
  return str
    ?.toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
};
