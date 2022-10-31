import { Button, Result } from "antd";
import Link from "antd/lib/typography/Link";

const NotFound = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, but this page does not exists."
      extra={
        <Link href={"/"}>
          <Button type="primary">Log In</Button>
        </Link>
      }
    />
  );
};

export default NotFound;
