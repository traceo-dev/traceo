import { FormSection } from "./CustomizeFormSection";
import { Fragment, useMemo } from "react";
import { FormProps } from "./types";
import { editPanelTextForm } from "./editPanelTextForm";

export const TextForm = (props: FormProps) => {
  const [textOptions] = useMemo(() => [editPanelTextForm(props)], [props.options]);

  return (
    <Fragment>
      <FormSection title="Text" options={textOptions} />
    </Fragment>
  );
};
