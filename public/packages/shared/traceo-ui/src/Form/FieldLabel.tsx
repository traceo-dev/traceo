import { joinClasses } from "../utils/classes";
import { FC, PropsWithChildren } from "react";

export type LabelPosition = "vertical" | "horizontal";
interface FieldLabelProps {
  label: string;
  className?: string;
  labelPosition?: LabelPosition;
}
export const FieldLabel: FC<PropsWithChildren<FieldLabelProps>> = ({
  label,
  children,
  className,
  labelPosition = "vertical",
}) => {
  const mapStyle: Record<LabelPosition, string> = {
    vertical: "flex flex-col",
    horizontal: "flex flex-row items-center justify-between h-full",
  };

  return (
    <div className={joinClasses("mb-5", mapStyle[labelPosition], className)}>
      <span className="text-sm font-semibold mb-2">{label}</span>
      {children}
    </div>
  );
};
