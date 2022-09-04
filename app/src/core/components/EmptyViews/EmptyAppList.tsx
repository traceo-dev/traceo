import { PlusOutlined } from "@ant-design/icons";
import { Button, Space, Typography } from "antd";
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
        {/* <BorderOutlined className="text-5xl text-cyan-500" /> */}
        <Typography.Text className="text-3xl font-bold" strong>
          Applications not found
        </Typography.Text>
        {constraints ? (
          <Typography.Text>
            No results for <b>{constraints}</b>
          </Typography.Text>
        ) : (
          <>
            <Typography.Text>
              To fully use the Traceo platform, you must first create your own
              application. Share app with the people who need it and and work together to
              solve new problems together.{" "}
            </Typography.Text>
            <Button
              onClick={() => setOpenApplicationModal(true)}
              className="secondary-btn mt-5"
            >
              <PlusOutlined /> Create an app
            </Button>
          </>
        )}
      </Space>
      <CreateApplicationDrawer
        isOpen={openApplicationModal}
        onCancel={() => setOpenApplicationModal(false)}
      />
    </>
  );
};
