import { SearchOutlined } from "@ant-design/icons";
import { Space, Typography } from "antd";
import { joinClasses } from "core/utils/classes";
import { FC } from "react";

interface Props {
  label?: string;
  explanation?: string;
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
    <Typography.Text>{label}</Typography.Text>
    {explanation && (
      <Typography.Text className="text-xs font-normal">{explanation}</Typography.Text>
    )}
  </Space>
);
