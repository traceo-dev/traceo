import { DeleteOutlined, DownOutlined, RightOutlined } from "@ant-design/icons";
import { FieldLabel, Row, Tooltip } from "@traceo/ui";
import { FC, useState } from "react";
import { PanelEditOption } from "../utils";

interface FormSectionProps {
  title: string;
  options: PanelEditOption[];
  defaultCollapsed?: boolean;
  extra?: JSX.Element;
}

export const FormSection = ({
  title,
  options,
  defaultCollapsed = true,
  extra
}: FormSectionProps) => {
  return (
    <CustomizeFormSection title={title} defaultCollapsed={defaultCollapsed} extra={extra}>
      {options.map((opt, index) => (
        <FieldLabel
          key={index}
          label={opt.label}
          labelPosition={opt?.labelPosition}
          tooltip={opt?.tooltip}
          labelSize="xs"
        >
          {opt.component}
        </FieldLabel>
      ))}
    </CustomizeFormSection>
  );
};

interface Props {
  title: string | JSX.Element;
  description?: string;
  defaultCollapsed?: boolean;
  onDelete?: () => void;
  extra?: JSX.Element;
}
export const CustomizeFormSection: FC<Props> = ({
  children = undefined,
  title = "",
  description = undefined,
  defaultCollapsed = true,
  onDelete = undefined,
  extra = undefined
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(defaultCollapsed);

  const icon = collapsed ? <RightOutlined /> : <DownOutlined />;

  const onRemove = (e: any) => {
    e.stopPropagation();
    onDelete();
  };

  const trashIcon = onDelete && (
    <Tooltip title="Remove serie">
      <DeleteOutlined className="hover:text-red-400 pl-2" onClick={onRemove} />
    </Tooltip>
  );

  return (
    <div className="border-bottom w-full flex flex-col text-primary text-sm select-none">
      <Row
        onClick={() => setCollapsed(!collapsed)}
        className="p-2 justify-between w-full hover:bg-secondary hover:text-white duration-200 cursor-pointer"
      >
        <Row>
          <div className="mr-2 text-[8px]">{icon}</div>
          <div className="w-full flex flex-col gap-y-0">
            <span className="text-[14px] font-[500] leading-[1.5]">{title}</span>
            {description && <span className="text-xs">{description}</span>}
          </div>
        </Row>
        <Row gap="x-5">
          {trashIcon}
          {extra}
        </Row>
      </Row>
      {!collapsed && <div className="pl-6 pr-3 pt-5">{children}</div>}
    </div>
  );
};
