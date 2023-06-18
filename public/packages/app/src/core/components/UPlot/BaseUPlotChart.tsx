import { useEffect, useRef } from "react";
import uPlot from "uplot";

type ChartConfigs = {
  options: uPlot.Options;
  data: uPlot.AlignedData;
};

interface ChartProps {
  configs: ChartConfigs;
}

const BaseUPlotChart = ({ configs }: ChartProps) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = new uPlot(configs.options, configs.data, chartRef.current);
    if (!chart.over) {
      return;
    }

    const handleResize = () => {
      if (chartRef.current) {
        const { width } = chartRef.current.getBoundingClientRect();
        configs.options.width = width;

        chart.setSize({
          width: width,
          height: configs.options.height
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      chart.destroy();
      window.removeEventListener("resize", handleResize);
    };
    // getBoundingClientRect in deps array to resize chart when wrapper div is resized by client
  }, [configs, chartRef.current?.getBoundingClientRect()]);

  return <div className="relative" ref={chartRef} />;
};

export default BaseUPlotChart;
