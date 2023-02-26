const get = (item: string) => {
  return document.cookie
    .split("; ")
    .filter((i) => i.startsWith(item))
    .map((c) => c.split("=")[1])[0];
};

const clear = () => {
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
};
export const cookie = {
  get,
  clear
};
