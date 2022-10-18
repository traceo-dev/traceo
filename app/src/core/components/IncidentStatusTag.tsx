import { Space, Tag } from "antd";
import { FC } from "react";
import { handleIncidentStatus, IncidentStatus } from "../../types/incidents";
import { joinClasses } from "../../core/utils/classes";

interface Props {
  status: IncidentStatus;
  className?: string;
}

export const handleIncidentColor: Record<IncidentStatus, string> = {
  [IncidentStatus.RESOLVED]: "text-white bg-green-700",
  [IncidentStatus.UNRESOLVED]: "text-white bg-red-700",
  [IncidentStatus.IN_PROGRESS]: "text-white bg-purple-700"
};

export const IncidentStatusTag: FC<Props> = ({ status, className }) => {
  return (
    <>
      {status && (
        <Space className={joinClasses("gap-0", className)}>
          <Tag
            className={joinClasses(
              handleIncidentColor[status],
              "font-semibold rounded-sm border-0 capitalize"
            )}
          >
            {handleIncidentStatus[status]}
          </Tag>
        </Space>
      )}
    </>
  );
};
