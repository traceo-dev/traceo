import { FC } from "react";

export const InlineFields: FC = ({ children }) => {
  return <div className="grid grid-cols-12 pb-3 gap-x-3">{children}</div>;
};
