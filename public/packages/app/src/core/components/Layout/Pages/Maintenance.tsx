import { Space, Typography } from "@traceo/ui";
import { Page } from "../../Page";

const Maintenance = () => {
  return (
    <Page>
      <Space direction="vertical" className="w-full text-center">
        <Typography size="xxxl">Under maintenance</Typography>
        <Typography className="mt-5">
          We apologise for any incoveniences caused.
        </Typography>
        <Typography>We&apos;ve almost done!</Typography>
      </Space>
    </Page>
  );
};

export default Maintenance;
