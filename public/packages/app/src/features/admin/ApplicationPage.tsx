import { useRequest } from "../../core/hooks/useRequest";
import { ApplicationInformation } from "./components/ApplicationManagement/ApplicationInformation";
import { ApplicationMembers } from "./components/ApplicationManagement/ApplicationMembers";
import { DashboardPageWrapper } from "./components/DashboardPageWrapper";
import { IProject } from "@traceo/types";
import { useParams } from "react-router-dom";

export const ApplicationPage = () => {
  const { id } = useParams();
  const { data, isLoading } = useRequest<IProject>({
    url: "/api/application",
    params: {
      id
    }
  });

  return (
    <DashboardPageWrapper isLoading={isLoading}>
      <ApplicationInformation application={data} />
      <ApplicationMembers />
    </DashboardPageWrapper>
  );
};

export default ApplicationPage;
