import { ExclamationCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Space, Typography } from "antd";
import { DashboardPage } from "src/core/components/Layout/Pages/DashboardPage";
import PageHeader from "src/core/components/PageHeader";
import { PagePanel } from "src/core/components/PagePanel";

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
          <Typography.Title style={{ fontSize: 24 }} className="font-normal">
            Free Basic Plan
          </Typography.Title>
          <Typography.Paragraph style={{ fontSize: 14 }}>
            A free basic plan is available to all new Traceo users. This plan provides for
            the possibility of creating up to 3 applications, inviting up to 5 members to
            each application, and storing incident data for up to two weeks (excluding
            statistics). You will be notified at least two weeks in advance of any plan
            changes and new paid plans to choose a plan that fits your needs.
          </Typography.Paragraph>
        </Space>
      </PagePanel>
      <PagePanel className="mt-3">
        <Space direction="vertical">
          <Typography.Title style={{ fontSize: 24 }} className="font-normal">
            <ExclamationCircleOutlined className="pr-3 text-orange-500" />
            Traceo is now in preview mode
          </Typography.Title>
          <Typography.Paragraph style={{ fontSize: 14 }}>
            Traceo is currently in preview mode. For this reason, there may be
            unpredictable interruptions in access to the service, the inability to log in
            to the website and the possibility of losing collected data. We sincerely
            apologize for any difficulties.
          </Typography.Paragraph>
        </Space>
      </PagePanel>
      <PagePanel className="mt-3">
        <Space direction="vertical">
          <Typography.Title style={{ fontSize: 24 }} className="font-normal">
            Welcome in Traceo!
          </Typography.Title>
          <Typography.Paragraph style={{ fontSize: 14 }}>
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
