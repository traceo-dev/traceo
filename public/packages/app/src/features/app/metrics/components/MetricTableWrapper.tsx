import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { IMetric, MetricsResponse, DeepPartial } from "@traceo/types";
import { Typography, Card, Space, Switch, Table, TableColumn } from "@traceo/ui";
import dayjs from "dayjs";
import { FC, useState } from "react";

interface Props {
  metric: DeepPartial<IMetric>;
  metricData: MetricsResponse[];
}
export const MetricTableWrapper: FC<Props> = ({ metric, metricData }) => {
  const [isFormattedTime, setFormattedTime] = useState<boolean>(true);

  return (
    <Card
      title="Raw data"
      bodyClassName="max-h-96 overflow-y-auto"
      extra={
        <Space className="w-full justify-end">
          <Typography>Formatted time</Typography>
          <Switch value={isFormattedTime} onChange={() => setFormattedTime(!isFormattedTime)} />
        </Space>
      }
    >
      <ConditionalWrapper isEmpty={metricData?.length === 0} emptyView={<DataNotFound />}>
        <Table collection={metricData} hovered>
          <TableColumn name="Time">
            {({ item }) =>
              isFormattedTime ? dayjs(item._time).format("YYYY-MM-DD HH:mm:ss") : item._time
            }
          </TableColumn>
          {metric?.series?.map((serie, index) => (
            <TableColumn key={index} name={serie.name}>
              {({ item }) => (
                <span>
                  {item[serie.field]} {metric.unit}
                </span>
              )}
            </TableColumn>
          ))}
        </Table>
      </ConditionalWrapper>
    </Card>
  );
};
