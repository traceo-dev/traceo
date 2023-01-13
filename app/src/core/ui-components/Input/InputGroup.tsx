import { joinClasses } from "core/utils/classes";
import { FC } from "react";

interface Props {
  children?: JSX.Element[];
  className?: string;
}
export const InputGroup: FC<Props> = ({ children, className }) => {
  return <div className={joinClasses("flex", className)}>{children}</div>;
};
