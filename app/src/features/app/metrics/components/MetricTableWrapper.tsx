import { Table } from "antd";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import dayjs from "dayjs";
import { FC, useState } from "react";
import { IMetric, MetricsResponse } from "../../../../types/metrics";
import { DeepPartial } from "../../../../types/partials";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { Typography } from "core/ui-components/Typography";
import { Card } from "core/ui-components/Card";
import { Space } from "core/ui-components/Space";
import { Switch } from "core/ui-components/Switch";

interface Props {
  metric: DeepPartial<IMetric>;
  metricData: MetricsResponse[];
}
export const MetricTableWrapper: FC<Props> = ({ metric, metricData }) => {
  const [isFormattedTime, setFormattedTime] = useState<boolean>(true);

  const buildColumns = () => {
    const commonColumns = [
      {
        title: "Time",
        dataIndex: "_time",
        render: (time: string) =>
          isFormattedTime ? dayjs(time).format("YYYY-MM-DD HH:mm:ss") : time
      }
    ];

    const seriesColumns =
      metric?.series.map(({ field, name }) => ({
        title: name,
        dataIndex: field,
        render: (v: any) => (v ? `${v} ${metric.unit}` : "-")
      })) || [];

    return [...commonColumns, ...seriesColumns];
  };

  return (
    <Card
      title="Raw data"
      className="h-min"
      extra={
        <Space className="w-full justify-end">
          <Typography>Formatted time</Typography>
          <Switch
            value={isFormattedTime}
            onClick={() => setFormattedTime(!isFormattedTime)}
          />
        </Space>
      }
    >
      <ConditionalWrapper isEmpty={metricData?.length === 0} emptyView={<DataNotFound />}>
        <Table
          dataSource={metricData}
          columns={buildColumns()}
          pagination={{ pageSize: 150 }}
          scroll={{ y: 440 }}
        />
      </ConditionalWrapper>
    </Card>
  );
};
