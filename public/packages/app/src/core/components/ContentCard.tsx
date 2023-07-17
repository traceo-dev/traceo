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
      tooltip = undefined,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={joinClasses(
          "flex flex-col bg-primary border border-solid border-[#26282e] rounded-[2px] mb-1 relative",
          conditionClass(loading, "loading-border"),
          className
        )}
        {...props}
      >
        {(name || extra) && (
          <Row className="justify-between px-3 py-1.5 select-none">
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

        <div className={joinClasses("my-1 p-2 overflow-y-auto h-full", bodyClassName)}>
          {children}
        </div>
      </div>
    );
  }
);
