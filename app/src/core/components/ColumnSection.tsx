import { Space } from "antd";
import { Typography } from "core/ui-components/Typography/Typography";
import { FC } from "react";

interface Props {
  marginTop?: number;
  title?: string | JSX.Element;
  subtitle?: string | JSX.Element;
  className?: string;
  hidden?: boolean;
}

export const ColumnSection: FC<Props> = ({
  title,
  subtitle,
  children,
  className,
  hidden = false
}) => {
  return (
    !hidden && (
      <div className={className}>
        <div className="grid grid-cols-12">
          <div className="col-span-6">
            <div className="flex flex-col">
              <Typography size="xl" weight="semibold">
                {title}
              </Typography>
              <Space className="w-3/4 pt-3">
                <Typography size="sm">{subtitle}</Typography>
              </Space>
            </div>
          </div>
          <div className="col-span-6">{children}</div>
        </div>
      </div>
    )
  );
};
