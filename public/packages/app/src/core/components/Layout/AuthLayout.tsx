import { VERSION } from "../../utils/constants";
import { TraceoLogo } from "../Icons/TraceoLogo";
import { Space, Typography } from "@traceo/ui";
import { FC } from "react";

interface Props {
  children: JSX.Element;
  title?: string;
}

export const AuthLayout: FC<Props> = ({ children, title }) => {
  return (
    <div className="w-full grid grid-cols-2">
      <div className="col-span-1"></div>
      <div className="col-span-1 bg-primary">
        <div className="flex h-screen justify-center items-center">
          <div className="text-white p-12 max-w-md w-full">
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
      </div>
    </div>
  );
};

export default AuthLayout;
