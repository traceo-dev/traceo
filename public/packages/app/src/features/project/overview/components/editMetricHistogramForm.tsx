import { DashboardPanel, DeepPartial } from "@traceo/types";
import { DraftFunction } from "use-immer";
import { MetricEditOption } from "./utils";
import { Input, Switch } from "@traceo/ui";

interface Props {
  options: DeepPartial<DashboardPanel>;
  setOptions: (
    arg: DeepPartial<DashboardPanel> | DraftFunction<DeepPartial<DashboardPanel>>
  ) => void;
}

export const editMetricHistogramForm = (props: Props) => {
  const { options, setOptions } = props;
  const forms: MetricEditOption[] = [];

  const config = options.config;

  forms.push({
    label: "Bucket size",
    component: (
      <Input
        type="number"
        min={1}
        max={100}
        value={config.histogram?.bucket?.size}
        onChange={(e) => {
          if (e.target["value"] <= 100) {
            setOptions((opt) => {
              opt.config.histogram.bucket.size = Number(e.target["value"]);
            });
          }
        }}
      />
    )
  });

  forms.push({
    label: "Inlcude zero",
    labelPosition: "horizontal",
    component: (
      <Switch
        value={config.histogram?.min === 0}
        onChange={(e) => {
          setOptions((opt) => {
            opt.config.histogram.min = e.target["checked"] ? 0 : 1;
          });
        }}
      />
    )
  });

  // forms.push({
  //   label: "Min",
  //   component: (
  //     <Input
  //       type="number"
  //       value={options.config.histogram?.min}
  //       onChange={(e) => {
  //         setOptions((opt) => {
  //           opt.config.histogram.min = Number(e.target["value"]);
  //         });
  //       }}
  //     />
  //   )
  // });

  // forms.push({
  //   label: "Max",
  //   component: (
  //     <Input
  //       type="number"
  //       min={1}
  //       value={options.config.histogram?.max}
  //       onChange={(e) => {
  //         setOptions((opt) => {
  //           opt.config.histogram.max = Number(e.target["value"]);
  //         });
  //       }}
  //     />
  //   )
  // });

  // forms.push({
  //   label: "Bucket offset",
  //   component: (
  //     <Input
  //       type="number"
  //       min={1}
  //       max={100}
  //       value={options.config.histogram?.bucket.offset}
  //       onChange={(e) => {
  //         if (e.target["value"] <= 100) {
  //           setOptions((opt) => {
  //             opt.config.histogram.bucket.offset = Number(e.target["value"]);
  //           });
  //         }
  //       }}
  //     />
  //   )
  // });

  return forms;
};
