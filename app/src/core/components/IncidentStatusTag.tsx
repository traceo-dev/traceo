import { FC } from "react";
import { handleIncidentStatus, IncidentStatus } from "../../types/incidents";
import { Tag, TagColorType } from "core/ui-components/Tag";
import { joinClasses } from "core/utils/classes";
import {
  handleIncidentStatusIcon,
  handleIncidentTwBgColor
} from "features/app/incidents/components/utils";

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
      icon={handleIncidentStatusIcon[status]}
      color={tagColor[status]}
      className={joinClasses(handleIncidentTwBgColor[status], className)}
    >
      {handleIncidentStatus[status]}
    </Tag>
  );
};
