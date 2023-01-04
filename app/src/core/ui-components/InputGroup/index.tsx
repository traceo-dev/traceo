import { FC } from "react";

interface Props {
  children?: JSX.Element[];
}
export const InputGroup: FC<Props> = ({ children }) => {
  return <div className="flex">{children}</div>;
};
