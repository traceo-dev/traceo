import { Layout, Row } from "antd";
import dateUtils from "../../../core/utils/date";
import { CONTACT_EMAIL, VERSION } from "../../../core/utils/constants";
import { Typography } from "core/ui-components/Typography";

export const Footer = () => {
  const { Footer: AntFooter } = Layout;

  const onOpen = () => window.open(`mailto:${CONTACT_EMAIL}`);

  return (
    <>
      <AntFooter className="p-4 bg-transparent mt-12 relative bottom-0 w-full">
        <Row className="text-xs w-full justify-center">
          <Typography className="text-primary pipe">
            © {new Date().getFullYear()} Traceo Platform
          </Typography>
          <Typography onClick={onOpen} className="text-primary pipe cursor-pointer">
            Contact
          </Typography>
          <Typography className="text-primary pipe">
            {dateUtils.guessTz()} timezone
          </Typography>
          <Typography className="text-primary">v.{VERSION}</Typography>
        </Row>
      </AntFooter>
    </>
  );
};

export default Footer;
