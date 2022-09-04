import { Tag } from "antd";
import { MEMBER_STATUS } from "src/types/application";
import { joinClasses } from "src/core/utils/classes";

export const MemberStatusTag = ({ status, className = "" }) => {
  const memberStatusColor: Record<MEMBER_STATUS, string> = {
    [MEMBER_STATUS.OWNER]: "text-white bg-amber-700",
    [MEMBER_STATUS.ADMINISTRATOR]: "text-white bg-blue-700",
    [MEMBER_STATUS.DEVELOPER]: "text-white bg-green-700"
  };

  return (
    <Tag
      className={joinClasses(
        memberStatusColor[status],
        "font-semibold rounded-sm border-0",
        className
      )}
    >
      {status}
    </Tag>
  );
};
