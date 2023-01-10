import { Space, Switch, Table } from "antd";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { PagePanel } from "../../../../core/components/PagePanel";
import dayjs from "dayjs";
import { FC, useState } from "react";
import { IMetric, MetricsResponse } from "../../../../types/metrics";
import { DeepPartial } from "../../../../types/partials";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { Typography } from "core/ui-components/Typography/Typography";

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
    <PagePanel
      title="Raw data"
      extra={
        <Space className="w-full justify-end">
          <Typography>Formatted time</Typography>
          <Switch
            defaultChecked={isFormattedTime}
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
    </PagePanel>
  );
};
