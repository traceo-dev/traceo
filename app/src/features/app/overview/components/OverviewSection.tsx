import { useApi } from "../../../../core/lib/useApi";
import { SyncOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { dispatch } from "../../../../store/store";
import { ErrorDetails } from "../../../../types/incidents";
import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { loadApplication } from "../../../../features/app/state/application/actions";
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
    execute: get
  } = useApi<TotalOverviewType>({
    url: "/api/statistics/total",
    params: {
      id
    }
  });

  const refresh = () => {
    get();
    dispatch(loadApplication());
  };

  return (
    <div className="w-full h-full">
      <Card
        title="App overview"
        extra={<SyncOutlined className="text-xs" onClick={() => refresh()} />}
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
