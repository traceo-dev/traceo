import { LoadingOutlined, SyncOutlined } from "@ant-design/icons";
import { Space, Segmented, Button } from "antd";
import { PagePanel } from "../../../../core/components/PagePanel";
import { FC } from "react";
import { PLOT_TYPE } from "../../../../types/metrics";
import { MetricsResponse } from "../../../../types/tsdb";

interface Props {
  children: JSX.Element;
  execute: () => void;
  isLoading: boolean;
  metrics: MetricsResponse[];
  hrCount: number;
  setHrCount: (val: number) => void;
  setChartType: (val: PLOT_TYPE) => void;
}
export const MetricPlotWrapper: FC<Props> = ({
  children,
  execute,
  isLoading,
  metrics,
  hrCount,
  setHrCount,
  setChartType
}) => {
  return (
    <PagePanel
      title="Graph"
      extra={
        <Space className="w-full justify-between">
          <Space>
            {metrics && isLoading && <LoadingOutlined className="mr-5" />}
            <Segmented
              className="mr-5"
              options={[
                { value: "line", label: "Line" },
                { value: "bar", label: "Bars" },
                { value: "scatter", label: "Points" }
              ]}
              onChange={(v) => setChartType(v as PLOT_TYPE)}
              onResize={undefined}
              onResizeCapture={undefined}
            />
            <Segmented
              defaultValue={hrCount}
              options={[
                { value: 1, label: "1h" },
                { value: 3, label: "3h" },
                { value: 6, label: "6h" },
                { value: 12, label: "12h" },
                { value: 24, label: "24h" },
                { value: 48, label: "2d" },
                { value: 72, label: "3d" }
              ]}
              onChange={(v) => setHrCount(v as number)}
              onResize={undefined}
              onResizeCapture={undefined}
            />
            <Button type="primary" onClick={() => execute()}>
              Refresh <SyncOutlined />
            </Button>
          </Space>
        </Space>
      }
    >
      {children}
    </PagePanel>
  );
};
