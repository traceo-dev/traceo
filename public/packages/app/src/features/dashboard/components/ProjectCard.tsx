import { RightOutlined } from "@ant-design/icons";
import dateUtils from "../../../core/utils/date";
import { MemberProject } from "@traceo/types";
import { Typography, Avatar, Row } from "@traceo/ui";
import { useNavigate } from "react-router-dom";

interface Props {
  project: MemberProject;
}
export const ProjectCard = ({ project }: Props) => {
  const navigate = useNavigate();
  const lastEventAt = project?.lastEventAt
    ? "Last error " + dateUtils.fromNow(project?.lastEventAt)
    : "-- : --";

  const onSelect = () => {
    navigate({
      pathname: `/project/${project.projectId}/dashboard/${project?.mainDashboardId}`
    });
  };

  return (
    <Row
      onClick={() => onSelect()}
      className="md:col-span-2 lg:col-span-4 justify-between p-5 m-2 bg-secondary rounded-md cursor-pointer hover:bg-light-secondary"
    >
      <Row>
        <Avatar alt={project.name} src={project?.gravatar} />
        <div className="flex flex-col pl-3">
          <Typography className="cursor-pointer" weight="semibold">
            {project.name}
          </Typography>
          <span className="text-xs text-primary">{lastEventAt}</span>
        </div>
      </Row>

      <RightOutlined className="text-xs hover:text-[14px] text-primary hover:text-white duration-100" />
    </Row>
  );
};
