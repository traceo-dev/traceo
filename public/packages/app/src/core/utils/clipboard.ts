import { notify } from "./notify";

export const copyToClipboad = (text: string | unknown, showNotify = true) => {
  navigator.clipboard.writeText(text as string);
  showNotify && notify.success("Copied to clipboard");
};
