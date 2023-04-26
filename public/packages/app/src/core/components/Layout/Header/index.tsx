import {
  AlertOutlined,
  AppstoreOutlined,
  BellFilled,
  BellOutlined,
  LoadingOutlined,
  LogoutOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  SwapOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Avatar, Popover } from "@traceo/ui";
import { useProject } from "../../../hooks/useProject";
import { HeaderItem } from "./HeaderItem";
import { buildHeaderItems } from "./utils";
import styled from "styled-components";
import { logout } from "../../../../core/utils/logout";
import { TraceoLogo } from "../../Icons/TraceoLogo";
import { MenuRoute } from "../../../../core/types/navigation";
import ServerPermissions from "../../ServerPermissions";
import { GH_REPO_LINK } from "../../../../core/utils/constants";
import { useReactQuery } from "../../../../core/hooks/useReactQuery";
import { MemberProject } from "@traceo/types";
import { useUser } from "../../../../core/hooks/useUser";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import dateUtils from "src/core/utils/date";
import { NotificationPopover } from "./Notifications/NotificationPopover";

const createNewOptions: MenuRoute[] = [
  {
    label: "Project",
    icon: <AppstoreOutlined />,
    href: "/dashboard/new-project"
  },
  {
    label: "User",
    icon: <UserOutlined />,
    href: "/dashboard/new-user"
  }
];
export const Header = () => {
  const navigate = useNavigate();

  const { project } = useProject();
  const { id } = useUser();

  const isProjectDashboard = window.location.pathname.split("/").includes("project");

  const { data: projects = [], isLoading } = useReactQuery<MemberProject[]>({
    queryKey: ["projects"],
    url: "/api/member/projects",
    params: { userId: id }
  });

  const projectSwitcherContent = isLoading ? (
    <div className="min-w-[100px] min-h-[100px] text-center">
      <LoadingOutlined />
    </div>
  ) : (
    <div className="flex flex-col min-w-[230px]">
      <span className="text-sm p-2 border-bottom text-primary">Switch project</span>
      <div className=" max-h-[200px] overflow-auto">
        {projects
          ?.filter((e) => e.projectId !== project.id)
          .map((project, key) => (
            <span
              key={key}
              onClick={() => (window.location.href = `/project/${project?.projectId}/overview`)}
              className="text-sm p-2 hover:bg-secondary cursor-pointer flex flex-row items-center gap-x-3"
            >
              <Avatar size="sm" shape="square" alt={project?.name} src={project?.gravatar} />
              <span>{project?.name}</span>
            </span>
          ))}
      </div>
    </div>
  );

  const createNewContent = (
    <div className="min-w-[180px] flex flex-col">
      <span className="text-sm p-2 border-bottom text-primary">Create new</span>
      {createNewOptions.map((route, key) => (
        <span
          key={key}
          onClick={() => (window.location.href = route.href)}
          className="text-primary text-sm p-2 hover:bg-secondary cursor-pointer flex flex-row items-center gap-x-3"
        >
          {route.icon}
          {route.label}
        </span>
      ))}
    </div>
  );

  return (
    <div className="w-full flex flex-col z-50 shadow-lg top-0 fixed">
      <header className="flex px-8 h-[40px] w-full bg-primary border-bottom justify-between items-center">
        <div className="flex flex-row items-center gap-x-5">
          <div className="flex flex-row items-center gap-x-2">
            {!isProjectDashboard ? (
              <div
                className="flex flex-row gap-x-3 cursor-pointer items-center"
                onClick={() => navigate("/dashboard/projects")}
              >
                <TraceoLogo size="small" />
                <span className="text-sm font-semibold">Traceo</span>
              </div>
            ) : (
              <>
                {isLoading ? (
                  <LoadingOutlined />
                ) : (
                  <>
                    <Avatar
                      shape="square"
                      size="sm"
                      alt={project?.name}
                      src={project?.gravatar}
                    />
                    <span className="text-xs font-semibold">{project?.name}</span>
                    <Popover
                      placement="bottom-end"
                      showArrow={false}
                      overrideStyles={{
                        marginTop: "15px",
                        transitionDuration: 0
                      }}
                      content={projectSwitcherContent}
                    >
                      <SwapOutlined className="text-xs cursor-pointer pl-5" />
                    </Popover>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <div className="flex flex-row gap-x-5 items-center text-primary">
          <ServerPermissions>
            <Popover
              placement="bottom-end"
              showArrow={false}
              overrideStyles={{
                marginTop: "15px",
                transitionDuration: 0
              }}
              content={createNewContent}
            >
              <HeaderButton>
                <span>New</span>
                <PlusOutlined />
              </HeaderButton>
            </Popover>

            {isProjectDashboard && (
              <SettingOutlined
                onClick={() => (window.location.href = `/dashboard/admin/users`)}
                className="icon-btn"
              />
            )}
          </ServerPermissions>

          {/* <NotificationPopover /> */}

          <a href={GH_REPO_LINK} target="blank" className="text-primary">
            <QuestionCircleOutlined className="icon-btn" />
          </a>

          {isProjectDashboard && (
            <UserOutlined
              onClick={() => (window.location.href = `/dashboard/profile/settings`)}
              className="icon-btn"
            />
          )}

          <LogoutOutlined onClick={() => logout()} className="icon-btn hover:text-red-400" />
        </div>
      </header>
      <SecondaryHeader>
        {buildHeaderItems(project).map((route, key) => (
          <HeaderItem key={key} route={route} />
        ))}
      </SecondaryHeader>
    </div>
  );
};

const SecondaryHeader = styled.nav`
  width: 100%;
  background-color: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-bg-light-secondary);
  position: relative;
  display: flex;
  align-items: center;
  padding-inline: 18px;
`;

const HeaderButton = styled.div`
  font-weight: 500;
  display: flex;
  flex-direction: row;
  font-size: 11px;
  align-items: center;
  border: 1px solid var(--color-traceo-primary);
  border-radius: 20px;
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

export default Header;
