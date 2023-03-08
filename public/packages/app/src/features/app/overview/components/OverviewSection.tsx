import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { useRequest } from "../../../../core/hooks/useRequest";
import { SyncOutlined } from "@ant-design/icons";
import { ErrorDetails } from "@traceo/types";
import { Card } from "@traceo/ui";
import { useParams } from "react-router-dom";
import IncidentsOverviewChart from "src/core/components/Charts/Incidents/IncidentsOverviewChart";

export interface TotalOverviewType {
  errors: ErrorDetails[];
}

export const OverviewSection = () => {
  const { id } = useParams();

  const {
    data: dataSource,
    isLoading,
    execute: reload
  } = useRequest<TotalOverviewType>({
    url: "/api/statistics/total",
    params: {
      id
    }
  });

  return (
    <div className="w-full h-full">
      <Card
        title="App overview"
        extra={<SyncOutlined className="text-xs" onClick={() => reload()} />}
      >
        <ConditionalWrapper
          emptyView={<DataNotFound />}
          isEmpty={dataSource?.errors?.length === 0}
          isLoading={isLoading}
        >
          <IncidentsOverviewChart stats={dataSource?.errors} />
        </ConditionalWrapper>
      </Card>
    </div>
  );
};
