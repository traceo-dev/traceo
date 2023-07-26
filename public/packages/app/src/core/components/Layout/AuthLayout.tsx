import { TraceoLogo } from "../Icons/TraceoLogo";
import { Row, Space, Typography } from "@traceo/ui";
import { FC } from "react";
import { useUser } from "../../../core/hooks/useUser";

interface Props {
  children: JSX.Element;
  title?: string;
}

export const AuthLayout: FC<Props> = ({ children, title }) => {
  const { isLoggedIn } = useUser();

  if (isLoggedIn) {
    window.location.href = "/dashboard/projects";
  }
  
  return (
    <div className="w-full grid grid-cols-2">
      <div className="col-span-1">
        <div className="flex h-screen items-center justify-center flex-col">
          <Row>
            <TraceoLogo size="medium" />
            <div className="flex flex-col text-primary pl-3">
              <span className="text-[24px] font-semibold">Traceo</span>
              <span className="text-xs">Take control of your projects</span>
            </div>
          </Row>
        </div>
      </div>
      <div className="col-span-1 bg-primary">
        <div className="flex h-screen justify-center items-center">
          <div className="text-white p-12 max-w-md w-full">
            <Space direction="vertical" className="pb-12">
              {title && <span className="font-semibold text-3xl text-primary">{title}</span>}
              <Typography>Please log in to your account.</Typography>
            </Space>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
