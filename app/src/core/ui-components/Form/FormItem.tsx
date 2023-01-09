import { conditionClass, joinClasses } from "core/utils/classes";
import { REQUIRED_FIELD_ERROR } from "core/utils/constants";
import React from "react";
import { FC } from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { clearObject } from "core/utils/object";

interface FormItemProps {
  label?: string;
  children: JSX.Element;
  showRequiredMark?: boolean;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  tooltip?: string;
  className?: string;
  disabled?: boolean;
}
export const FormItem: FC<FormItemProps> = (props: FormItemProps) => {
  const {
    children,
    label,
    error,
    showRequiredMark = false,
    className,
    disabled = false
  } = props;

  const formLabel =
    typeof label === "string" ? (
      <span>
        {label} {showRequiredMark ? "*" : null}
      </span>
    ) : (
      label
    );

  const isErrorMessage = error?.message?.toString().length > 0;
  const errorMessage = isErrorMessage
    ? error?.message
    : error?.type === "required" && isErrorMessage
    ? error?.message
    : REQUIRED_FIELD_ERROR;

  const childrenProps = clearObject({
    suffix: error ? (
      <ExclamationCircleOutlined className="text-red-500 font-semibold" />
    ) : null,
    isFocusable: !error,
    disabled
  });

  return (
    <div className={joinClasses("flex flex-col text-start mb-5", className)}>
      {label && <span className="mb-2 font-semibold text-md">{formLabel}</span>}
      <div className={conditionClass(!!error, "ring-2 ring-red-500 rounded-md")}>
        {React.cloneElement(children, childrenProps)}
      </div>
      {/* TODO: Make it later as information in tooltip for suffix icon */}
      {error && (
        <div className="relative inline-block pt-2 text-red-500">{errorMessage}</div>
      )}
    </div>
  );
};

FormItem.displayName = "FormItem";
