import saveAs from "file-saver";
import dateUtils from "./date";

type DownloadType = "json";

export const downloadFile = (content: unknown, ext: DownloadType, title?: string) => {
  let blob: Blob;

  switch (ext) {
    case "json":
      blob = new Blob([JSON.stringify(content)], {
        type: "application/json"
      });
      break;
    default:
      break;
  }

  const fileName = `${title ?? dateUtils.toUnix() * 1e5}.${ext}`;
  saveAs(blob, fileName);
};
