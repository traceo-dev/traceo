import { Space, Typography } from "antd";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { joinClasses } from "../utils/classes";

interface Props {
  title: string;
  className?: string;
  href?: string;
  actionLabel?: string;
  fontSize?: number;
}
export const PagePanelHeader: FC<Props> = ({
  title,
  className,
  href,
  actionLabel,
  fontSize = 24
}) => {
  const navigate = useNavigate();

  return (
    <Space className={joinClasses("w-full justify-between", className)}>
      <Typography.Text style={{ fontSize }} className="font-semibold text-primary">
        {title}
      </Typography.Text>
      {href && (
        <Typography.Link
          onClick={() => navigate(href)}
          className="text-xs color-secondary font-semibold"
        >
          {!actionLabel ? "View more" : actionLabel}
        </Typography.Link>
      )}
    </Space>
  );
};
