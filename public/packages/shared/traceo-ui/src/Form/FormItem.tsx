import { conditionClass, joinClasses } from "../utils/classes";
import { REQUIRED_FIELD_ERROR } from "../utils/constants";
import React, { FC } from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import {
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { clearObject } from "../utils/object";
import { Tooltip } from "../Tooltip";

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
    disabled = false,
    tooltip,
  } = props;

  const formLabel =
    typeof label === "string" ? (
      <span className="flex flex-row gap-x-2">
        {label}
        {tooltip && (
          <Tooltip title={tooltip}>
            <QuestionCircleOutlined className="cursor-pointer" />
          </Tooltip>
        )}
        {showRequiredMark ? "*" : null}
      </span>
    ) : (
      label
    );

  const isErrorMessage = error?.message?.toString().length > 0;
  const errorMessage = isErrorMessage
    ? (error?.message as string)
    : error?.type === "required" && isErrorMessage
    ? (error?.message as string)
    : REQUIRED_FIELD_ERROR;

  const childrenProps = clearObject({
    suffix: error ? (
      <ExclamationCircleOutlined className="text-red-500 font-semibold" />
    ) : null,
    isFocusable: !error,
    disabled,
    className: "text-sm",
  });

  return (
    <div className={joinClasses("flex flex-col text-start mb-5", className)}>
      {label && <span className="mb-2 font-semibold text-sm">{formLabel}</span>}
      <div
        className={conditionClass(!!error, "ring-2 ring-red-500 rounded-md")}
      >
        {React.cloneElement(children, childrenProps)}
      </div>
      {/* TODO: Make it later as information in tooltip for suffix icon */}
      {error && (
        <div className="text-xs font-semibold relative inline-block pt-2 text-red-500">
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

FormItem.displayName = "FormItem";
