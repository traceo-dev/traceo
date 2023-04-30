import { RightOutlined } from "@ant-design/icons";
import dateUtils from "../../../core/utils/date";
import { MemberProject } from "@traceo/types";
import { Typography, Avatar } from "@traceo/ui";
import { FC } from "react";

interface Props {
  project: MemberProject;
}
export const ProjectCard: FC<Props> = ({ project }) => {
  const lastEventAt = project?.lastEventAt
    ? "Last error " + dateUtils.fromNow(project?.lastEventAt)
    : "-- : --";

  return (
    <div
      onClick={() => (window.location.href = `/project/${project.projectId}/overview`)}
      className="md:col-span-2 lg:col-span-4 flex flex-row justify-between items-center p-5 m-2 bg-secondary rounded-md cursor-pointer hover:bg-light-secondary"
    >
      <div className="flex flex-row items-center">
        <Avatar alt={project.name} src={project?.gravatar} />
        <div className="flex flex-col pl-3">
          <Typography className="cursor-pointer" weight="semibold">
            {project.name}
          </Typography>
          <span className="text-xs text-primary">{lastEventAt}</span>
        </div>
      </div>

      <RightOutlined className="text-xs hover:text-[14px] text-primary hover:text-white duration-100" />
    </div>
  );
};
