import { IMetricSerie } from "@traceo/types";
import { FieldLabel } from "@traceo/ui";
import { FormSection } from "./CustomizeFormSection";
import { editPanelSerieForm } from "./editPanelSeriesForm";
import { Fragment, useMemo } from "react";
import { editPanelLegendForm } from "./editPanelGraphForm";
import { editPanelHistogramForm } from "./editPanelHistogramForm";
import { randomHexColor } from "../../../../../core/utils/colors";
import { PlusOutlined } from "@ant-design/icons";
import { AddSerieBtn } from "./components";
import { FormProps } from "./types";
import { CustomizeFormSerieSection } from "./CustomizeFormSerieSection";

export const HistogramForm = (props: FormProps) => {
  const [legendOptions, histogramOptions] = useMemo(
    () => [editPanelLegendForm(props), editPanelHistogramForm(props)],
    [props.options]
  );

  const onAddNewSerie = () => {
    const serie: IMetricSerie = {
      name: "New serie",
      description: "New serie description",
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
      field: undefined
    };
    props.data.push([]);
    props.setOptions((opt) => {
      opt.config.series.push(serie);
    });
  };

  const onDeleteSerie = (serie: IMetricSerie) => {
    const newSeries = props.options.config.series.filter((s) => s !== serie);
    props.setOptions((opt) => {
      opt.config.series = newSeries;
    });
  };

  return (
    <Fragment>
      <FormSection title="Histogram" options={histogramOptions} />
      <FormSection title="Legend" options={legendOptions} />

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

      <AddSerieBtn onClick={() => onAddNewSerie()}>
        <PlusOutlined />
        Add new serie
      </AddSerieBtn>
    </Fragment>
  );
};
