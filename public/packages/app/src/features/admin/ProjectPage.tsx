import { useRequest } from "../../core/hooks/useRequest";
import { AdminProjectInformation } from "./components/ApplicationManagement/AdminProjectInformation";
import { AdminProjectMembers } from "./components/ApplicationManagement/AdminProjectMembers";
import { DashboardPageWrapper } from "./components/DashboardPageWrapper";
import { IProject } from "@traceo/types";
import { useParams } from "react-router-dom";

export const ProjectPage = () => {
  const { id } = useParams();
  const { data, isLoading } = useRequest<IProject>({
    url: "/api/project",
    params: {
      id
    }
  });

  return (
    <DashboardPageWrapper isLoading={isLoading}>
      <AdminProjectInformation project={data} />
      <AdminProjectMembers />
    </DashboardPageWrapper>
  );
};

export default ProjectPage;
