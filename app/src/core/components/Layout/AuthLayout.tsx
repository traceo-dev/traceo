import { Space } from "core/ui-components/Space/Space";
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
    <div className="flex h-screen justify-center items-center">
      <div
        style={{ width: "calc(100% - 2rem)" }}
        className="border border-solid border-secondary bg-primary rounded-lg drop-shadow-lg text-white p-12 max-w-md"
      >
        <Space direction="vertical" className="justify-center w-full items-center pb-12">
          <TraceoLogo size="medium" />

          {title && (
            <Typography size="xxl" weight="semibold">
              {title}
            </Typography>
          )}

          <Typography size="xs">v.{VERSION}</Typography>
        </Space>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
