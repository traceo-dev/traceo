import { Layout, Row, Typography } from "antd";
import { CONTACT_EMAIL, VERSION } from "../../../core/utils/constants";

export const Footer = () => {
  const { Footer: AntFooter } = Layout;

  const onOpen = () => window.open(`mailto:${CONTACT_EMAIL}`);

  return (
    <>
      <AntFooter className="p-4 bg-transparent mt-12 relative bottom-0 w-full">
        <Row className="text-xs w-full justify-center">
          <Typography.Text className="text-primary pipe">
            © {new Date().getFullYear()} Traceo Cloud
          </Typography.Text>
          <Typography.Text onClick={onOpen} className="text-primary pipe cursor-pointer">
            Contact
          </Typography.Text>
          <Typography.Text className="text-primary">v.{VERSION}</Typography.Text>
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
