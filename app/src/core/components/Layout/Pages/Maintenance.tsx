import { Space, Typography } from "antd";
import { Page } from "../../Page";

const Maintenance = () => {
  return (
    <Page>
      <Space direction="vertical" className="w-full text-center">
        <Typography.Title className="text-6xl mb-0">Under maintenance</Typography.Title>
        <Typography.Text className="mt-5">
          We apologise for any incoveniences caused.
        </Typography.Text>
        <Typography.Text>We&apos;ve almost done!</Typography.Text>
      </Space>
    </Page>
  );
};

export default Maintenance;
