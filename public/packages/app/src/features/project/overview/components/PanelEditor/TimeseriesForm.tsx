import { PlusOutlined } from "@ant-design/icons";
import { IMetricSerie } from "@traceo/types";
import { FieldLabel } from "@traceo/ui";
import { FormSection } from "./CustomizeFormSection";
import { editPanelSerieForm } from "./editPanelSeriesForm";
import { Fragment, useMemo } from "react";
import { randomHexColor } from "../../../../../core/utils/colors";
import {
  editPanelTooltipForm,
  editPanelAxisForm,
  editPanelLegendForm,
  editPanelMarkerForm,
  editPanelStackForm
} from "./editPanelGraphForm";
import { AddSerieBtn } from "./components";
import { FormProps } from "./types";
import { CustomizeFormSerieSection } from "./CustomizeFormSerieSection";

export const TimeseriesForm = (props: FormProps) => {
  const series = props.options.config.series;
  const [tooltipOptions, axisOptions, legendOptions, markerOptions, stackOptions] = useMemo(
    () => [
      editPanelTooltipForm(props),
      editPanelAxisForm(props),
      editPanelLegendForm(props),
      editPanelMarkerForm(props),
      editPanelStackForm(props)
    ],
    [props.options]
  );

  const onDeleteSerie = (serie: IMetricSerie) => {
    const newSeries = series.filter((s) => s !== serie);
    props.setOptions((opt) => {
      opt.config.series = newSeries;
    });
  };

  const onAddNewSerie = () => {
    const serie: IMetricSerie = {
      name: "New serie",
      description: undefined,
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
      field: undefined
    };

    console.log("onAddNewSerie");
    console.log(props.options.config)

    props.data.push([]);
    props.setOptions((opt) => {
      opt.config.series.push(serie);
    });
  };

  return (
    <Fragment>
      <FormSection title="Axis" options={axisOptions} />
      <FormSection title="Tooltip" options={tooltipOptions} />
      <FormSection title="Legend" options={legendOptions} />
      <FormSection title="Markers" options={markerOptions} />
      <FormSection title="Stack" options={stackOptions} />

      {/* Series */}

      {series.map((serie, index) => {
        const serieProps = {
          index,
          serie: serie as IMetricSerie,
          setOptions: props.setOptions,
          visualization: props.options.config.visualization,
          serieFieldOptions: props.serieFieldOptions,
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
