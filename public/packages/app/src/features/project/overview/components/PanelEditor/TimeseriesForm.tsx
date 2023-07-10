import { FormSection } from "./CustomizeFormSection";
import { Fragment, useMemo } from "react";
import {
  editPanelTooltipForm,
  editPanelAxisForm,
  editPanelLegendForm,
  editPanelMarkerForm,
  editPanelStackForm
} from "./editPanelGraphForm";
import { FormProps } from "./types";

export const TimeseriesForm = (props: FormProps) => {
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

  return (
    <Fragment>
      <FormSection title="Axis" options={axisOptions} />
      <FormSection title="Tooltip" options={tooltipOptions} />
      <FormSection title="Legend" options={legendOptions} />
      <FormSection title="Markers" options={markerOptions} />
      <FormSection title="Stack" options={stackOptions} />
    </Fragment>
  );
};
