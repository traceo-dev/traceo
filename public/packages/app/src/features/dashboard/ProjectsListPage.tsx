import { Page } from "../../core/components/Page";
import { useAppDispatch } from "../../store";
import { hideNavbar } from "../../store/internal/navbar/actions";
import { resetProjectState } from "../project/state/project/reducers";
import { loadSignedInUser } from "../auth/state/actions";
import { ProjectsTable } from "./components/ProjectsTable";
import { Card } from "@traceo/ui";
import { useEffect } from "react";
import { useLive } from "../../core/hooks/useLive";
import { resetIncidentState } from "../project/incidents/state/slices/incident.slice";

export const ProjectsListPage = () => {
  const dispatch = useAppDispatch();
  const live = useLive();

  useEffect(() => {
    dispatch(loadSignedInUser());
    dispatch(hideNavbar(false));

    // Cleaning project stores
    dispatch(resetIncidentState());
    dispatch(resetProjectState());

    // Reset socket connections after exiting the project
    live.emit("leave_all_rooms");
  }, []);

  return (
    <Page>
      <Page.Content>
        <Card title="Applications">
          <ProjectsTable />
        </Card>
      </Page.Content>
    </Page>
  );
};

export default ProjectsListPage;
