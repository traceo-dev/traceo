import { QuestionCircleOutlined } from "@ant-design/icons";
import { joinClasses } from "../utils/classes";
import { FC, PropsWithChildren } from "react";
import { Tooltip } from "../Tooltip";
import { Row } from "../Row";

export type LabelPosition = "vertical" | "horizontal";
interface FieldLabelProps {
  label: string;
  className?: string;
  tooltip?: string;
  labelSize?: "xs" | "sm" | "md";
  labelPosition?: LabelPosition;
}
export const FieldLabel: FC<PropsWithChildren<FieldLabelProps>> = ({
  label,
  children,
  className,
  tooltip = null,
  labelSize = "sm",
  labelPosition = "vertical"
}) => {
  const mapStyle: Record<LabelPosition, string> = {
    vertical: "flex flex-col",
    horizontal: "flex flex-row items-center justify-between h-full"
  };

  return (
    <div className={joinClasses("mb-5", mapStyle[labelPosition], className)}>
      <Row gap="x-2" className="mb-2">
        <span className={joinClasses("font-semibold", `text-${labelSize}`)}>{label}</span>
        {tooltip && (
          <Tooltip title={tooltip}>
            <QuestionCircleOutlined className="hover:text-primary cursor-pointer" />
          </Tooltip>
        )}
      </Row>
      {children}
    </div>
  );
};
