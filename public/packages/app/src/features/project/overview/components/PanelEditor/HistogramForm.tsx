import { FormSection } from "./CustomizeFormSection";
import { Fragment, useMemo } from "react";
import { editPanelLegendForm } from "./editPanelGraphForm";
import { editPanelHistogramForm } from "./editPanelHistogramForm";
import { FormProps } from "./types";

export const HistogramForm = (props: FormProps) => {
  const [legendOptions, histogramOptions] = useMemo(
    () => [editPanelLegendForm(props), editPanelHistogramForm(props)],
    [props.options]
  );

  return (
    <Fragment>
      <FormSection title="Histogram" options={histogramOptions} />
      <FormSection title="Legend" options={legendOptions} />
    </Fragment>
  );
};
