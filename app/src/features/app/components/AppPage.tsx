import { useEffect } from "react";
import { loadApplication } from "../state/actions";
import { useParams } from "react-router-dom";
import { dispatch } from "../../../store/store";
import { useSelector } from "react-redux";
import { StoreState } from "../../../types/store";
import { isEmptyObject } from "../../../core/utils/object";
import NotFound from "../../../core/components/Layout/Pages/404";
import { TraceoLoading } from "../../../core/components/TraceoLoading";
import { isSlugCorrect } from "../../../core/utils/url";
import { PageCenter } from "../../../core/components/PageCenter";

export const AppPage = ({ children }) => {
  const { id } = useParams();

  const { application } = useSelector((state: StoreState) => state.application);

  useEffect(() => {
    dispatch(loadApplication(id));
  }, []);

  const hasMemberRole = application?.member?.role;
  const isCorrectClug = isSlugCorrect(application?.name);

  if (isEmptyObject(application)) {
    return (
      <PageCenter>
        <TraceoLoading />
      </PageCenter>
    );
  }

  if (!hasMemberRole || !isCorrectClug) {
    return <NotFound />;
  }

  return children;
};

export default AppPage;
