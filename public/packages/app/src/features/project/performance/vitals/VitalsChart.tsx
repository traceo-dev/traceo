import { LoadingOutlined } from "@ant-design/icons";
import { VitalsBinType, VitalsEnum, VitalsResponse } from "@traceo/types";
import { Space } from "@traceo/ui";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { BaseChart } from "../../../../core/components/Charts/BaseChart";
import { BaseTooltip } from "../../../../core/components/Charts/BaseTooltip";
import { BaseXAxis } from "../../../../core/components/Charts/BaseXAxis";
import { BaseYAxis } from "../../../../core/components/Charts/BaseYAxis";
import { barColor, vitalsFormatter } from "./utils";

interface VitalsChart {
  field: VitalsEnum;
  data: VitalsBinType[];
}

const VitalsChart = ({ data, field }: VitalsChart) => {
  return (
    <BaseChart
      animation={true}
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

export const renderChart = ({
  field,
  isLoading,
  data
}: {
  field: VitalsEnum;
  isLoading: boolean;
  data: VitalsResponse;
}) => {
  if (isLoading) {
    return (
      <Space className="w-full justify-center flex flex-col">
        <LoadingOutlined className="mt-12" />
        <span>Loading...</span>
      </Space>
    );
  }

  if (!data || !data[field]) {
    return <DataNotFound className="mt-12" label="Performance data not found" />;
  }

  return (
    <Space className="w-full justify-center">
      <VitalsChart field={field} data={data[field]} />
    </Space>
  );
};
