import { Page } from "../../core/components/Page";
import ServerPermissions from "../../core/components/ServerPermissions";
import { useAppDispatch } from "../../store";
import { hideNavbar } from "../../store/internal/navbar/actions";
import { resetIncidentsState, resetIncidentState } from "../app/incidents/state/reducers";
import { resetApplicationState } from "../app/state/application/reducers";
import { loadSignedInUser } from "../auth/state/actions";
import { AppsTable } from "./components/AppsTable";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Card } from "@traceo/ui";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLive } from "../../core/hooks/useLive";

export const ApplicationsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const live = useLive();

  useEffect(() => {
    dispatch(loadSignedInUser());
    dispatch(hideNavbar(false));

    // Cleaning application stores
    dispatch(resetIncidentState());
    dispatch(resetIncidentsState());
    dispatch(resetApplicationState());

    // Reset socket connections after exiting the app
    live.emit("leave_all_rooms");
  }, []);

  const onNewApp = () => navigate("/dashboard/new-app");

  return (
    <Page>
      <Card
        title="Applications"
        extra={
          <ServerPermissions>
            <Button icon={<PlusOutlined />} onClick={() => onNewApp()}>
              New application
            </Button>
          </ServerPermissions>
        }
      >
        <AppsTable />
      </Card>
    </Page>
  );
};

export default ApplicationsPage;