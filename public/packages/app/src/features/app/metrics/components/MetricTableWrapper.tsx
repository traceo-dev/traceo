import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { IMetric, MetricResponseType, DeepPartial } from "@traceo/types";
import { Typography, Card, Space, Switch } from "@traceo/ui";
import { FC, useState } from "react";

interface Props {
  metric: DeepPartial<IMetric>;
  metricData: MetricResponseType;
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
      <ConditionalWrapper isEmpty={metricData?.time?.length === 0} emptyView={<DataNotFound />}>
        {/* <Table collection={metricData} hovered pageSize={100}>
          <TableColumn name="Time">
            {({ item }) =>
              isFormattedTime ? dayjs.unix(Number(item.time)).format("YYYY-MM-DD HH:mm:ss") : item.timestamp
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
        </Table> */}
      </ConditionalWrapper>
    </Card>
  );
};
