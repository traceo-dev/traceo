import { SearchOutlined } from "@ant-design/icons";
import { Space } from "core/ui-components/Space";
import { joinClasses } from "../../core/utils/classes";
import { FC } from "react";
import { Typography } from "core/ui-components/Typography";

interface Props {
  label?: string;
  explanation?: string | JSX.Element;
  className?: string;
  showIcon?: boolean;
}
export const DataNotFound: FC<Props> = ({
  label = "No data found",
  explanation = "",
  className = "",
  showIcon = true
}) => (
  <Space
    direction="vertical"
    className={joinClasses("font-semibold w-full items-center pb-5 gap-0", className)}
  >
    {showIcon && <SearchOutlined className="text-2xl" />}
    <Typography>{label}</Typography>
    {explanation && (
      <Typography size="xxs" weight="normal">
        {explanation}
      </Typography>
    )}
  </Space>
);
