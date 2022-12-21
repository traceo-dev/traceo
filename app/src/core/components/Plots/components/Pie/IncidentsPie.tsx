import { Segmented } from "antd";
import { ConditionalWrapper } from "../../../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../../../core/components/DataNotFound";
import { slugifyForUrl } from "../../../../../core/utils/stringUtils";
import ReactECharts from "echarts-for-react";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  handleIncidentStatus,
  IncidentStatusSearch
} from "../../../../../types/incidents";
import { PieData } from "../../../../../types/statistics";
import { StoreState } from "../../../../../types/store";
import {
  getPiePlotOptions,
  handleIncidentStatusPieColor,
  IncidentPieType,
  pieChartOptions
} from "./utils";

interface Props {
  data: PieData[];
}

export const IncidentsPie: FC<Props> = ({ data }) => {
  const [type, setType] = useState<IncidentStatusSearch>(IncidentStatusSearch.UNRESOLVED);
  const [plotData, setPlotData] = useState([]);
  // const { application } = useSelector((state: StoreState) => state.application);
  const navigate = useNavigate();

  useEffect(() => {
    type === IncidentStatusSearch.ALL
      ? setPlotData(calculatePieItems())
      : setPlotData(data?.filter((d) => d.status === type));
  }, [data, type]);

  const calculatePieItems = () =>
    Object.values(IncidentStatusSearch).map((incident) => ({
      name: handleIncidentStatus[incident],
      value: data?.filter((i) => i.status === incident).length,
      itemStyle: {
        color: handleIncidentStatusPieColor[incident]
      },
      key: incident
    }));

  // const onPieItemClick = (params: any) => {
  //   const seriesName = params?.seriesName;

  //   if (seriesName === "Incidents") {
  //     setType(params.data.key);
  //   }

  //   if (seriesName === "Errors" && params.data.id) {
  //     navigate(
  //       `/app/${application.id}/${slugifyForUrl(application.name)}/incidents/${
  //         params.data.id
  //       }/details`
  //     );
  //   }
  // };

  // const onEvents = {
  //   click: onPieItemClick
  // };

  return (
    <div className="w-full text-center">
      <Segmented
        options={pieChartOptions}
        value={type}
        onChange={(v) => setType(v as IncidentPieType)}
        onResize={undefined}
        onResizeCapture={undefined}
      />
      <ConditionalWrapper
        isEmpty={plotData?.length === 0}
        emptyView={
          <DataNotFound
            explanation={`${handleIncidentStatus[type]} errors not found`}
            className="mt-12"
          />
        }
      >
        <ReactECharts
          //TODO: using onevents in this component break animation
          // onEvents={onEvents}
          option={getPiePlotOptions(type, plotData)}
          className="mt-12"
        />
      </ConditionalWrapper>
    </div>
  );
};
