import { useApi } from "../../../../core/lib/useApi";
import { SyncOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../../../store";
import { ErrorDetails } from "../../../../types/incidents";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { Card } from "core/ui-components/Card";
import { AppOverviewPlot } from "core/components/Plots";

export interface TotalOverviewType {
  errors: ErrorDetails[];
}

export const OverviewSection = () => {
  const { id } = useParams();

  const {
    data: dataSource,
    isLoading,
    execute: reload
  } = useApi<TotalOverviewType>({
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
          <AppOverviewPlot stats={dataSource?.errors} />
        </ConditionalWrapper>
      </Card>
    </div>
  );
};
