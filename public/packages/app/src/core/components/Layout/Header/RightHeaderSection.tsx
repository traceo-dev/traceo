import {
  DownOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  LogoutOutlined,
  AppstoreAddOutlined,
  AppstoreFilled,
  BarChartOutlined,
  UserAddOutlined
} from "@ant-design/icons";
import { Row, Popover } from "@traceo/ui";
import { GH_REPO_LINK } from "../../../../core/utils/constants";
import { logout } from "../../../../core/utils/logout";
import { RouterLink } from "../../RouterLink";
import ServerPermissions from "../../ServerPermissions";
import { useNavigate } from "react-router-dom";
import { useProject } from "../../../../core/hooks/useProject";
import styled from "styled-components";
import { PopoverSelectOptions } from "../../PopoverSelectOptions";

export const RightHeaderSection = () => {
  const { project } = useProject();

  const navigate = useNavigate();

  const isProjectDashboard = window.location.pathname.split("/").includes("project");

  const onCreateDashboard = () => navigate(`/project/${project.id}/dashboard-create`);
  const onCreateProject = () => navigate("/dashboard/new-project");
  const onCreateUser = () => navigate("/dashboard/new-user");

  const createNewOptions = [
    {
      label: "Dashboard",
      onClick: () => onCreateDashboard(),
      icon: <AppstoreFilled />
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
    return <PopoverSelectOptions options={createNewOptions} />;
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
