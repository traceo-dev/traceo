import { Row, conditionClass, joinClasses } from "@traceo/ui";
import { HTMLProps, forwardRef } from "react";

interface Props extends Omit<HTMLProps<HTMLDivElement>, "name" | "className"> {
  name?: JSX.Element | string;
  extra?: JSX.Element;
  className?: string;
  bodyClassName?: string;
  loading?: boolean;
  isDraggable?: boolean;
}

export const ContentCard = forwardRef<any, Props>(
  (
    {
      extra = undefined,
      name = undefined,
      className = "",
      bodyClassName = "",
      children,
      loading = false,
      isDraggable = false,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={joinClasses(
          "flex flex-col bg-primary border border-solid border-secondary rounded-sm mb-1",
          conditionClass(loading, "loading-border"),
          className
        )}
        {...props}
      >
        {(name || extra) && (
          <Row
            className={joinClasses(
              "justify-between px-3 py-3 select-none",
              conditionClass(isDraggable, "drag-handle cursor-move")
            )}
          >
            {name && <span className="font-semibold text-sm">{name}</span>}
            {extra}
          </Row>
        )}

        <div className={joinClasses("mt-1 p-2 h-full", bodyClassName)}>{children}</div>
      </div>
    );
  }
);
