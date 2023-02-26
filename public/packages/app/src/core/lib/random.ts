const generate = (length = 40) => {
  const arr = new Uint8Array(length / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, byteToHex).join("");
};

const byteToHex = (byte) => {
  return ("0" + byte.toString(16)).slice(-2);
};

export const random = {
  generate
};
