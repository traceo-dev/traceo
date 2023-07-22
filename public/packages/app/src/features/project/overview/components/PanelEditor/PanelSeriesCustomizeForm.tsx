import { DashboardPanel, IMetricSerie, PLOT_TYPE } from "@traceo/types";
import { FieldLabel } from "@traceo/ui";
import { FC } from "react";
import { DraftFunction } from "use-immer";
import { Container } from "./components";
import { editPanelSerieForm } from "./editPanelSeriesForm";
import { CustomizeFormSerieSection } from "./CustomizeFormSerieSection";
import { BarChartOutlined, DotChartOutlined, LineChartOutlined } from "@ant-design/icons";

interface Props {
  options: DashboardPanel;
  setOptions: (arg: DashboardPanel | DraftFunction<DashboardPanel>) => void;
}

const mapPlotTypeToIcon: Record<PLOT_TYPE, JSX.Element> = {
  [PLOT_TYPE.BAR]: <BarChartOutlined />,
  [PLOT_TYPE.LINE]: <LineChartOutlined />,
  [PLOT_TYPE.SPLINE]: <LineChartOutlined />,
  [PLOT_TYPE.POINTS]: <DotChartOutlined />
};

export const PanelSeriesCustomizeForm: FC<Props> = ({ options, setOptions }: Props) => {
  return (
    <Container>
      <div className="max-h-[750px] overflow-y-scroll">
        {options.config.series.map((serie, index) => {
          const serieProps = {
            index,
            serie: serie as IMetricSerie,
            setOptions: setOptions,
            visualization: options.config.visualization,
            panelType: options.type
          };

          return (
            <CustomizeFormSerieSection
              key={index}
              serie={serie}
              collapsed={index !== 0}
              extra={mapPlotTypeToIcon[serie.config.type]}
            >
              {editPanelSerieForm(serieProps).map((opt, index) => (
                <FieldLabel
                  key={index}
                  label={opt.label}
                  labelPosition={opt?.labelPosition}
                  labelSize="xs"
                >
                  {opt.component}
                </FieldLabel>
              ))}
            </CustomizeFormSerieSection>
          );
        })}
      </div>
    </Container>
  );
};
