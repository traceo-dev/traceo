import { initApplication } from "../../../../features/app/state/application/actions";
import { useAppDispatch } from "../../../../store";
import { useApplication } from "../../../hooks/useApplication";
import { isEmptyObject } from "../../../utils/object";
import NotFound from "../Pages/NotFound";
import { FC, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLive } from "../../../../core/hooks/useLive";
import { TraceoLoading } from "../../TraceoLoading";

const AppDashboardPage: FC = ({ children }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const live = useLive();

  const { id } = useParams();
  const { hasFetched, permission, application } = useApplication();

  useEffect(() => {
    dispatch(
      initApplication({
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

  if (hasFetched && !application) {
    return <NotFound />;
  }

  if (!hasFetched || isEmptyObject(application)) {
    return <TraceoLoading />;
  }

  return <div>{children}</div>;
};

export default AppDashboardPage;
