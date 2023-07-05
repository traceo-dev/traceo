import { IMetricSerie } from "@traceo/types";
import { Alert, FieldLabel, Row } from "@traceo/ui";
import { CustomizeFormSection } from "../CustomizeFormSection";
import { editSerieForm } from "../editMetricSeriesForm";
import { useMemo } from "react";
import { editMetricLegendForm } from "../editMetricGraphForm";
import { editMetricHistogramForm } from "../editMetricHistogramForm";
import { randomHexColor } from "../../../../../core/utils/colors";
import { PlusOutlined } from "@ant-design/icons";
import { AddSerieBtn } from "./components";
import { GH_REPO_ISSUE_LINK } from "../../../../../core/utils/constants";
import { FormProps } from "./types";
import { CustomizeFormSerieSection } from "../CustomizeFormSerieSection";

export const HistogramForm = (props: FormProps) => {
  const [legendOptions, histogramOptions] = useMemo(
    () => [editMetricLegendForm(props), editMetricHistogramForm(props)],
    [props.options]
  );

  const onAddNewSerie = () => {
    props.data.push([]);
    props.setOptions((opt) => {
      // opt.internal = false;
      opt.config.series.push({
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
    const newSeries = props.options.config.series.filter((s) => s !== serie);
    props.setOptions((opt) => {
      opt.config.series = newSeries;
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

      {props.options.config.series.map((serie, index) => {
        const serieProps = {
          index,
          serie: serie as IMetricSerie,
          setOptions: props.setOptions,
          serieFieldOptions: props.serieFieldOptions,
          visualization: props.options.config.visualization,
          panelType: props.options.type
        };

        return (
          <CustomizeFormSerieSection
            key={index}
            serie={serie}
            onDelete={() => onDeleteSerie(serie as IMetricSerie)}
          >
            {editSerieForm(serieProps).map((opt, index) => (
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

      <AddSerieBtn onClick={() => onAddNewSerie()}>
        <PlusOutlined />
        Add new serie
      </AddSerieBtn>
    </>
  );
};
