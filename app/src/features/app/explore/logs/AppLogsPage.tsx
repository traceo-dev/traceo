import { TraceoLoading } from "../../../../core/components/TraceoLoading";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { dispatch } from "../../../../store/store";
import { LogLevel } from "../../../../types/logs";
import { StoreState } from "../../../../types/store";
import AppExploreNavigationPage from "../components/AppExploreNavigation";
import { loadApplicationLogs } from "./state/actions";

import { Divider, Space, Tag, Typography } from "antd";
import { ConditionLayout } from "../../../../core/components/ConditionLayout";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import dateUtils from "../../../../core/utils/date";
import { LogsHistogram } from "../../../../features/app/explore/components/LogsHistogram";
import { LogContainer, LogRow } from "../components/LogContainer";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { PagePanel } from "../../../../core/components/PagePanel";

const AppLogsPage = () => {
  const { id } = useParams();
  const { logs, hasFetched } = useSelector((state: StoreState) => state.logs);

  useEffect(() => {
    dispatch(
      loadApplicationLogs(id, {
        startDate: dayjs().subtract(30, "minute").unix(),
        endDate: dateUtils.toUnix()
      })
    );
  }, []);

  if (!logs) {
    return <TraceoLoading />;
  }

  const errorLogsCount = logs?.filter((log) => log.level === LogLevel.Error).length;

  const LogDetails = () => {
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
          <Typography.Text key={index} className="text-xs">
            {label} <Tag>{value}</Tag>
          </Typography.Text>
        ))}
      </Space>
    );
  };

  return (
    <AppExploreNavigationPage>
      <PagePanel title="Histogram">
        <LogsHistogram />
      </PagePanel>
      <PagePanel title="Logs list">
        <LogDetails />
        <Divider className="my-2" />
        <ConditionLayout
          emptyView={<DataNotFound label="Logs not found" />}
          isEmpty={logs?.length === 0}
          isLoading={!hasFetched}
        >
          <LogContainer>
            {logs?.map((log, index) => (
              <LogRow key={index} log={log} />
            ))}
          </LogContainer>
        </ConditionLayout>
      </PagePanel>
    </AppExploreNavigationPage>
  );
};

export default AppLogsPage;
