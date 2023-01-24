import { FC } from "react";
import { TraceoLoading } from "./TraceoLoading";

interface Props {
  isLoading: boolean;
}

export const PageContentLoading: FC<Props> = ({ isLoading, children }) => {
  if (isLoading) {
    return <TraceoLoading />;
  }

  return <>{children}</>;
};
