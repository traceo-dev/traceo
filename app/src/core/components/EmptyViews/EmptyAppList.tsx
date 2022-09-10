import { Space, Typography } from "antd";
import { FC, useState } from "react";
import { CreateApplicationDrawer } from "../Drawers/CreateApplicationDrawer";

interface Props {
  constraints?: string;
}
export const EmptyAppList: FC<Props> = ({ constraints }) => {
  const [openApplicationModal, setOpenApplicationModal] = useState<boolean>(false);

  return (
    <>
      <Space direction="vertical" className="pt-5">
        <Typography.Text className="text-3xl font-bold" strong>
          Applications not found
        </Typography.Text>
        {constraints ? (
          <Typography.Text>
            No results for <b>{constraints}</b>
          </Typography.Text>
        ) : (
          <Typography.Text>
            Contact the administrator and start monitoring the applications.
          </Typography.Text>
        )}
      </Space>
      <CreateApplicationDrawer
        isOpen={openApplicationModal}
        onCancel={() => setOpenApplicationModal(false)}
      />
    </>
  );
};
