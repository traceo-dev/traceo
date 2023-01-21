import { Space } from "core/ui-components/Space";
import { joinClasses } from "core/utils/classes";
import { FC } from "react";

interface PanelHeaderProps {
  title: string | JSX.Element;
  description?: string | JSX.Element;
  suffix?: string | JSX.Element;
  icon?: JSX.Element;
  className?: string;
}

export const PageHeader: FC<PanelHeaderProps> = ({
  title,
  description,
  suffix,
  icon,
  className
}) => {
  return (
    <Space className={joinClasses("w-full justify-between pb-5", className)}>
      <Space>
        {icon && <div className="pr-2 text-4xl">{icon}</div>}

        <div className="inline-grid gap-0">
          <span className="pt-2 text-2xl">{title}</span>
          <span className="font-normal text-md">{description}</span>
        </div>
      </Space>
      {suffix}
    </Space>
  );
};
