import { FC } from "react";
import { handleIncidentStatus, IncidentStatus } from "../../types/incidents";
import { Tag, TagColorType } from "core/ui-components/Tag/Tag";

interface Props {
  status: IncidentStatus;
  className?: string;
}

export const handleIncidentColor: Record<IncidentStatus, TagColorType> = {
  [IncidentStatus.RESOLVED]: "green",
  [IncidentStatus.UNRESOLVED]: "red",
  [IncidentStatus.IN_PROGRESS]: "purple"
};

export const IncidentStatusTag: FC<Props> = ({ status, className }) => {
  return (
    <Tag className={className} color={handleIncidentColor[status]}>
      {handleIncidentStatus[status]}
    </Tag>
  );
};
