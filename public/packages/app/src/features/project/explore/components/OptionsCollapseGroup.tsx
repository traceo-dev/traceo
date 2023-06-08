import { RightOutlined, DownOutlined } from "@ant-design/icons";
import { Row, conditionClass, joinClasses } from "@traceo/ui";
import { useState } from "react";

interface Props {
  title?: string | JSX.Element;
  collapsedText?: string | JSX.Element;
  deafultCollapsed?: boolean;
  children: JSX.Element | JSX.Element[];
  footer?: JSX.Element;
  extra?: JSX.Element;
  loading?: boolean;
}
export const OptionsCollapseGroup = ({
  title = undefined,
  collapsedText = undefined,
  children,
  deafultCollapsed = true,
  footer = undefined,
  extra = undefined,
  loading = false
}: Props) => {
  const [collapsed, setCollapsed] = useState<boolean>(deafultCollapsed);

  const icon = collapsed ? <RightOutlined /> : <DownOutlined />;

  return (
    <div
      className={joinClasses(
        "mb-2 p-3 pb-0 text-sm w-full flex flex-col rounded bg-primary border border-solid border-secondary rounded-sm",
        conditionClass(loading, "loading-border")
      )}
    >
      <Row gap="x-3" className="justify-between w-full pr-3">
        <Row
          gap="x-2"
          className="gap-x-2 cursor-pointer select-none"
          onClick={() => setCollapsed(!collapsed)}
        >
          <span className="text-[8px]">{icon}</span>
          <span className="font-semibold">{title}</span>
          {collapsedText && collapsed && (
            <span className="pl-5 text-xs font-normal italic">{collapsedText}</span>
          )}
        </Row>
        {extra && extra}
      </Row>

      {!collapsed && <div className="p-3 pt-5 overflow-x-auto">{children}</div>}

      {footer && <div className="pl-5 py-3">{footer}</div>}
    </div>
  );
};
