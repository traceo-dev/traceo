import NotFound from "../../../../core/components/Layout/Pages/NotFound";
import { Page } from "../../../../core/components/Page";
import { useApplication } from "../../../../core/hooks/useApplication";
import { isEmptyObject } from "../../../../core/utils/object";
import { initApplication } from "../../../../features/app/state/application/actions";
import { FC, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../../../store";

const AppDashboardPage: FC = ({ children }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { id } = useParams();
  const { hasFetched, permission, application } = useApplication();

  useEffect(() => {
    dispatch(
      initApplication({
        id
      })
    );
  }, []);

  useEffect(() => {
    if (hasFetched && !permission) {
      navigate("/not-found");
    }
  }, [hasFetched, permission]);

  if (hasFetched && !application) {
    return <NotFound />;
  }

  return <Page isLoading={!hasFetched || isEmptyObject(application)}>{children}</Page>;
};

export default AppDashboardPage;
