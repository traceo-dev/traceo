import { QuestionCircleFilled } from "@ant-design/icons";
import { Row, Tooltip, conditionClass, joinClasses } from "@traceo/ui";
import { HTMLProps, forwardRef } from "react";

interface Props extends Omit<HTMLProps<HTMLDivElement>, "name" | "className"> {
  name?: JSX.Element | string;
  tooltip?: string;
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
      tooltip = undefined,
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
            {name && (
              <div className="flex flex-row gap-x-2 leading-none items-center cursor-pointer">
                <span className="font-semibold text-sm">{name}</span>
                {tooltip && (
                  <Tooltip title={tooltip}>
                    <QuestionCircleFilled className="text-2xs" />
                  </Tooltip>
                )}
              </div>
            )}
            {extra}
          </Row>
        )}

        <div className={joinClasses("mt-1 p-2 h-full", bodyClassName)}>{children}</div>
      </div>
    );
  }
);
