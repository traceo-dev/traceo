export function getMessageFromError(
  err: string | (Error & { data?: any; statusText?: string })
): string {
  if (err && typeof err !== "string") {
    if (err.message) {
      return err.message;
    } else if (err.data && err.data.message) {
      return err.data.message;
    } else if (err.statusText) {
      return err.statusText;
    } else {
      return JSON.stringify(err);
    }
  }

  return err as string;
}
