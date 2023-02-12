import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../store";
import { StoreState } from "@store/types";
import { ApplicationInformation } from "./components/ApplicationManagement/ApplicationInformation";
import { ApplicationMembers } from "./components/ApplicationManagement/ApplicationMembers";
import { DashboardPageWrapper } from "./components/DashboardPageWrapper";
import { useRequest } from "src/core/hooks/useRequest";
import { IApplication } from "@traceo/types";
// import { loadServerApplication } from "./state/applications/actions";

export const ApplicationPage = () => {
  const { id } = useParams();
  // const dispatch = useAppDispatch();
  // const { hasFetched } = useSelector((state: StoreState) => state.serverApplications);

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
