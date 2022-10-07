import { Space, Typography } from "antd";
import { FC } from "react";

interface Props {
  title: string;
  constraints?: string;
  subtitle?: string;
  action?: JSX.Element;
}
export const EmptyList: FC<Props> = ({ title, subtitle, constraints, action }) => {
  return (
    <>
      <Space direction="vertical" className="pt-5">
        <Typography.Text className="text-3xl font-bold" strong>
          {title}
        </Typography.Text>
        {constraints && (
          <Typography.Text>
            No results for <b>{constraints}</b>
          </Typography.Text>
        )}
        {subtitle && <Typography.Text>{subtitle}</Typography.Text>}
        {action && action}
      </Space>
    </>
  );
};
