import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { TraceoLoading } from "../../core/components/TraceoLoading";
import { useCleanup } from "../../core/hooks/useCleanup";
import { isEmptyObject } from "../../core/utils/object";
import { dispatch } from "../../store/store";
import { StoreState } from "../../types/store";
import { ApplicationInformation } from "./components/ApplicationManagement/ApplicationInformation";
import { ApplicationMembers } from "./components/ApplicationManagement/ApplicationMembers";
import { ManagementNavigation } from "./components/ManagementNavigation";
import { loadServerApplication } from "./state/applications/actions";

export const ManagementApplicationPage = () => {
  useCleanup((state: StoreState) => state.serverApplications);

  const { id } = useParams();
  const { application } = useSelector((state: StoreState) => state.serverApplications);

  useEffect(() => {
    dispatch(loadServerApplication(id));
  }, []);

  if (isEmptyObject(application)) return <TraceoLoading />;

  return (
    <ManagementNavigation>
      <ApplicationInformation />
      <ApplicationMembers />
    </ManagementNavigation>
  );
};

export default ManagementApplicationPage;
