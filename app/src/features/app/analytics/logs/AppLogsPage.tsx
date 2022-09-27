import { TraceoLoading } from "core/components/TraceoLoading";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { dispatch } from "store/store";
import { LogLevel } from "types/logs";
import { StoreState } from "types/store";
import AppAnalyticsNavigationPage from "../components/AppAnalyticsNavigation";
import { loadApplicationLogs } from "./state/actions";

import { Divider, Space, Tag, Typography } from "antd";
import { ConditionLayout } from "core/components/ConditionLayout";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import dateUtils from "core/utils/date";
import { LogsPlot } from "features/app/analytics/components/LogsPlot";
import { LogContainer, LogRow } from "../components/LogContainer";

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
      <>
        <Typography.Text className="font-semibold text-lg">Logs list</Typography.Text>
        <Space className="w-full">
          {logsDetails.map(({ label, value }, index) => (
            <Typography.Text key={index} className="text-xs">
              {label} <Tag>{value}</Tag>
            </Typography.Text>
          ))}
        </Space>
      </>
    );
  };

  return (
    <AppAnalyticsNavigationPage>
      <LogsPlot />
      <LogDetails />
      <Divider className="my-0" />
      <ConditionLayout
        emptyView={<Typography.Text>No logs</Typography.Text>}
        isEmpty={logs?.length === 0}
        isLoading={!hasFetched}
      >
        <LogContainer>
          {logs?.map((log, index) => (
            <LogRow key={index} log={log} />
          ))}
        </LogContainer>
      </ConditionLayout>
    </AppAnalyticsNavigationPage>
  );
};

export default AppLogsPage;
