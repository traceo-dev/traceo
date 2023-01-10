import { Card, Space } from "antd";
import { VERSION } from "../../../core/utils/constants";
import { FC } from "react";
import { TraceoLogo } from "../Icons/TraceoLogo";
import { Typography } from "core/ui-components/Typography/Typography";

interface Props {
  children: JSX.Element;
  title?: string;
}

export const AuthLayout: FC<Props> = ({ children, title }) => {
  return (
    <>
      <div className="flex justify-center">
        <Card className="ant-card card pt-12">
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
          <div className="cardBody">{children}</div>
        </Card>
      </div>
      <style>{`
        .card {
          width: 450px;
          border-radius: 18px;
          min-height: calc(60vh);
          max-width: calc(100vw - 20px);
          background-color: transparent;
          border: none;
        }
        
        .cardBody {
          padding: 14px 14px 0;
          margin-top: 25px;
        }
      `}</style>
    </>
  );
};

export default AuthLayout;
