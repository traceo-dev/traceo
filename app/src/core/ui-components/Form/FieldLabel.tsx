import { joinClasses } from "core/utils/classes";
import { FC } from "react";

interface FieldLabelProps {
  label: string;
  className?: string;
}
export const FieldLabel: FC<FieldLabelProps> = ({ label, children, className }) => {
  return (
    <div className={joinClasses("flex flex-col w-full", className)}>
      <span className="text-md font-semibold mb-2">{label}</span>
      {children}
    </div>
  );
};
