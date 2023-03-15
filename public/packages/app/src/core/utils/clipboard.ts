import { notify } from "./notify";

export const copyToClipboad = (text: string, showNotify = true) => {
  navigator.clipboard.writeText(text);
  showNotify && notify.success("Copied to clipboard");
};
