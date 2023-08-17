import { Page } from "../../core/components/Page";
import { useAppDispatch } from "../../store";
import { hideNavbar } from "../../store/internal/navbar/actions";
import { resetProjectState } from "../project/state/project/reducers";
import { loadSignedInUser } from "../auth/state/actions";
import { ProjectsTable } from "./components/ProjectsTable";
import { Card } from "@traceo/ui";
import { useEffect } from "react";
import { resetIncidentState } from "../project/incidents/state/slices/incident.slice";

export const ProjectsListPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadSignedInUser());
    dispatch(hideNavbar(false));

    // Cleaning project stores
    dispatch(resetIncidentState());
    dispatch(resetProjectState());
  }, []);

  return (
    <Page>
      <Page.Content>
        <Card title="Projects">
          <ProjectsTable />
        </Card>
      </Page.Content>
    </Page>
  );
};

export default ProjectsListPage;
