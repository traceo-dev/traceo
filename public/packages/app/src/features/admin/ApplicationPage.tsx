import { useParams } from "react-router-dom";
import { ApplicationInformation } from "./components/ApplicationManagement/ApplicationInformation";
import { ApplicationMembers } from "./components/ApplicationManagement/ApplicationMembers";
import { DashboardPageWrapper } from "./components/DashboardPageWrapper";
import { useRequest } from "../../core/hooks/useRequest";
import { IApplication } from "@traceo/types";

export const ApplicationPage = () => {
  const { id } = useParams();
  const { data, isLoading } = useRequest<IApplication>({
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
