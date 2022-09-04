import { Space, Typography } from "antd";
import { FC } from "react";

interface Props {
  constraints?: string;
}
export const EmptyIncidentList: FC<Props> = ({ constraints }) => {
  return (
    <>
      <Space direction="vertical" className="pt-5">
        <Typography.Text className="text-3xl font-bold" strong>
          Incidents not found
        </Typography.Text>
        {constraints && (
          <Typography.Text>
            No results for <b>{constraints}</b>
          </Typography.Text>
        )}
      </Space>
    </>
  );
};
