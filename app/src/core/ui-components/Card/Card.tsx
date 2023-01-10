import { joinClasses } from "core/utils/classes";
import { FC, PropsWithChildren, HTMLProps } from "react";
import { Typography } from "../Typography/Typography";

export interface CardProps extends Omit<HTMLProps<HTMLElement>, "title" | "ref"> {
  icon?: JSX.Element;
  title?: string | JSX.Element;
  extra?: JSX.Element;
  className?: string;
  bodyClassName?: string;
  loadingContent?: boolean;
}
export const Card: FC<PropsWithChildren<CardProps>> = ({
  icon,
  title,
  extra,
  children,
  className,
  bodyClassName,
  ...rest
}) => {
  const cardTitle =
    typeof title === "string" ? (
      <Typography className="text-[15px] tracking-wider" weight="semibold">
        {title}
      </Typography>
    ) : (
      title
    );

  return (
    <div
      className={joinClasses(
        "w-full p-0 m-0 mb-1 text-md leading-5 relative bg-primary h-full",
        className
      )}
      {...rest}
    >
      {(title || icon) && (
        <div className="flex flex-row w-full px-6 py-5 items-center justify-between border-t-0 border-l-0 border-r-0 border-b border-solid border-[#303030]">
          <div className="flex flex-row w-full">
            {icon && <div className="mr-2">{icon}</div>}
            {cardTitle}
          </div>

          {extra && extra}
        </div>
      )}

      <div className={joinClasses("p-6 w-full", bodyClassName)}>{children}</div>
    </div>
  );
};

Card.displayName = "Card";
