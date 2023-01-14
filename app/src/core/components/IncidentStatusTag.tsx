import { FC } from "react";
import { handleIncidentStatus, IncidentStatus } from "../../types/incidents";
import { Tag } from "core/ui-components/Tag";
import { joinClasses } from "core/utils/classes";

interface Props {
  status: IncidentStatus;
  className?: string;
}

export const handleIncidentColor: Record<IncidentStatus, string> = {
  [IncidentStatus.RESOLVED]: "bg-green-700",
  [IncidentStatus.UNRESOLVED]: "bg-red-700",
  [IncidentStatus.IN_PROGRESS]: "bg-purple-700"
};

export const IncidentStatusTag: FC<Props> = ({ status, className }) => {
  return (
    <Tag className={joinClasses(handleIncidentColor[status], className)}>
      {handleIncidentStatus[status]}
    </Tag>
  );
};
