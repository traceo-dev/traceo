import { Row, Avatar } from "@traceo/ui";
import { TraceoLogo } from "../../Icons/TraceoLogo";
import { useNavigate } from "react-router-dom";
import { useProject } from "../../../../core/hooks/useProject";
import { Fragment } from "react";
import { PreLoad } from "../../PreLoad";

export const LeftHeaderSection = () => {
  const navigate = useNavigate();
  const { project, isLoading: isLoadingProject } = useProject();
  const isProjectDashboard = window.location.pathname.split("/").includes("project");

  const onLogoClick = () => {
    navigate({
      pathname: "/dashboard/projects"
    });
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

    return (
      <Fragment>
        <TraceoLogo size="small" className="cursor-pointer" onClick={() => onLogoClick()} />
        <span className="text-xl px-1 text-secondary font-[100]">/</span>
        <PreLoad isLoading={isLoadingProject}>
          <Row gap="x-2">
            <Avatar shape="square" size="sm" alt={project?.name} src={project?.gravatar} />
            <span className="text-xs font-semibold">{project?.name}</span>
          </Row>
        </PreLoad>
      </Fragment>
    );
  };

  return <Row gap="x-2">{render()}</Row>;
};
