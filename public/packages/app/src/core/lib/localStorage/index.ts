const get = <T>(name: string): T => {
  const item = localStorage.getItem(name);
  if (item === null || typeof item !== "object") {
    return item as T;
  }

  return JSON.parse(item);
};

const set = (name: string, value: any) => {
  if (typeof value === "object") {
    localStorage.setItem(name, JSON.stringify(value));
  } else {
    localStorage.setItem(name, value);
  }
};

export const localStorageService = {
  get,
  set
};
