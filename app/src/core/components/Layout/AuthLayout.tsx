import { Space } from "antd";
import { VERSION } from "../../../core/utils/constants";
import { FC } from "react";
import { TraceoLogo } from "../Icons/TraceoLogo";
import { Typography } from "core/ui-components/Typography/Typography";
import { Card } from "core/ui-components/Card/Card";

interface Props {
  children: JSX.Element;
  title?: string;
}

export const AuthLayout: FC<Props> = ({ children, title }) => {
  return (
    <div className="pt-12">
      <Space
        direction="vertical"
        className="justify-center w-full items-center pb-4 mt-5"
      >
        <TraceoLogo size="medium" />

        {title && (
          <Typography size="xxl" weight="semibold">
            {title}
          </Typography>
        )}

        <Typography size="xs">v.{VERSION}</Typography>
      </Space>
      <div className="justify-center items-center pt-12">{children}</div>
    </div>
  );
};

export default AuthLayout;
