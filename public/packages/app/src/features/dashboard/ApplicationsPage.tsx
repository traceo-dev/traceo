import { Page } from "../../core/components/Page";
import { useAppDispatch } from "../../store";
import { hideNavbar } from "../../store/internal/navbar/actions";
import { resetIncidentsState, resetIncidentState } from "../app/incidents/state/reducers";
import { resetApplicationState } from "../app/state/application/reducers";
import { loadSignedInUser } from "../auth/state/actions";
import { AppsTable } from "./components/AppsTable";
import { Card } from "@traceo/ui";
import { useEffect } from "react";
import { useLive } from "../../core/hooks/useLive";

export const ApplicationsPage = () => {
  const dispatch = useAppDispatch();
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

  return (
    <Page>
      <Card title="Applications">
        <AppsTable />
      </Card>
    </Page>
  );
};

export default ApplicationsPage;
