import { Tag } from "antd";
import { RELEASE_STATUS } from "src/types/releases";
import { joinClasses } from "src/core/utils/classes";

export const releaseStatusColor: Record<RELEASE_STATUS, string> = {
  [RELEASE_STATUS.ACTIVE]: "text-white bg-green-700 border-green-100",
  [RELEASE_STATUS.CLOSED]: "text-black bg-gray-400 border-black",
  [RELEASE_STATUS.INACTIVE]: "text-white bg-purple-700 border-purple-100"
};

export const ReleaseStatusTag = ({ status, className = "" }) => {
  return (
    <Tag
      className={joinClasses(
        releaseStatusColor[status],
        "font-semibold rounded-md border-0 capitalize",
        className
      )}
    >
      {status}
    </Tag>
  );
};
