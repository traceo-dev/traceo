import { useSelector } from "react-redux";
import { StoreState } from "../../../types/store";
import NotFound from "../../../core/components/Layout/Pages/NotFound";
import { TraceoLoading } from "../../../core/components/TraceoLoading";
import { PageCenter } from "../../../core/components/PageCenter";

const AppPage = ({ children }) => {
  const { application, hasFetched } = useSelector(
    (state: StoreState) => state.application
  );
  const hasMemberRole = application?.member?.role;

  if (hasFetched) {
    return (
      <PageCenter>
        <TraceoLoading />
      </PageCenter>
    );
  }

  if (!hasMemberRole) {
    return (
      <PageCenter>
        <NotFound />
      </PageCenter>
    );
  }

  return <div className="pb-5 pt-12">{children}</div>;
};

export default AppPage;
