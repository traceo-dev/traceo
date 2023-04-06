import { IMetric, MetricResponseType } from "@traceo/types";
import { useEffect } from "react";
import { useProject } from "../../../../core/hooks/useProject";
import { useQuery } from "react-query";
import api from "../../../../core/lib/api";

interface Props {
  metricId: string;
  ranges: number[];
}

type ResponseType = {
  options: IMetric;
  datasource: MetricResponseType;
};

export const useMetricQuery = ({ metricId, ranges }: Props) => {
  const { project } = useProject();
  const url = `/api/metrics/${project.id}/preview/${metricId}`;

  const hookResponse = useQuery<any, any, ResponseType, any>([`metric_preview_${metricId}`], () =>
    api.get(url, {
      from: ranges[0],
      to: ranges[1]
    })
  );

  useEffect(() => {
    hookResponse.refetch();
  }, [ranges]);

  const payload = hookResponse?.data?.["data"] || [];
  return {
    ...hookResponse,
    data: payload
  };
};
