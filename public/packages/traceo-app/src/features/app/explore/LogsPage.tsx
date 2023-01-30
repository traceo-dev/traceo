import { useSelector } from "react-redux";
import { StoreState } from "../../../types/store";
import ExplorePageWrapper from "./ExplorePageWrapper";

import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { LogsHistogram } from "./components/LogsHistogram";
import { DataNotFound } from "../../../core/components/DataNotFound";
import { LogContainer, LogRow } from "./components/LogContainer";
import { Card } from "@traceo/ui"

const LogsPage = () => {
  const { logs, hasFetched } = useSelector((state: StoreState) => state.logs);

  return (
    <ExplorePageWrapper>
      <LogsHistogram />
      <Card title="Logs list">
        <ConditionalWrapper
          emptyView={<DataNotFound label="Logs not found" />}
          isEmpty={logs?.length === 0}
          isLoading={!hasFetched && !logs}
        >
          <LogContainer>
            {logs?.map((log, index) => (
              <LogRow key={index} log={log} />
            ))}
          </LogContainer>
        </ConditionalWrapper>
      </Card>
    </ExplorePageWrapper>
  );
};

export default LogsPage;
