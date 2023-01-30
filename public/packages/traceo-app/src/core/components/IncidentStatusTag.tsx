import { FC } from "react";
import { mapIncidentStatus, IncidentStatus } from "../../types/incidents";
import { Tag, TagColorType } from "@traceo/ui";
import { joinClasses } from "../../core/utils/classes";
import {
  mapIncidentStatusIcon,
  mapIncidentTwBgColor
} from "../../features/app/incidents/components/utils";

interface Props {
  status: IncidentStatus;
  className?: string;
}

const tagColor: Record<IncidentStatus, TagColorType> = {
  in_progress: "purple",
  resolved: "green",
  unresolved: "red"
};

export const IncidentStatusTag: FC<Props> = ({ status, className }) => {
  return (
    <Tag
      icon={mapIncidentStatusIcon[status]}
      color={tagColor[status]}
      className={joinClasses(mapIncidentTwBgColor[status], className)}
    >
      {mapIncidentStatus[status]}
    </Tag>
  );
};
