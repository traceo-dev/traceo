import { Card, CardProps } from "./Card";
import { FC, PropsWithChildren, HTMLProps } from "react";
import { joinClasses } from "core/utils/classes";

interface ListCardProps extends Omit<HTMLProps<HTMLElement>, "ref"> {
  className?: string;
}
export const ListCard: FC<PropsWithChildren<ListCardProps>> = ({
  className,
  children,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={joinClasses(
        "w-full p-4 m-0 mb-1 text-md leading-5 relative bg-secondary hover:bg-light-secondary rounded-md h-full cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
};

ListCard.displayName = "ListCard";
