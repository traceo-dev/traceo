import {
  DASHBOARD_PANEL_TYPE,
  DashboardPanel,
  DeepPartial,
  IMetricSerie,
  METRIC_UNIT,
  VISUALIZATION_TYPE
} from "@traceo/types";
import { Input, InputArea, InputColor, Select, SelectOptionProps, Switch } from "@traceo/ui";
import { DraftFunction } from "use-immer";
import { unitOptions, plotOptions, PanelEditOption } from "../utils";

type SerieFormProps = {
  index: number;
  serie: IMetricSerie;
  serieFieldOptions: SelectOptionProps[];
  setOptions: (arg: DashboardPanel | DraftFunction<DashboardPanel>) => void;
  panelType: DASHBOARD_PANEL_TYPE;
  visualization: VISUALIZATION_TYPE;
};
export const editPanelSerieForm = (props: SerieFormProps) => {
  const { index, serie, setOptions, visualization } = props;
  const forms: PanelEditOption[] = [];

  const isHistogram = visualization === VISUALIZATION_TYPE.HISTOGRAM;
  const config = serie.config;
  const serieType = config.type;
  const isArea = config.area.show;

  forms.push({
    label: "Color",
    component: (
      <InputColor
        pickerPlacement="left"
        color={config.color}
        onChange={(e) => {
          setOptions((opt) => {
            opt.config.series[index].config.color = e;
          });
        }}
      />
    )
  });

  forms.push({
    label: "Name",
    component: (
      <Input
        value={serie.name}
        onChange={(e) => {
          setOptions((opt) => {
            opt.config.series[index].name = e.target["value"];
          });
        }}
      />
    )
  });

  forms.push({
    label: "Description",
    component: (
      <InputArea
        value={serie.description}
        maxLength={99}
        onChange={(e) => {
          setOptions((opt) => {
            opt.config.series[index].description = e.target["value"];
          });
        }}
      />
    )
  });

  forms.push({
    label: "Field",
    component: (
      <Select
        options={props.serieFieldOptions}
        defaultValue={serie.field}
        onChange={(a) => {
          setOptions((opt) => {
            opt.config.series[index].field = a?.value;
          });
        }}
      />
    )
  });

  if (!isHistogram) {
    forms.push({
      label: "Unit",
      component: (
        <Select
          options={unitOptions}
          defaultValue={serie.unit ?? METRIC_UNIT.NONE}
          onChange={(a) => {
            setOptions((opt) => {
              opt.config.series[index].unit = a?.value;
            });
          }}
        />
      )
    });

    forms.push({
      label: "Plot type",
      component: (
        <Select
          options={plotOptions}
          defaultValue={serieType}
          onChange={(a) => {
            setOptions((opt) => {
              opt.config.series[index].config.type = a?.value;
            });
          }}
        />
      )
    });
  }

  forms.push({
    label: serieType === "bar" ? "Bar border width" : "Line width",
    component: (
      <Input
        type="number"
        min={0}
        max={10}
        value={config.lineWidth}
        onChange={(e) => {
          if (e.target["value"] <= 10) {
            setOptions((opt) => {
              opt.config.series[index].config.lineWidth = Number(e.target["value"]);
            });
          }
        }}
      />
    )
  });

  if (serieType === "bar") {
    forms.push({
      label: "Bar width",
      component: (
        <Input
          type="number"
          min={1}
          max={100}
          value={config.barWidth}
          onChange={(e) => {
            if (e.target["value"] <= 100) {
              setOptions((opt) => {
                opt.config.series[index].config.barWidth = Number(e.target["value"]);
              });
            }
          }}
        />
      )
    });
  }

  if (serieType !== "points") {
    forms.push({
      label: ["line", "spline"].includes(serieType) ? "Show area" : "Fill bars",
      labelPosition: "horizontal",
      component: (
        <Switch
          value={config.area?.show}
          onChange={(e) => {
            setOptions((opt) => {
              opt.config.series[index].config.area.show = e.target["checked"];
            });
          }}
        />
      )
    });
  }

  if (isArea) {
    forms.push({
      label: "Opacity",
      component: (
        <Input
          type="number"
          min={0}
          max={100}
          value={config.area.opacity}
          onChange={(e) => {
            if (e.target["value"] <= 100) {
              setOptions((opt) => {
                opt.config.series[index].config.area.opacity = Number(e.target["value"]);
              });
            }
          }}
        />
      )
    });
  }

  return forms;
};
