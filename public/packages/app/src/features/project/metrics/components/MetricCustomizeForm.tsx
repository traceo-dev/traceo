import { PlusOutlined } from "@ant-design/icons";
import { CustomizeFormSection } from "./CustomizeFormSection";
import { editMetricBasicForm } from "./editMetricBasicForm";
import { editMetricGraphForm } from "./editMetricGraphForm";
import { editSerieForm } from "./editMetricSeriesForm";
import { IMetric, DeepPartial, IMetricSerie } from "@traceo/types";
import { Card, Divider, FieldLabel } from "@traceo/ui";
import { FC, useMemo } from "react";
import { DraftFunction } from "use-immer";
import dateUtils from "src/core/utils/date";
import styled from "styled-components";

interface Props {
  options: DeepPartial<IMetric>;
  setOptions: (arg: DeepPartial<IMetric> | DraftFunction<DeepPartial<IMetric>>) => void;
}

const deafultSerie: DeepPartial<IMetricSerie> = {
  config: {
    area: {
      show: false,
      opacity: 50
    },
    barWidth: 5,
    color: "#ffffff",
    lineWidth: 1,
    type: "line"
  },
  field: undefined,
  name: "New serie"
};

const AddSerieBtn = styled.div`
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  background-color: var(--color-bg-secondary);
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

export const MetricCustomizeForm: FC<Props> = (props: Props) => {
  const [basicOptions, graphOptions] = useMemo(
    () => [editMetricBasicForm(props), editMetricGraphForm(props)],
    [props.options]
  );

  const onAddNewSerie = () => {
    props.setOptions((opt) => {
      opt.isDefault = false;
      opt.id = dateUtils.toUnix().toString();
      opt.series.push(deafultSerie);
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
    <div className="col-span-4 ml-1">
      <Card title="Customize graph">
        <CustomizeFormSection title="Basic options" defaultCollapsed={false}>
          {basicOptions.map((opt, index) => (
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
          {graphOptions.map((opt, index) => (
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
      </Card>
      <Card title="Graph series" bodyClassName="max-h-[500px] overflow-y-auto">
        <>
          {props.options.series.map((serie, index) => (
            <div key={index}>
              <CustomizeFormSection
                title={serie.name}
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
              <Divider />
            </div>
          ))}

          {!props.options.isDefault && (
            <AddSerieBtn onClick={() => onAddNewSerie()}>
              <PlusOutlined />
              Add new serie
            </AddSerieBtn>
          )}
        </>
      </Card>
    </div>
  );
};
