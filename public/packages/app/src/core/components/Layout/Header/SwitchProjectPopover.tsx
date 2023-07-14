import { LoadingOutlined } from "@ant-design/icons";
import { MemberProject } from "@traceo/types";
import { Avatar } from "@traceo/ui";
import { useProject } from "../../../../core/hooks/useProject";
import { PopoverSelectOptions } from "../../PopoverSelectOptions";
import { useNavigate } from "react-router-dom";

interface Props {
  isLoading: boolean;
  projects: MemberProject[];
}
export const SwitchProjectPopover = ({ projects, isLoading }: Props) => {
  const { project } = useProject();
  const navigate = useNavigate();

  const availableProjects = projects?.filter((e) => e.projectId !== project.id);

  if (isLoading) {
    return (
      <div className="min-w-[100px] min-h-[100px] text-center">
        <LoadingOutlined />
      </div>
    );
  }

  const navigateToProject = (projectId: string) => {
    navigate({
      pathname: `/project/${projectId}/dashboard/${project?.mainDashboardId}`
    });
  };

  const renderOptions = () => {
    const options = availableProjects.map((project) => ({
      icon: <Avatar size="sm" shape="square" alt={project?.name} src={project?.gravatar} />,
      label: project.name,
      onClick: () => navigateToProject(project.projectId)
    }));

    return <PopoverSelectOptions title="Select project" options={options} />;
  };

  return renderOptions();
};
