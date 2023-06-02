import { Row, conditionClass, joinClasses } from "@traceo/ui";
import { FC, HTMLProps } from "react";
import { To, useNavigate } from "react-router-dom";

interface Props extends Omit<HTMLProps<HTMLElement>, "ref"> {
  name?: string;
  extra?: JSX.Element;
  className?: string;
  bodyClassName?: string;
  loading?: boolean;
  to?: To;
}

export const ContentCard: FC<Props> = ({
  extra = undefined,
  name = undefined,
  className = "",
  bodyClassName = "",
  children,
  loading = false,
  to = undefined,
  ...props
}) => {
  const navigate = useNavigate();
  return (
    <div
      className={joinClasses(
        "flex flex-col w-full bg-primary border border-solid border-secondary rounded mb-1",
        conditionClass(loading, "loading-border"),
        className
      )}
      {...props}
    >
      <Row className="justify-between px-5 py-3">
        {name && (
          <span
            className="font-semibold text-sm cursor-pointer"
            onClick={() => to && navigate(to)}
          >
            {name}
          </span>
        )}
        {extra}
      </Row>
      <div className={joinClasses("p-3 mt-5", bodyClassName)}>{children}</div>
    </div>
  );
};
