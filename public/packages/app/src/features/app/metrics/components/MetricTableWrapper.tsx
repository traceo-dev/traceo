import { DataNotFound } from "../../../../core/components/DataNotFound";
import dayjs from "dayjs";
import { FC, useState } from "react";
import { IMetric, MetricsResponse, DeepPartial } from "@traceo/types";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { Typography, Card, Space, Switch, Table, TableColumn } from "@traceo/ui";

interface Props {
  metric: DeepPartial<IMetric>;
  metricData: MetricsResponse[];
}
export const MetricTableWrapper: FC<Props> = ({ metric, metricData }) => {
  const [isFormattedTime, setFormattedTime] = useState<boolean>(true);

  return (
    <Card
      title="Raw data"
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
        {/* TODO: temporary solution, in future should be scroll 
                  implemented in Table component and thead 
                  should be sticky to top */}
        <div className="w-full overflow-auto h-64">
          <Table collection={metricData} hovered>
            <TableColumn name="Time">
              {({ item }) =>
                isFormattedTime
                  ? dayjs(item._time).format("YYYY-MM-DD HH:mm:ss")
                  : item._time
              }
            </TableColumn>
            {metric?.series?.map((serie) => (
              <TableColumn name={serie.name}>
                {({ item }) => (
                  <span>
                    {item[serie.field]} {metric.unit}
                  </span>
                )}
              </TableColumn>
            ))}
          </Table>
        </div>
      </ConditionalWrapper>
    </Card>
  );
};
