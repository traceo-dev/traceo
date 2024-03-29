import { Space, Typography } from "@traceo/ui";
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
  if (hidden) {
    return null;
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-12">
        <div className="col-span-6">
          <div className="flex flex-col">
            <Typography size="lg" weight="semibold">
              {title}
            </Typography>
            <Space className="w-3/4 pt-2">
              <Typography size="sm">{subtitle}</Typography>
            </Space>
          </div>
        </div>
        <div className="col-span-6">{children}</div>
      </div>
    </div>
  );
};
