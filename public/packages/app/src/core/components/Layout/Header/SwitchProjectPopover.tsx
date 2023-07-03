import { LoadingOutlined, SearchOutlined, AppstoreOutlined } from "@ant-design/icons";
import { MemberProject } from "@traceo/types";
import { Avatar, Row } from "@traceo/ui";
import { Link } from "react-router-dom";
import { useProject } from "src/core/hooks/useProject";
import { useUser } from "src/core/hooks/useUser";
import { PopoverSelectOptions } from "../../PopoverSelectOptions";

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
  
  const renderOptions = () => {
    const options = availableProjects.map((project) => ({
      icon: <Avatar size="sm" shape="square" alt={project?.name} src={project?.gravatar} />,
      label: project.name,
      onClick: () =>
        (window.location.href = `/project/${project?.projectId}/dashboard/${project?.mainDashboardId}`)
    }));

    return <PopoverSelectOptions title="Select project" options={options} />;
  };

  return renderOptions();
};
