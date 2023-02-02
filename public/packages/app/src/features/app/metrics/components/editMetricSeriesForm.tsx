import { BarChartOutlined, DotChartOutlined, LineChartOutlined } from "@ant-design/icons";
import {
  DeepPartial,
  IMetric,
  IMetricSerie,
  METRIC_UNIT,
  PLOT_TYPE
} from "@traceo/types";
import {
  Divider,
  FieldLabel,
  Input,
  InputArea,
  LabelPosition,
  Select,
  Space,
  Switch
} from "@traceo/ui";
import { DraftFunction } from "use-immer";

const mapPlotName: Record<PLOT_TYPE, string> = {
  bar: "Bar",
  line: "Line",
  points: "Points"
};

const mapPlotIcon: Record<PLOT_TYPE, JSX.Element> = {
  bar: <BarChartOutlined />,
  line: <LineChartOutlined />,
  points: <DotChartOutlined />
};

const plotOptions = Object.values(PLOT_TYPE).map((type) => ({
  value: type,
  label: mapPlotName[type],
  icon: mapPlotIcon[type]
}));

interface MetricEditOption {
  label: string;
  labelPosition?: LabelPosition;
  component: JSX.Element;
}

type EditMetricType = {
  options: DeepPartial<IMetric>;
  setOptions: (arg: DeepPartial<IMetric> | DraftFunction<DeepPartial<IMetric>>) => void;
};
export const editMetricSeriesForm = (props: EditMetricType) => {
  const { options, setOptions } = props;
  const forms: MetricEditOption[] = [];

  options.series.forEach((serie, index) => {
    forms.push({
      label: serie.name,
      component: (
        <div className="w-full">
          {editSerieForm({
            index,
            serie: serie as IMetricSerie,
            setOptions
          }).map((opt, index2) => (
            <FieldLabel key={index2} label={opt.label} labelPosition={opt.labelPosition}>
              {opt.component}
            </FieldLabel>
          ))}
          <Divider />
        </div>
      )
    });
  });

  return forms;
};

type SerieFormProps = {
  index: number;
  serie: IMetricSerie;
} & Pick<EditMetricType, "setOptions">;
const editSerieForm = (props: SerieFormProps) => {
  const { index, serie, setOptions } = props;
  const forms: MetricEditOption[] = [];

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
    label: "Field",
    component: (
      <Input
        value={serie.field}
        onChange={(e) => {
          setOptions((opt) => {
            opt.series[index].field = e.target["value"];
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

  return forms;
};
