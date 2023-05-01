import { joinClasses } from "@traceo/ui";
import { FC } from "react";
import { Link } from "react-router-dom";

interface Props {
  to: string;
  className?: string;
}
export const RouterLink: FC<Props> = ({ children, to, className }) => {
  return (
    <Link to={to} className={joinClasses("text-primary hover:text-white", className)}>
      {children}
    </Link>
  );
};
