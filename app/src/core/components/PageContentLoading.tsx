import { LoadingOutlined } from "@ant-design/icons";
import { Card } from "core/ui-components/Card";
import { Space } from "core/ui-components/Space";
import { Typography } from "core/ui-components/Typography";
import { FC } from "react";

interface Props {
  isLoading: boolean;
}

export const PageContentLoading: FC<Props> = ({ isLoading, children }) => {
  if (isLoading) {
    return (
      <Card>
        <Space className="py-12 justify-center w-full">
          <Typography className="pr-2">Loading</Typography>
          <LoadingOutlined />
        </Space>
      </Card>
    );
  }

  return <>{children}</>;
};
