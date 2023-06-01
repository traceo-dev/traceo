import {
  AlertOutlined,
  AppstoreOutlined,
  BellFilled,
  BellOutlined,
  LoadingOutlined,
  LogoutOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  SettingOutlined,
  SwapOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Avatar, Popover, Row } from "@traceo/ui";
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
import { Link, useNavigate } from "react-router-dom";
import { RouterLink } from "../../RouterLink";

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
  const { id, isAdmin } = useUser();

  const isProjectDashboard = window.location.pathname.split("/").includes("project");

  const { data: projects = [], isLoading } = useReactQuery<MemberProject[]>({
    queryKey: ["projects"],
    url: "/api/member/projects",
    params: { userId: id }
  });

  const availableProjects = projects?.filter((e) => e.projectId !== project.id);

  const projectSwitcherContent = isLoading ? (
    <div className="min-w-[100px] min-h-[100px] text-center">
      <LoadingOutlined />
    </div>
  ) : (
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
            onClick={() => (window.location.href = `/project/${project?.projectId}/overview`)}
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
            gap="x-1"
            className="py-1 hover:text-white px-2 text-sm cursor-pointer text-primary"
          >
            <AppstoreOutlined />
            <span>Show list</span>
          </Row>
        </Link>
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
          className="text-primary text-sm p-2 hover:bg-secondary cursor-pointer"
        >
          <Row gap="x-3">
            {route.icon}
            {route.label}
          </Row>
        </span>
      ))}
    </div>
  );

  return (
    <div className="w-full flex flex-col z-50 shadow-lg top-0 fixed">
      <header className="flex px-8 h-[40px] w-full bg-primary border-bottom justify-between items-center">
        <Row gap="x-5">
          <Row gap="x-2">
            {!isProjectDashboard ? (
              <Row
                gap="x-3"
                className="cursor-pointer"
                onClick={() => navigate("/dashboard/projects")}
              >
                <TraceoLogo size="small" />
                <span className="text-sm font-semibold">Traceo</span>
              </Row>
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
          </Row>
        </Row>
        <Row gap="x-5">
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
              <RouterLink to={`/dashboard/admin/users`}>
                <SettingOutlined className="icon-btn" />
              </RouterLink>
            )}
          </ServerPermissions>

          {/* <NotificationPopover /> */}

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
      </header>
      <SecondaryHeader>
        {buildHeaderItems(isAdmin, project).map((route, key) => (
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
  border-radius: 5px;
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
