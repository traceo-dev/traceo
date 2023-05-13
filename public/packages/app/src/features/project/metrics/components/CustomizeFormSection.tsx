import {
  DeleteOutlined,
  DownOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  RightOutlined
} from "@ant-design/icons";
import { Tooltip } from "@traceo/ui";
import { FC, useState } from "react";

interface Props {
  title: string;
  description?: string;
  defaultMetric?: boolean;
  defaultCollapsed?: boolean;
  show?: boolean;
  onDelete?: () => void;
  onHide?: () => void;
}
export const CustomizeFormSection: FC<Props> = ({
  children,
  title,
  description,
  show = true,
  defaultMetric = false,
  defaultCollapsed = true,
  onHide,
  onDelete
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(defaultCollapsed);

  const icon = collapsed ? <RightOutlined /> : <DownOutlined />;

  const onRemove = (e: any) => {
    e.stopPropagation();
    onDelete();
  };

  const onHideSection = (e: any) => {
    e.stopPropagation();
    onHide();
  };

  const eyeIcon = (
    <Tooltip title={show ? "Hide serie" : "Show serie"}>
      <div className="hover:text-blue-400" onClick={onHideSection}>
        {show ? <EyeOutlined /> : <EyeInvisibleOutlined />}
      </div>
    </Tooltip>
  );

  const trashIcon = (
    <Tooltip title="Remove serie">
      <DeleteOutlined className="hover:text-red-400" onClick={onRemove} />
    </Tooltip>
  );

  return (
    <>
      <div
        onClick={() => setCollapsed(!collapsed)}
        className="items-center w-full flex flex-row justify-between px-1 py-2 cursor-pointer text-primary hover:bg-light-secondary hover:text-white duration-200"
      >
        <div className="flex flex-row items-center justify-between w-full">
          <div className="flex flex-row items-center">
            <div className="mr-2 text-2xs">{icon}</div>
            <div className="w-full flex flex-col gap-y-0">
              <span className="text-sm font-semibold">{title}</span>
              {description && <span className="text-xs">{description}</span>}
            </div>
          </div>
          {!defaultMetric && (
            <div className="flex flex-row items-center gap-x-5">
              {onHideSection && eyeIcon}
              {onDelete && trashIcon}
            </div>
          )}
        </div>
      </div>
      {!collapsed && <div className="pl-4 pr-2 pt-5">{children}</div>}
    </>
  );
};
