import { DownOutlined, RightOutlined } from "@ant-design/icons";
import { FC, useState } from "react";

interface Props {
  title: string;
  description?: string;
  defaultCollapsed?: boolean;
}
export const CustomizeFormSection: FC<Props> = ({
  children,
  title,
  description,
  defaultCollapsed = true
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(defaultCollapsed);

  const icon = collapsed ? <RightOutlined /> : <DownOutlined />;

  return (
    <div className="border-b border-t-0 border-r-0 border-l-0 border-solid border-light-secondary">
      <div
        onClick={() => setCollapsed(!collapsed)}
        className="items-center w-full flex flex-row justify-between px-1 py-2 cursor-pointer text-primary hover:bg-light-secondary hover:text-white duration-200"
      >
        <div className="flex flex-row items-center">
          <div className="mr-2 text-2xs">{icon}</div>
          <div className="w-full flex flex-col gap-y-0">
            <span className="text-sm font-semibold">{title}</span>
            {description && <span className="text-xs">{description}</span>}
          </div>
        </div>
      </div>
      {!collapsed && <div className="pl-4 pr-2 pt-5">{children}</div>}
    </div>
  );
};
