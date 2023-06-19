import { ConditionalWrapper } from "../../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { SyncOutlined } from "@ant-design/icons";
import { ErrorDetails, UplotDataType } from "@traceo/types";
import { useParams } from "react-router-dom";
import { useReactQuery } from "../../../../core/hooks/useReactQuery";
import { ContentCard } from "../../../../core/components/ContentCard";
import { UPlotOverviewEventsGraph } from "./UPlotOverviewEventsGraph";

export interface TotalOverviewType {
  errors: ErrorDetails[];
}

export const OverviewSection = () => {
  const { id } = useParams();

  const {
    data = {
      graph: [[]]
    },
    isLoading,
    isFetching,
    refetch
  } = useReactQuery<{ graph: UplotDataType }>({
    queryKey: [`evets_grouped_${id}`],
    url: `/api/event/graph/project-overview`,
    params: { id }
  });

  const isEmpty = data && data?.graph[0].length === 0;

  return (
    <div className="w-full h-full">
      <ContentCard
        name="Last month events"
        loading={isFetching || isLoading}
        extra={
          !isFetching &&
          !isLoading && <SyncOutlined className="text-xs" onClick={() => refetch()} />
        }
      >
        <ConditionalWrapper isLoading={isLoading} emptyView={<DataNotFound />} isEmpty={isEmpty}>
          <UPlotOverviewEventsGraph data={data.graph} />
        </ConditionalWrapper>
      </ContentCard>
    </div>
  );
};
