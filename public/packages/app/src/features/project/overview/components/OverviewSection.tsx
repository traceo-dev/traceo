import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { SyncOutlined } from "@ant-design/icons";
import { ErrorDetails, PlotData } from "@traceo/types";
import { useParams } from "react-router-dom";
import IncidentsOverviewChart from "../../../../core/components/Charts/Incidents/IncidentsOverviewChart";
import { useReactQuery } from "../../../../core/hooks/useReactQuery";
import { ContentCard } from "src/core/components/ContentCard";

export interface TotalOverviewType {
  errors: ErrorDetails[];
}

export const OverviewSection = () => {
  const { id } = useParams();

  const {
    data = [],
    isLoading,
    isFetching,
    refetch
  } = useReactQuery<PlotData[]>({
    queryKey: [`evets_grouped_${id}`],
    url: `/api/event/project/${id}/grouped`
  });

  return (
    <div className="w-full h-full">
      <ContentCard
        name="Project overview"
        loading={isFetching || isLoading}
        extra={
          !isFetching &&
          !isLoading && <SyncOutlined className="text-xs" onClick={() => refetch()} />
        }
      >
        <ConditionalWrapper emptyView={<DataNotFound />} isEmpty={data && data?.length === 0}>
          <IncidentsOverviewChart data={data} />
        </ConditionalWrapper>
      </ContentCard>
    </div>
  );
};
