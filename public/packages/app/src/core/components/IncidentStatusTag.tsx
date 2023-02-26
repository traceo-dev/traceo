import {
  mapIncidentStatusIcon,
  mapIncidentTwBgColor
} from "../../features/app/incidents/components/utils";
import { joinClasses } from "../utils/classes";
import { mapIncidentStatus, IncidentStatus } from "@traceo/types";
import { Tag, TagColorType } from "@traceo/ui";
import { FC } from "react";

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
