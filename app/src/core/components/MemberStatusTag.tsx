import { Tag } from "antd";
import { MemberRole } from "../../types/application";
import { joinClasses } from "../../core/utils/classes";

export const MemberStatusTag = ({ status, className = "" }) => {
  const memberStatusColor: Record<MemberRole, string> = {
    [MemberRole.ADMINISTRATOR]: "text-white bg-amber-700",
    [MemberRole.MAINTAINER]: "text-white bg-blue-700",
    [MemberRole.VIEWER]: "text-white bg-green-700"
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
