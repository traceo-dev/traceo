import { Row } from "../Row";
import { Typography } from "../Typography";
import { conditionClass, joinClasses } from "../utils/classes";
import { DownOutlined, LoadingOutlined, RightOutlined } from "@ant-design/icons";
import { FC, useEffect, useState } from "react";

interface CollapseItemProps {
  header?: string | JSX.Element;
  showIcon?: boolean;
  children?: JSX.Element;
  collapsible?: boolean;
  collapseIconPosition?: "start" | "end";
  startIcon?: JSX.Element;
  loading?: boolean;
  className?: string;
  ghost?: boolean;
  defaultActiveKey?: string | number;
  panelKey?: string | number;
}
export const CollapseItem: FC<CollapseItemProps> = ({
  children,
  header,
  showIcon = true,
  collapsible = true,
  loading = false,
  startIcon,
  className,
  ghost,
  collapseIconPosition = "end",
  defaultActiveKey,
  panelKey
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(true);

  useEffect(() => {
    if (defaultActiveKey && defaultActiveKey === panelKey) {
      setCollapsed(false);
    }
  }, [defaultActiveKey, panelKey]);

  const icon = collapsed ? <RightOutlined /> : <DownOutlined />;

  const itemHeader = typeof header === "string" ? <Typography>{header}</Typography> : header;

  const collapseIcon = (
    <div className="text-xs">
      {showIcon && collapsible && (loading ? <LoadingOutlined /> : icon)}
    </div>
  );

  return (
    <>
      <div
        onClick={() => setCollapsed(!collapsed)}
        className={joinClasses(
          "text-sm items-center w-full flex flex-row justify-between p-3 cursor-pointer",
          conditionClass(
            !ghost,
            "rounded bg-secondary border border-solid border-light-secondary"
          ),
          className
        )}
      >
        <Row>
          {collapseIconPosition === "start" && <div className="mr-2">{collapseIcon}</div>}
          {startIcon && <div className="mr-2">{startIcon}</div>}
          {header && <Typography>{itemHeader}</Typography>}
        </Row>

        {collapseIconPosition === "end" && collapseIcon}
      </div>
      {!collapsed && (
        <div
          className={joinClasses(
            "py-3 px-4 text-start",
            conditionClass(!ghost, "rounded border border-solid border-light-secondary")
          )}
        >
          {children}
        </div>
      )}
    </>
  );
};
