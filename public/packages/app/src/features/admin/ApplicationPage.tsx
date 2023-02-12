import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../store";
import { StoreState } from "@store/types";
import { ApplicationInformation } from "./components/ApplicationManagement/ApplicationInformation";
import { ApplicationMembers } from "./components/ApplicationManagement/ApplicationMembers";
import { DashboardPageWrapper } from "./components/DashboardPageWrapper";
import { loadServerApplication } from "./state/applications/actions";

export const ApplicationPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { hasFetched } = useSelector((state: StoreState) => state.serverApplications);

  useEffect(() => {
    dispatch(loadServerApplication(id));
  }, []);

  return (
    <DashboardPageWrapper isLoading={!hasFetched}>
      <ApplicationInformation />
      <ApplicationMembers />
    </DashboardPageWrapper>
  );
};

export default ApplicationPage;
