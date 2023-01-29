import { Space } from "../Space";
import { joinClasses } from "../utils/classes";
import { FC } from "react";

export interface PageHeaderProps {
  title: string | JSX.Element;
  description?: string | JSX.Element;
  suffix?: string | JSX.Element;
  icon?: JSX.Element;
  className?: string;
}

export const PageHeader: FC<PageHeaderProps> = ({
  title,
  description,
  suffix,
  icon,
  className,
}) => {
  return (
    <Space className={joinClasses("w-full justify-between pb-5", className)}>
      <Space>
        {icon && <div className="pr-2 text-4xl">{icon}</div>}

        <div className="inline-grid gap-0">
          <span className="pt-2 text-2xl">{title}</span>
          <span className="font-normal text-sm">{description}</span>
        </div>
      </Space>
      {suffix}
    </Space>
  );
};
