import { BarChartOutlined, PlusOutlined } from "@ant-design/icons";
import { CustomizeFormSection } from "./CustomizeFormSection";
import {
  editMetricAxisForm,
  editMetricLegendForm,
  editMetricMarkerForm,
  editMetricTooltipForm
} from "./editMetricGraphForm";
import { editSerieForm } from "./editMetricSeriesForm";
import { IMetric, DeepPartial, IMetricSerie } from "@traceo/types";
import { FieldLabel } from "@traceo/ui";
import { FC, useMemo } from "react";
import { DraftFunction } from "use-immer";
import styled from "styled-components";
import { randomHexColor } from "../../../../core/utils/colors";
import { editMetricBasicForm } from "./editMetricBasicForm";

interface Props {
  options: DeepPartial<IMetric>;
  setOptions: (arg: DeepPartial<IMetric> | DraftFunction<DeepPartial<IMetric>>) => void;
}

export const MetricCustomizeForm: FC<Props> = (props: Props) => {
  const [basicOptions, tooltipOptions, axisOptions, legendOptions, markerOptions] = useMemo(
    () => [
      editMetricBasicForm(props),
      editMetricTooltipForm(props),
      editMetricAxisForm(props),
      editMetricLegendForm(props),
      editMetricMarkerForm(props)
    ],
    [props.options]
  );

  const onAddNewSerie = () => {
    props.setOptions((opt) => {
      opt.isDefault = false;
      opt.series.push({
        config: {
          area: {
            show: false,
            opacity: 50
          },
          barWidth: 5,
          color: randomHexColor(),
          lineWidth: 1,
          type: "line"
        },
        field: undefined,
        show: true,
        name: "New serie",
        description: "New serie description"
      });
    });
  };

  const onDeleteSerie = (serie: IMetricSerie) => {
    const newSeries = props.options.series.filter((s) => s !== serie);
    props.setOptions((opt) => {
      opt.series = newSeries;
    });
  };

  const toggleSerieVisibility = (index: number) => {
    const visibility = props.options.series[index].show;
    props.setOptions((opt) => {
      opt.series[index].show = !visibility;
    });
  };

  return (
    <div className="flex flex-col col-span-4 ml-1 bg-primary relative">
      <span className="w-full py-3 px-2 font-semibold text-sm text-primary border-bottom">
        Customize graph
      </span>
      <div className="max-h-[750px] overflow-y-scroll">
        <CustomizeFormSection title="Basic" defaultCollapsed={false}>
          {basicOptions.map((opt, index) => (
            <FieldLabel
              key={index}
              label={opt.label}
              labelPosition={opt?.labelPosition}
              labelSize="xs"
            >
              {opt.component}
            </FieldLabel>
          ))}
        </CustomizeFormSection>
        <CustomizeFormSection title="Axis">
          {axisOptions.map((opt, index) => (
            <FieldLabel
              key={index}
              label={opt.label}
              labelPosition={opt?.labelPosition}
              labelSize="xs"
            >
              {opt.component}
            </FieldLabel>
          ))}
        </CustomizeFormSection>
        <CustomizeFormSection title="Tooltip">
          {tooltipOptions.map((opt, index) => (
            <FieldLabel
              key={index}
              label={opt.label}
              labelPosition={opt?.labelPosition}
              tooltip={opt?.tooltip}
              labelSize="xs"
            >
              {opt.component}
            </FieldLabel>
          ))}
        </CustomizeFormSection>
        <CustomizeFormSection title="Legend">
          {legendOptions.map((opt, index) => (
            <FieldLabel
              key={index}
              label={opt.label}
              labelPosition={opt?.labelPosition}
              labelSize="xs"
            >
              {opt.component}
            </FieldLabel>
          ))}
        </CustomizeFormSection>
        <CustomizeFormSection title="Markers">
          {markerOptions.map((opt, index) => (
            <FieldLabel
              key={index}
              label={opt.label}
              labelPosition={opt?.labelPosition}
              labelSize="xs"
            >
              {opt.component}
            </FieldLabel>
          ))}
        </CustomizeFormSection>

        {/* Series */}

        {props.options.series.map((serie, index) => (
          <div key={index}>
            <CustomizeFormSection
              title={
                <div className="flex flex-row items-center gap-x-2">
                  <BarChartOutlined />
                  <span>{serie.name}</span>
                </div>
              }
              description={serie?.description}
              show={serie?.show}
              defaultMetric={props.options.isDefault}
              onDelete={() => onDeleteSerie(serie as IMetricSerie)}
              onHide={() => toggleSerieVisibility(index)}
            >
              <>
                {editSerieForm({
                  index,
                  serie: serie as IMetricSerie,
                  setOptions: props.setOptions,
                  isDefault: props.options.isDefault
                }).map((opt, index) => (
                  <FieldLabel
                    key={index}
                    label={opt.label}
                    labelPosition={opt?.labelPosition}
                    labelSize="xs"
                  >
                    {opt.component}
                  </FieldLabel>
                ))}
              </>
            </CustomizeFormSection>
          </div>
        ))}

        {!props.options.isDefault && (
          <AddSerieBtn onClick={() => onAddNewSerie()}>
            <PlusOutlined />
            Add new serie
          </AddSerieBtn>
        )}
      </div>
    </div>
  );
};

const AddSerieBtn = styled.div`
  padding: 6px;
  margin: 5px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 4px;
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  transition-duration: 200ms;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  text-align: center;
  justify-content: center;
  align-items: center;
  gap: 15px;

  &:hover {
    background-color: var(--color-bg-light-secondary);
  }
`;
