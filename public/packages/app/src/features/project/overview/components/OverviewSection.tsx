import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { useRequest } from "../../../../core/hooks/useRequest";
import { SyncOutlined } from "@ant-design/icons";
import { ErrorDetails, PlotData } from "@traceo/types";
import { Card } from "@traceo/ui";
import { useParams } from "react-router-dom";
import IncidentsOverviewChart from "../../../../core/components/Charts/Incidents/IncidentsOverviewChart";

export interface TotalOverviewType {
  errors: ErrorDetails[];
}

export const OverviewSection = () => {
  const { id } = useParams();

  const {
    data = [],
    isLoading,
    execute
  } = useRequest<PlotData[]>({
    url: `/api/event/project/${id}/grouped`
  });

  return (
    <div className="w-full h-full">
      <Card
        title="Project overview"
        extra={<SyncOutlined className="text-xs" onClick={() => execute()} />}
      >
        <ConditionalWrapper
          emptyView={<DataNotFound />}
          isEmpty={data && data?.length === 0}
          isLoading={isLoading}
        >
          <IncidentsOverviewChart data={data} />
        </ConditionalWrapper>
      </Card>
    </div>
  );
};
