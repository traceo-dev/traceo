import { Page } from "../../core/components/Page";
import { useAppDispatch } from "../../store";
import { hideNavbar } from "../../store/internal/navbar/actions";
import { resetIncidentsState, resetIncidentState } from "../project/incidents/state/reducers";
import { resetProjectState } from "../project/state/project/reducers";
import { loadSignedInUser } from "../auth/state/actions";
import { ProjectsTable } from "./components/ProjectsTable";
import { Card } from "@traceo/ui";
import { useEffect } from "react";
import { useLive } from "../../core/hooks/useLive";

export const ProjectsListPage = () => {
  const dispatch = useAppDispatch();
  const live = useLive();

  useEffect(() => {
    dispatch(loadSignedInUser());
    dispatch(hideNavbar(false));

    // Cleaning project stores
    dispatch(resetIncidentState());
    dispatch(resetIncidentsState());
    dispatch(resetProjectState());

    // Reset socket connections after exiting the project
    live.emit("leave_all_rooms");
  }, []);

  return (
    <Page>
      <Card title="Applications">
        <ProjectsTable />
      </Card>
    </Page>
  );
};

export default ProjectsListPage;
