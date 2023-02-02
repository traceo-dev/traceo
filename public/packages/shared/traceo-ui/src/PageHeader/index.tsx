import { Space } from "../Space";
import { joinClasses } from "../utils/classes";
import { FC } from "react";
import { Typography } from "../Typography";

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
    <Space className={joinClasses("w-full justify-between pb-5 text-primary", className)}>
      <Space>
        {icon && <div className="pr-2 text-5xl">{icon}</div>}

        <Space className="flex flex-col text-start gap-0 w-full">
          <span className="text-3xl pt-2 w-full font-semibold">{title}</span>
          {description && <span className="w-full text-sm">{description}</span>}
        </Space>
      </Space>
      {suffix}
    </Space>
  );
};
