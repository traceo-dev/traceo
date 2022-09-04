import {
  ArrowRightOutlined,
  BarChartOutlined,
  CodeOutlined,
  RightOutlined,
  TeamOutlined
} from "@ant-design/icons";
import { Button, Card, Col, Row, Space, Steps, Typography } from "antd";
import { Page } from "src/core/components/Page";
import LandingHeader from "./components/LandingHeader";

const { Step } = Steps;

const LandingPage = () => {
  return (
    <>
      <Space className="p-8 w-full" direction="vertical">
        <LandingHeader />
        <Page isFooter={false}>
          <>
            <Space className="w-full text-center pt-12 gap-0 px-72" direction="vertical">
              <Typography.Title className="text-5xl">
                Your errors in our hands
              </Typography.Title>
              <Typography.Text>
                Traceo is a service that helps gather information about problems in your
                software. Implement our lightweight npm package and control your
                application easier.
              </Typography.Text>
              <Button
                href="/signup"
                className="mt-12 rounded-full bg-transparent hover:bg-blue-500 hover:border-blue-500 border-2 text-semibold hover:text-white text-blue-400 border-blue-500"
                type="primary"
              >
                Get started for free
              </Button>
            </Space>
            <Row className="pt-32 w-full" gutter={[8, 24]}>
              <Col className="card" span={8}>
                <Card>
                  <Space direction="vertical" className="gap-0">
                    <CodeOutlined className="text-3xl" />
                    <Typography.Text className="text-xl">
                      Start your integration
                    </Typography.Text>
                    <Typography.Text className="text-gray-300 text-xs">
                      Get started with Traceo in 15 minutes
                    </Typography.Text>
                    <Space className="pt-5">
                      <Typography.Link className="text-cyan-600 text-xs font-semibold">
                        Read the docs
                        <RightOutlined className="text-2xs pl-2" />
                      </Typography.Link>
                    </Space>
                  </Space>
                </Card>
              </Col>
              <Col className="card" span={8}>
                <Card>
                  <Space direction="vertical" className="gap-0">
                    <BarChartOutlined className="text-3xl" />
                    <Typography.Text className="text-xl">Analyze</Typography.Text>
                    <Typography.Text className="text-gray-300 text-xs">
                      View errors on an intuitive and simple dashboard
                    </Typography.Text>
                    <Space className="pt-5">
                      <Typography.Link className="text-cyan-600 text-xs font-semibold">
                        Show
                        <RightOutlined className="text-2xs pl-2" />
                      </Typography.Link>
                    </Space>
                  </Space>
                </Card>
              </Col>
              <Col className="card" span={8}>
                <Card>
                  <Space direction="vertical" className="gap-0">
                    <TeamOutlined className="text-3xl" />
                    <Typography.Text className="text-xl">Cooperate</Typography.Text>
                    <Typography.Text className="text-gray-300 text-xs">
                      Invite members of your team to collaborate on solving further
                      problems
                    </Typography.Text>
                  </Space>
                </Card>
              </Col>
            </Row>
          </>
        </Page>
      </Space>
      <style>{`
        .card .ant-card {
          margin: 12px !important;
          border-radius: 12px !important;
          background-color: transparent;
          height: 180px !important;
        }
      `}</style>
    </>
  );
};

export default LandingPage;
