import { LoadingOutlined, SearchOutlined, AppstoreOutlined } from "@ant-design/icons";
import { MemberProject } from "@traceo/types";
import { Avatar, Row } from "@traceo/ui";
import { Link } from "react-router-dom";
import { useProject } from "src/core/hooks/useProject";
import { useUser } from "src/core/hooks/useUser";

interface Props {
  isLoading: boolean;
  projects: MemberProject[];
}
export const SwitchProjectPopover = ({ projects, isLoading }: Props) => {
  const { project } = useProject();

  const availableProjects = projects?.filter((e) => e.projectId !== project.id);

  if (isLoading) {
    return (
      <div className="min-w-[100px] min-h-[100px] text-center">
        <LoadingOutlined />
      </div>
    );
  }
  return (
    <div className="flex flex-col min-w-[230px]">
      <span className="text-sm p-2 border-bottom text-primary">Switch project</span>
      <div className="max-h-[200px] overflow-auto">
        {project && availableProjects.length === 0 && (
          <div className="w-full flex flex-col text-center py-5 text-primary">
            <SearchOutlined />
            <span className="text-sm">Not found</span>
          </div>
        )}
        {availableProjects.map((project, key) => (
          <span
            key={key}
            onClick={() =>
              (window.location.href = `/project/${project?.projectId}/dashboard/${project?.mainDashboardId}`)
            }
            className="text-sm p-2 hover:bg-secondary cursor-pointer flex flex-row items-center gap-x-3"
          >
            <Avatar size="sm" shape="square" alt={project?.name} src={project?.gravatar} />
            <span>{project?.name}</span>
          </span>
        ))}
      </div>
      <div className="w-full border-top">
        <Link to={"/dashboard/projects"}>
          <Row
            gap="x-2"
            className="py-1 hover:text-white px-2 text-sm cursor-pointer text-primary"
          >
            <AppstoreOutlined />
            <span>Show list</span>
          </Row>
        </Link>
      </div>
    </div>
  );
};
