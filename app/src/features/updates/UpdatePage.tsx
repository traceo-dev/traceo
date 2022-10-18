import { ExclamationCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Space, Typography } from "antd";
import { DashboardPage } from "../dashboard/components/DashboardPage";
import PageHeader from "../../core/components/PageHeader";
import { PagePanel } from "../../core/components/PagePanel";

export const UpdatePage = () => {
  return (
    <DashboardPage>
      <PageHeader
        icon={<InfoCircleOutlined />}
        title={"Updates"}
        subTitle={"Recent informations about updates in Traceo app"}
      />
      <PagePanel className="mt-3">
        <Space direction="vertical">
          <Typography.Title className="font-normal text-xl">
            <ExclamationCircleOutlined className="pr-3 text-orange-500" />
            Traceo is now in preview mode
          </Typography.Title>
          <Typography.Paragraph>
            Traceo is currently in preview mode. For this reason, there may be
            unpredictable interruptions in access to the service, the inability to log in
            to the website and the possibility of losing collected data. We sincerely
            apologize for any difficulties.
          </Typography.Paragraph>
        </Space>
      </PagePanel>
      <PagePanel className="mt-3">
        <Space direction="vertical">
          <Typography.Title className="font-normal text-xl">
            Welcome in Traceo!
          </Typography.Title>
          <Typography.Paragraph>
            Thanks to us, you will be informed in real time about problems with your
            software by collecting information about exceptions occurring in your
            application! Right now, integration with Traceo is only possible for NodeJS
            based environments using the Traceo SDK which can be found in the NPM package
            manager. SDKs for other platforms such as Java and Python will be released
            soon. All information needed to fully integrate your environment with the
            Traceo application can be found{" "}
            <a href="https://google.com" target="_blank" rel="noreferrer">
              here
            </a>
            .
          </Typography.Paragraph>
        </Space>
      </PagePanel>
    </DashboardPage>
  );
};

export default UpdatePage;
