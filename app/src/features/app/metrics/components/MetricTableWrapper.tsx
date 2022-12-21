import { Space, Typography, Switch, Table } from "antd";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { PagePanel } from "../../../../core/components/PagePanel";
import { metricConfig } from "../../../../core/components/Plots/components/Metrics/utils";
import dayjs from "dayjs";
import { FC, useState } from "react";
import { METRIC_TYPE } from "../../../../types/metrics";
import { MetricsResponse } from "../../../../types/tsdb";

interface Props {
  type: METRIC_TYPE;
  metrics: MetricsResponse[];
}
export const MetricTableWrapper: FC<Props> = ({ metrics, type }) => {
  const [isFormattedTime, setFormattedTime] = useState<boolean>(true);

  const { series, unit } = metricConfig[type];

  const buildColumns = () => {
    const commonColumns = [
      {
        title: "Time",
        dataIndex: "_time",
        render: (time: string) =>
          isFormattedTime ? dayjs(time).format("YYYY-MM-DD HH:mm:ss") : time
      }
    ];

    const seriesColumns = series.map(({ field, name }) => ({
      title: name,
      dataIndex: field,
      render: (v: any) => (v ? `${v}${unit}` : "-")
    }));

    return [...commonColumns, ...seriesColumns];
  };

  return (
    <PagePanel
      title="Raw data"
      extra={
        <Space className="w-full justify-end">
          <Typography.Text className="text-md">Formatted time</Typography.Text>
          <Switch
            defaultChecked={isFormattedTime}
            onClick={() => setFormattedTime(!isFormattedTime)}
          />
        </Space>
      }
    >
      {metrics?.length > 0 ? (
        <Table
          dataSource={metrics}
          columns={buildColumns()}
          pagination={{ pageSize: 150 }}
          scroll={{ y: 440 }}
        />
      ) : (
        <DataNotFound />
      )}
    </PagePanel>
  );
};
