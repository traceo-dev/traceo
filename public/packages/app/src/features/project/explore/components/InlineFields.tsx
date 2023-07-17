import React from "react";

type ChildrenType<T = any> = {
  children: React.ReactNode | React.ReactNode[];
} & T;

export const InlineFields: ChildrenType = ({ children }) => {
  return <div className="grid grid-cols-12 pb-3 gap-x-3">{children}</div>;
};
