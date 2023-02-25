import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../core/components/DataNotFound";
import ExplorePageWrapper from "./ExplorePageWrapper";
import { LogContainer, LogRow } from "./components/LogContainer";
import { LogsHistogram } from "./components/LogsHistogram";
import { StoreState } from "@store/types";
import { Card } from "@traceo/ui";
import { useSelector } from "react-redux";

const LogsPage = () => {
  const { logs, hasFetched } = useSelector((state: StoreState) => state.logs);

  return (
    <ExplorePageWrapper>
      <LogsHistogram />
      <Card title="Logs list" bodyClassName="m-0 p-0">
        <ConditionalWrapper
          emptyView={<DataNotFound label="Logs not found" />}
          isEmpty={hasFetched && logs?.length === 0}
          isLoading={!hasFetched}
        >
          <LogContainer>
            {logs?.map((log, index) => (
              <LogRow key={index} {...log} />
            ))}
          </LogContainer>
        </ConditionalWrapper>
      </Card>
    </ExplorePageWrapper>
  );
};

export default LogsPage;
