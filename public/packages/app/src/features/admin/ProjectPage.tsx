import { AdminProjectInformation } from "./components/ApplicationManagement/AdminProjectInformation";
import { AdminProjectMembers } from "./components/ApplicationManagement/AdminProjectMembers";
import { DashboardPageWrapper } from "./components/DashboardPageWrapper";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "../../store";
import { loadProject } from "./state/projects/actions";
import { useSelector } from "react-redux";
import { StoreState } from "../../store/types";

export const ProjectPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { isLoading, project } = useSelector((state: StoreState) => state.adminProject);

  useEffect(() => {
    dispatch(loadProject(id));
  }, []);

  return (
    <DashboardPageWrapper isLoading={isLoading}>
      <AdminProjectInformation project={project} />
      <AdminProjectMembers />
    </DashboardPageWrapper>
  );
};

export default ProjectPage;
