import { DeepPartial, IMetric, IMetricSerie, UplotDataType } from "@traceo/types";
import { Alert, FieldLabel, Row } from "@traceo/ui";
import { CustomizeFormSection } from "../CustomizeFormSection";
import { editSerieForm } from "../editMetricSeriesForm";
import { useMemo } from "react";
import { editMetricLegendForm } from "../editMetricGraphForm";
import { editMetricHistogramForm } from "../editMetricHistogramForm";
import { DraftFunction } from "use-immer";
import { randomHexColor } from "../../../../../core/utils/colors";
import { PlusOutlined } from "@ant-design/icons";
import { AddSerieBtn } from "./components";
import { GH_REPO_ISSUE_LINK } from "../../../../../core/utils/constants";

interface Props {
  data?: UplotDataType;
  options: DeepPartial<IMetric>;
  setOptions: (arg: DeepPartial<IMetric> | DraftFunction<DeepPartial<IMetric>>) => void;
}

export const HistogramForm = (props: Props) => {
  const [legendOptions, histogramOptions] = useMemo(
    () => [editMetricLegendForm(props), editMetricHistogramForm(props)],
    [props.options]
  );

  const onAddNewSerie = () => {
    props.data.push([]);
    props.setOptions((opt) => {
      opt.internal = false;
      opt.series.push({
        config: {
          area: {
            show: true,
            opacity: 50
          },
          barWidth: 50,
          color: randomHexColor(),
          lineWidth: 0,
          type: "bar"
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

  return (
    <>
      <CustomizeFormSection title="Histogram">
        <Alert
          type="info"
          className="mb-3"
          message={
            <span className="text-xs">
              The histogram is still under development. Please report bugs on{" "}
              <a target="_blank" className="text-yellow-500" href={GH_REPO_ISSUE_LINK}>
                Github.
              </a>
            </span>
          }
        />

        {histogramOptions.map((opt, index) => (
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

      {props.options.series.map((serie, index) => (
        <div key={index}>
          <CustomizeFormSection
            title={
              <Row gap="x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: serie.config.color }}
                />
                <span>{serie.name}</span>
              </Row>
            }
            description={serie?.description}
            onDelete={() => onDeleteSerie(serie as IMetricSerie)}
          >
            <>
              {editSerieForm({
                index,
                serie: serie as IMetricSerie,
                setOptions: props.setOptions,
                isDefault: props.options.internal,
                type: props.options.type
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

      <AddSerieBtn onClick={() => onAddNewSerie()}>
        <PlusOutlined />
        Add new serie
      </AddSerieBtn>
    </>
  );
};
