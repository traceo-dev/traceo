import { DeepPartial, IMetric, IMetricSerie, METRIC_UNIT } from "@traceo/types";
import { Input, InputArea, InputColor, Select, Switch } from "@traceo/ui";
import { DraftFunction } from "use-immer";
import { unitOptions, plotOptions, MetricEditOption } from "./utils";

type SerieFormProps = {
  index: number;
  serie: IMetricSerie;
  isDefault: boolean;
  setOptions: (arg: DeepPartial<IMetric> | DraftFunction<DeepPartial<IMetric>>) => void;
};
export const editSerieForm = (props: SerieFormProps) => {
  const { index, serie, setOptions, isDefault } = props;
  const forms: MetricEditOption[] = [];

  forms.push({
    label: "Color",
    component: (
      <InputColor
        pickerPlacement="left"
        color={serie.config.color}
        onChange={(e) => {
          setOptions((opt) => {
            opt.series[index].config.color = e;
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
            opt.series[index].name = e.target["value"];
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
            opt.series[index].description = e.target["value"];
          });
        }}
      />
    )
  });

  forms.push({
    label: "Field",
    component: (
      <Input
        value={serie.field}
        disabled={isDefault}
        onChange={(e) => {
          setOptions((opt) => {
            opt.series[index].field = e.target["value"];
          });
        }}
      />
    )
  });

  forms.push({
    label: "Unit",
    component: (
      <Select
        isDisabled={isDefault}
        options={unitOptions}
        defaultValue={serie.unit ?? METRIC_UNIT.NONE}
        onChange={(a) => {
          setOptions((opt) => {
            opt.series[index].unit = a?.value;
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
        defaultValue={serie.config.type}
        onChange={(a) => {
          setOptions((opt) => {
            opt.series[index].config.type = a?.value;
          });
        }}
      />
    )
  });

  if (serie.config.type === "line") {
    forms.push({
      label: "Line width",
      component: (
        <Input
          type="number"
          min={0}
          max={10}
          value={serie.config.lineWidth}
          onChange={(e) => {
            if (e.target["value"] <= 10) {
              setOptions((opt) => {
                opt.series[index].config.lineWidth = Number(e.target["value"]);
              });
            }
          }}
        />
      )
    });

    forms.push({
      label: "Show area",
      labelPosition: "horizontal",
      component: (
        <Switch
          value={serie.config.area?.show}
          onChange={(e) => {
            setOptions((opt) => {
              opt.series[index].config.area.show = e.target["checked"];
            });
          }}
        />
      )
    });

    if (serie.config.area.show) {
      forms.push({
        label: "Area opacity",
        component: (
          <Input
            type="number"
            min={0}
            max={100}
            value={serie.config.area.opacity}
            onChange={(e) => {
              if (e.target["value"] <= 100) {
                setOptions((opt) => {
                  opt.series[index].config.area.opacity = Number(e.target["value"]);
                });
              }
            }}
          />
        )
      });
    }
  }

  if (serie.config.type === "bar") {
    forms.push({
      label: "Bar width",
      component: (
        <Input
          type="number"
          min={1}
          max={100}
          value={serie.config.barWidth}
          onChange={(e) => {
            if (e.target["value"] <= 100) {
              setOptions((opt) => {
                opt.series[index].config.barWidth = Number(e.target["value"]);
              });
            }
          }}
        />
      )
    });
  }

  return forms;
};
