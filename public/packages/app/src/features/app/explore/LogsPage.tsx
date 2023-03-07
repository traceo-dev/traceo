import ExplorePageWrapper from "./ExplorePageWrapper";
import { LogsHistogram } from "./components/LogsHistogram";
import { LogsList } from "./components/LogsList";

const LogsPage = () => {
  return (
    <ExplorePageWrapper>
      <LogsHistogram />
      <LogsList />
    </ExplorePageWrapper>
  );
};

export default LogsPage;
