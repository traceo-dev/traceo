import { RightOutlined, DownOutlined, DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, conditionClass, joinClasses } from "@traceo/ui";
import { useState } from "react";

interface Props {
  title?: string | JSX.Element;
  deafultCollapsed?: boolean;
  children: JSX.Element | JSX.Element[];
  footer?: JSX.Element;
  loading?: boolean;
}
export const OptionsCollapseGroup = ({
  title,
  children,
  deafultCollapsed = true,
  footer = undefined,
  loading = false
}: Props) => {
  const [collapsed, setCollapsed] = useState<boolean>(deafultCollapsed);

  const icon = collapsed ? <RightOutlined /> : <DownOutlined />;

  return (
    <div className="mb-2 p-2 pb-0 text-sm w-full flex flex-col cursor-pointer rounded bg-primary">
      <div
        onClick={() => setCollapsed(!collapsed)}
        className="flex flex-row items-center p-2 gap-x-3 justify-between w-full"
      >
        <div className="flex flex-row item-center gap-x-2">
          <span className="text-[8px]">{icon}</span>
          <span className="font-semibold text-primary">{title}</span>
        </div>
        {loading && <LoadingOutlined />}
      </div>

      {!collapsed && (
        <div className="p-3 border border-top border-secondary text-primary">{children}</div>
      )}

      {footer && <div className="pl-5 py-3">{footer}</div>}
    </div>
  );
};
