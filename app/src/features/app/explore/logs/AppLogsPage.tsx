import { TraceoLoading } from "../../../../core/components/TraceoLoading";
import { useSelector } from "react-redux";
import { LogLevel } from "../../../../types/logs";
import { StoreState } from "../../../../types/store";
import AppExploreNavigationPage from "../AppExploreNavigation";

import { Divider, Tag } from "antd";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { LogsHistogram } from "./components/LogsHistogram";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { LogContainer, LogRow } from "./components/LogContainer";
import { Typography } from "core/ui-components/Typography/Typography";
import { Card } from "core/ui-components/Card/Card";
import { Space } from "core/ui-components/Space/Space";

const AppLogsPage = () => {
  const { logs, hasFetched } = useSelector((state: StoreState) => state.logs);

  if (!logs) {
    return <TraceoLoading />;
  }

  const errorLogsCount = logs?.filter((log) => log.level === LogLevel.Error).length;

  const LogDetails = () => {
    // TODO: remove this
    const logsDetails = [
      {
        label: "Fetched logs:",
        value: logs.length
      },
      {
        label: "Error logs:",
        value: errorLogsCount
      },
      {
        label: "Logs limit:",
        value: 1000
      },
      {
        label: "Logs retention:",
        value: "3 days"
      }
    ];
    return (
      <Space className="w-full">
        {logsDetails.map(({ label, value }, index) => (
          <Typography key={index} size="xs">
            {label} <Tag>{value}</Tag>
          </Typography>
        ))}
      </Space>
    );
  };

  return (
    <AppExploreNavigationPage>
      <LogsHistogram />
      <Card title="Logs list">
        <LogDetails />
        <Divider className="my-2" />
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
    </AppExploreNavigationPage>
  );
};

export default AppLogsPage;
