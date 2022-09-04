export const handleStatus = (statusCode: string) => {
  const status = Number(statusCode);
  return status >= 200 && status < 299 ? "success" : "error";
};
