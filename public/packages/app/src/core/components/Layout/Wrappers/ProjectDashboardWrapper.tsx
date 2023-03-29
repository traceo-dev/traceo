import { useAppDispatch } from "../../../../store";
import { useProject } from "../../../hooks/useProject";
import { isEmptyObject } from "../../../utils/object";
import NotFound from "../Pages/NotFound";
import { FC, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLive } from "../../../hooks/useLive";
import { TraceoLoading } from "../../TraceoLoading";
import { initProject } from "../../../../features/project/state/project/actions";

const ProjectDashboardWrapper: FC = ({ children }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const live = useLive();

  const { id } = useParams();
  const { hasFetched, permission, project } = useProject();

  useEffect(() => {
    dispatch(
      initProject({
        id
      })
    );

    live.subscribe(id);
  }, []);

  useEffect(() => {
    if (hasFetched && !permission) {
      navigate("/not-found");
    }
  }, [hasFetched, permission]);

  return <div>{children}</div>;
};

export default ProjectDashboardWrapper;
