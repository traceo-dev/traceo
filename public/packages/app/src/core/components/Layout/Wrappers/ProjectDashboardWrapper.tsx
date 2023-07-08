import { useAppDispatch } from "../../../../store";
import { useProject } from "../../../hooks/useProject";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLive } from "../../../hooks/useLive";
import { TraceoLoading } from "../../TraceoLoading";
import { initProject } from "../../../../features/project/state/project/actions";

const ProjectDashboardWrapper = ({ children }) => {
  const dispatch = useAppDispatch();
  const live = useLive();

  const { id } = useParams();
  const { isLoading, permission } = useProject();

  useEffect(() => {
    dispatch(
      initProject({
        id
      })
    );

    live.subscribe(id);
  }, []);

  useEffect(() => {
    // if (!isLoading && !permission) {
    //   navigate("/not-found");
    // }
  }, [isLoading, permission]);

  if (isLoading) {
    return <TraceoLoading />;
  }

  return <div>{children}</div>;
};

export default ProjectDashboardWrapper;
