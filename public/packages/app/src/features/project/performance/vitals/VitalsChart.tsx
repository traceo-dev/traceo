import { VitalsBinType, VitalsEnum } from "@traceo/types";
import { BaseChart } from "../../../../core/components/Charts/BaseChart";
import { BaseTooltip } from "../../../../core/components/Charts/BaseTooltip";
import { BaseXAxis } from "../../../../core/components/Charts/BaseXAxis";
import { BaseYAxis } from "../../../../core/components/Charts/BaseYAxis";
import { barColor, vitalsFormatter } from "./utils";

interface VitalsChart {
  field: VitalsEnum;
  data: VitalsBinType[];
}

export const VitalsChart = ({ data, field }: VitalsChart) => {
  return (
    <BaseChart
      animation={true}
      activeZoomSelect={true}
      height="200px"
      tooltip={BaseTooltip()}
      dataset={{
        source: data
      }}
      grid={{
        left: "50px",
        right: "10px",
        top: "15px",
        bottom: "25px"
      }}
      xAxis={BaseXAxis({
        show: true,
        splitLine: {
          show: false
        },
        pointerFormatter: (value: any) => vitalsFormatter(field, value) as string,
        labelFormatter: (value: any) => vitalsFormatter(field, value) as string
      })}
      yAxis={BaseYAxis({
        minInterval: 1,
        axisLabel: {
          showMinLabel: false,
          color: "#CCCCDC",
          fontSize: 10
        }
      })}
      series={{
        name: "Count",
        type: "bar",
        itemStyle: {
          borderWidth: 2,
          color: (params) => barColor(field, params.value["bin"])
        }
      }}
    />
  );
};
