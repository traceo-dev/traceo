import { WarningOutlined, PlusOutlined } from "@ant-design/icons";
import { IMetricSerie } from "@traceo/types";
import { FieldLabel, Tooltip, Alert, Row } from "@traceo/ui";
import { CustomizeFormSection } from "../CustomizeFormSection";
import { editSerieForm } from "../editMetricSeriesForm";
import { isStackAvailable } from "../utils";
import { useMemo } from "react";
import { randomHexColor } from "../../../../../core/utils/colors";
import {
  editMetricTooltipForm,
  editMetricAxisForm,
  editMetricLegendForm,
  editMetricMarkerForm,
  editMetricStackForm
} from "../editMetricGraphForm";
import { AddSerieBtn } from "./components";
import { FormProps } from "./types";

export const TimeseriesForm = (props: FormProps) => {
  const series = props.options.config.series;
  const [tooltipOptions, axisOptions, legendOptions, markerOptions, stackOptions] = useMemo(
    () => [
      editMetricTooltipForm(props),
      editMetricAxisForm(props),
      editMetricLegendForm(props),
      editMetricMarkerForm(props),
      editMetricStackForm(props)
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
    props.data.push([]);
    props.setOptions((opt) => {
      opt.config.series.push({
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
        description: undefined
      });
    });
  };

  return (
    <>
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
      <CustomizeFormSection
        title="Stack"
        extra={
          !isStackAvailable && (
            <Tooltip title="Set the same type for each series to allow stack.">
              <WarningOutlined className="text-red-600" />
            </Tooltip>
          )
        }
      >
        {stackOptions.map((opt, index) => (
          <FieldLabel
            key={index}
            label={opt.label}
            labelPosition={opt?.labelPosition}
            labelSize="xs"
          >
            {opt.component}
          </FieldLabel>
        ))}
        <Alert
          type="info"
          className="mb-3"
          message={
            <span className="text-xs">
              Learn more about stacked series{" "}
              <a
                target="_blank"
                className="text-yellow-500"
                href="https://web.archive.org/web/20221208193656/https://everydayanalytics.ca/2014/08/stacked-area-graphs-are-not-your-friend.html"
              >
                here.
              </a>
            </span>
          }
        />
      </CustomizeFormSection>

      {/* Series */}

      {series.map((serie, index) => (
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
            show={serie?.show}
            onDelete={() => onDeleteSerie(serie as IMetricSerie)}
          >
            <>
              {editSerieForm({
                index,
                serie: serie as IMetricSerie,
                setOptions: props.setOptions,
                type: props.options.type,
                serieFieldOptions: props.serieFieldOptions
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
