import { Layout, Row, Typography } from "antd";

export const Footer = () => {
  const { Footer: AntFooter } = Layout;

  return (
    <>
      <AntFooter className="p-4 bg-transparent mt-12 relative bottom-0 w-full">
        <Row className="text-xs w-full justify-center">
          <Typography.Text className="text-primary pipe">Feedback</Typography.Text>
          <Typography.Text className="text-primary pipe">
            © {new Date().getFullYear()} Traceo Cloud
          </Typography.Text>
          <Typography.Text className="text-primary">
            v.{process.env.REACT_APP_VERSION}
          </Typography.Text>
        </Row>
      </AntFooter>
      <style>{`
        .pipe:after {
          content: " | ";
          padding: 0 8px;
        }
      `}</style>
    </>
  );
};

export default Footer;
