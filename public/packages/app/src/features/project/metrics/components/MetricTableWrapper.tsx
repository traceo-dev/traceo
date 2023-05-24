import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { IMetric, MetricResponseType, DeepPartial, METRIC_UNIT } from "@traceo/types";
import { Card, Table, TableColumn } from "@traceo/ui";
import { FC } from "react";
import dayjs from "dayjs";
import dateUtils from "src/core/utils/date";

interface Props {
  metric: DeepPartial<IMetric>;
  metricData: MetricResponseType[];
  isLoading: boolean;
}
export const MetricTableWrapper: FC<Props> = ({ metric, metricData, isLoading }) => (
  <Card title="Raw data" bodyClassName="max-h-96 overflow-y-auto">
    <ConditionalWrapper
      isEmpty={!metricData || metricData.length === 0}
      isLoading={isLoading}
      emptyView={<DataNotFound />}
    >
      <Table collection={metricData} hovered pageSize={100}>
        <TableColumn name="Time">
          {({ item }) => dayjs.unix(Number(item.timestamp)).format("YYYY-MM-DD HH:mm:ss")}
        </TableColumn>
        {metric?.series
          .filter((serie) => serie?.show)
          .map((serie, index) => (
            <TableColumn key={index} name={serie.name}>
              {({ item }) => (
                <span>
                  {item[serie.field] ? (
                    <div className="flex flex-row items-center gap-x-1">
                      <span>{item[serie.field]}</span>
                      <span>{serie.unit === METRIC_UNIT.NONE ? "" : serie.unit}</span>
                    </div>
                  ) : (
                    "-"
                  )}
                </span>
              )}
            </TableColumn>
          ))}
      </Table>
    </ConditionalWrapper>
  </Card>
);
