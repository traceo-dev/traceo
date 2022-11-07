import { Card, Col, Space, Typography } from "antd";
import { VERSION } from "core/utils/constants";
import { FC } from "react";
import { TraceoLogo } from "../Icons/TraceoLogo";

interface Props {
  children: JSX.Element;
  title?: string;
}

export const AuthLayout: FC<Props> = ({ children, title }) => {
  return (
    <>
      <div className="wrapper">
        <Card className={"ant-card card"}>
          <Col span={24}>
            <Space
              direction="vertical"
              className="justify-center w-full items-center pb-4 mt-5"
            >
              <TraceoLogo size="medium" />

              {title && (
                <Typography className="font-semibold text-3xl">{title}</Typography>
              )}

              <Typography.Text className="w-full text-xs">v.{VERSION}</Typography.Text>
            </Space>
            <div className="cardBody">{children}</div>
          </Col>
        </Card>
      </div>
      <style>{`
        .wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px 0;
          height: 100vh;
        }

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
