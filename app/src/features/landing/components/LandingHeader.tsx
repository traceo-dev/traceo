import { Row, Space, Layout, Button, Typography } from "antd";
import { TraceoLogo } from "src/core/components/Icons/TraceoLogo";

const { Header: AntHeader } = Layout;

export const LandingHeader = () => {
  return (
    <>
      <Space direction="vertical" className="gap-0 w-full">
        <AntHeader className="header">
          <Row className="w-full justify-between">
            <Space>
              <TraceoLogo size="small" withName={true} />
            </Space>
            <Space>
              <Typography.Link href="/login" className="menu-item">
                Log In
              </Typography.Link>
              <Button href="/signup" className="rounded-full" type="primary">
                Sign Up
              </Button>
            </Space>
          </Row>
        </AntHeader>
      </Space>
      <style>{`
        .header {
          height: auto;
          padding: 8px;
          padding-inline: 24px;
          line-height: inherit;
          background-color: transparent;
        }

        .menu-item {
            padding-right: 28px;
            color: #ccccdc !important;
        }
      `}</style>
    </>
  );
};

export default LandingHeader;
