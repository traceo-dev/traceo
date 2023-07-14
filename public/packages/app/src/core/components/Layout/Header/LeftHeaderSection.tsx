import { LoadingOutlined, SwapOutlined } from "@ant-design/icons";
import { Row, Avatar, Popover } from "@traceo/ui";
import { TraceoLogo } from "../../Icons/TraceoLogo";
import { SwitchProjectPopover } from "./SwitchProjectPopover";
import { useNavigate } from "react-router-dom";
import { MemberProject } from "@traceo/types";
import { useProject } from "../../../../core/hooks/useProject";
import { useReactQuery } from "../../../../core/hooks/useReactQuery";
import { useUser } from "../../../../core/hooks/useUser";
import { Fragment } from "react";
import { PreLoad } from "../../PreLoad";

export const LeftHeaderSection = () => {
  const navigate = useNavigate();
  const { project, isLoading: isLoadingProject } = useProject();
  const { id: userId } = useUser();

  const { data: projects = [], isLoading } = useReactQuery<MemberProject[]>({
    queryKey: ["projects"],
    url: "/api/member/projects",
    params: { userId }
  });

  const isProjectDashboard = window.location.pathname.split("/").includes("project");

  const renderProjectSwitcher = () => {
    if (isLoading) {
      return <LoadingOutlined />;
    }

    return (
      <Fragment>
        <PreLoad isLoading={isLoadingProject}>
          <Row gap="x-2">
            <Avatar shape="square" size="sm" alt={project?.name} src={project?.gravatar} />
            <span className="text-xs font-semibold">{project?.name}</span>
          </Row>
        </PreLoad>

        {projects.length > 1 && (
          <Popover
            placement="bottom-end"
            overrideStyles={{ transitionDuration: 0 }}
            content={<SwitchProjectPopover isLoading={isLoading} projects={projects} />}
          >
            <SwapOutlined className="text-xs cursor-pointer pl-5" />
          </Popover>
        )}
      </Fragment>
    );
  };

  const render = () => {
    if (!isProjectDashboard) {
      return (
        <Row gap="x-3" className="cursor-pointer" onClick={() => navigate("/dashboard/projects")}>
          <TraceoLogo size="small" />
          <span className="text-sm font-semibold">Traceo</span>
        </Row>
      );
    }

    return renderProjectSwitcher();
  };

  return <Row gap="x-2">{render()}</Row>;
};
