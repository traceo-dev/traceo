import { REQUIRED_FIELD_ERROR } from "core/utils/constants";
import { FC } from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface FormItemProps {
  label?: string;
  children: JSX.Element;
  required?: boolean;
  requiredMessage?: string;
  showRequiredMark?: boolean;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  tooltip?: string;
}
export const FormItem: FC<FormItemProps> = (props: FormItemProps) => {
  const {
    children,
    label,
    error,
    required,
    requiredMessage,
    showRequiredMark = false
  } = props;

  const formLabel =
    typeof label === "string" ? (
      <span>
        {label} {required && showRequiredMark ? "*" : null}
      </span>
    ) : (
      label
    );

  const isRequireMessage =
    requiredMessage?.length > 0 || error?.message?.toString()?.length > 0;

  const errorMessage =
    error?.type && error?.type === "required" && required
      ? isRequireMessage
        ? requiredMessage || error?.message
        : REQUIRED_FIELD_ERROR
      : null;

  return (
    <div className="flex flex-col text-start mb-5">
      {label && <span className="mb-2 font-semibold text-md">{formLabel}</span>}
      <div>{children}</div>

      {error && <span className="text-red-500 mt-1 font-semibold">{errorMessage}</span>}
    </div>
  );
};

FormItem.displayName = "FormItem";
