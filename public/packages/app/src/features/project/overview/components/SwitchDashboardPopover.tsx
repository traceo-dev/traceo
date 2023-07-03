import { AppstoreFilled, DownOutlined, LoadingOutlined } from "@ant-design/icons";
import { Dashboard } from "@traceo/types";
import { Popover, Row } from "@traceo/ui";
import { useNavigate } from "react-router-dom";
import { PopoverSelectOptions } from "src/core/components/PopoverSelectOptions";
import { useProject } from "src/core/hooks/useProject";
import { useReactQuery } from "src/core/hooks/useReactQuery";

export const SwitchDashboardPopover = () => {
  const { project } = useProject();
  const navigate = useNavigate();

  const { data: dashboards = [], isLoading } = useReactQuery<Dashboard[]>({
    queryKey: [`dashboards_${project.id}`],
    url: `/api/dashboard/project/${project.id}`
  });

  const renderPopoverContent = () => {
    if (isLoading) {
      return <LoadingOutlined />;
    }

    const options = dashboards.map((dashboard) => ({
      label: dashboard.name,
      icon: <AppstoreFilled />,
      onClick: () => navigate(`/project/${project.id}/dashboard/${dashboard.id}`)
    }));

    return <PopoverSelectOptions title="Select dashboard" options={options} />;
  };

  return (
    <Popover placement="bottom-end" showArrow={false} content={renderPopoverContent()}>
      <DownOutlined className="text-xs cursor-pointer" />
    </Popover>
  );
};
