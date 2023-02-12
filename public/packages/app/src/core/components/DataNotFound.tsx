import { SearchOutlined } from "@ant-design/icons";
import { Space, Typography } from "@traceo/ui";
import { joinClasses } from "../utils/classes";
import { FC } from "react";

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
    <Typography weight="semibold">{label}</Typography>
    {explanation && (
      <Typography size="xxs" weight="normal">
        {explanation}
      </Typography>
    )}
  </Space>
);
