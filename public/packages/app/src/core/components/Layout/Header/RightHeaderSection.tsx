import {
  DownOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  LogoutOutlined,
  AppstoreAddOutlined,
  AppstoreFilled,
  BarChartOutlined,
  UserAddOutlined
} from "@ant-design/icons";
import { Row, Popover } from "@traceo/ui";
import { GH_REPO_LINK } from "src/core/utils/constants";
import { logout } from "src/core/utils/logout";
import { RouterLink } from "../../RouterLink";
import ServerPermissions from "../../ServerPermissions";
import { useNavigate } from "react-router-dom";
import { useProject } from "src/core/hooks/useProject";
import { MenuRoute } from "src/core/types/navigation";
import styled from "styled-components";
import { PopoverSelectOptions } from "../../PopoverSelectOptions";

export const RightHeaderSection = () => {
  const { project } = useProject();

  const navigate = useNavigate();

  const isProjectDashboard = window.location.pathname.split("/").includes("project");

  const onCreateDashboard = () => navigate(`/project/${project.id}/dashboard-create`);
  const onCreatePanel = () => {
    // TODO: hack to not working useParams here...
    const paths = window.location.pathname.split("/");
    const dashboardId = paths[4];

    navigate(`/project/${project.id}/dashboard/${dashboardId}/panel-create`);
  };
  const onCreateProject = () => navigate("/dashboard/new-project");
  const onCreateUser = () => navigate("/dashboard/new-user");

  const createNewOptions = [
    {
      label: "Dashboard",
      onClick: () => onCreateDashboard(),
      icon: <AppstoreFilled />
    },
    {
      label: "Dashboard panel",
      onClick: () => onCreatePanel(),
      icon: <BarChartOutlined />
    },
    {
      label: "Project",
      onClick: () => onCreateProject(),
      icon: <AppstoreAddOutlined />
    },
    {
      label: "User",
      onClick: () => onCreateUser(),
      icon: <UserAddOutlined />
    }
  ];

  const renderNewResource = () => {
    return <PopoverSelectOptions title="Create new resource" options={createNewOptions} />;
  };

  return (
    <Row className="gap-x-5">
      {isProjectDashboard && (
        <ServerPermissions>
          <Popover
            placement="bottom-end"
            showArrow={false}
            overrideStyles={{
              marginTop: "15px",
              transitionDuration: "50ms"
            }}
            content={renderNewResource()}
          >
            <HeaderButton>
              <span className="select-none">Create</span>
              <DownOutlined />
            </HeaderButton>
          </Popover>
        </ServerPermissions>
      )}

      <a href={GH_REPO_LINK} target="blank" className="text-primary hover:text-white">
        <QuestionCircleOutlined className="icon-btn" />
      </a>

      {isProjectDashboard && (
        <RouterLink to={`/dashboard/profile/settings`}>
          <UserOutlined className="icon-btn" />
        </RouterLink>
      )}

      <LogoutOutlined onClick={() => logout()} className="icon-btn hover:text-red-400" />
    </Row>
  );
};

const HeaderButton = styled.div`
  font-weight: 500;
  display: flex;
  flex-direction: row;
  font-size: 11px;
  align-items: center;
  border-radius: 12px;
  border: 1px solid var(--color-traceo-primary);
  cursor: pointer;
  color: var(--color-traceo-primary);
  padding-inline: 15px;
  padding-top: 3px;
  padding-bottom: 3px;
  gap: 8px;
  transition-duration: 200ms;

  &:hover {
    background-color: var(--color-traceo-primary);
    color: var(--color-bg-primary);
  }
`;
