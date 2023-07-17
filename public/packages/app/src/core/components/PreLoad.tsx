import { FC, Fragment } from "react";
import { LoadingOutlined } from "@ant-design/icons";

export const PreLoad: FC<{ isLoading: boolean }> = ({ isLoading, children }) => {
  return isLoading ? <LoadingOutlined /> : <Fragment>{children}</Fragment>;
};
